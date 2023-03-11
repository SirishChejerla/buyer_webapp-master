import { message as Toast } from 'antd'
import React, { useCallback, useEffect } from 'react'
import { COS_DUCK, REQUEST_STATUS } from '../../core/actions'
import { useAxios } from '../../core/AxiosContext'
import { TRADECRED_ASSET_LOGO } from '../../core/constants'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import {
  createDealTransactionAction,
  fetchSignUrlAction,
  resetConfirmationOfSigningAction,
  verifyDealPurchaseAction,
} from '../../routes/deals/ConfirmationOfSigningDuck'
import Button from '../button'
import CosProgress from '../cosProgress'
import LoadingIndicator from '../loadingIndicator'
import Text from '../text'
import * as styles from './ConfirmationOfSigning.css'

export const ConfirmationOfSigning = ({ purchase, purchaseAmount, setShowSigning }) => {
  const { dealCode, dealLiquidationId, type } = purchase
  const {
    confirmationOfSigningState,
    financierState: {
      financier: { financierId },
    },
  } = useGlobal()
  const { confirmationOfSigningDispatch } = useGlobalDispatch()
  const { authAxios } = useAxios()

  const leegality_obj = {
    logoUrl: TRADECRED_ASSET_LOGO,
    callback: response => {
      if (response?.message) {
        console.log('Leegality Signing Success', response?.message, ' DocumentId - ', response?.documentId)
        const { dealTransactionCode } = confirmationOfSigningState
        verifyDealPurchaseAction(dealCode, dealTransactionCode, type)(authAxios, confirmationOfSigningDispatch)
      } else {
        console.log('Leegality Signing Failure reason - ', response?.error)
        cancelPurchase()
      }
    },
  }

  const leegality = new window.Leegality(leegality_obj)

  const cancelPurchase = useCallback(() => {
    setShowSigning(false)
    resetConfirmationOfSigningAction(confirmationOfSigningDispatch)
  }, [confirmationOfSigningDispatch])

  // Toast handling
  useEffect(() => {
    const { message, status, name } = confirmationOfSigningState
    if (status === REQUEST_STATUS.FAILURE) {
      let text1 = 'Purchasing Failed'
      let text2 = 'Try again in a while'
      const formattedMessage = message ? message : 'Unexpected error, we are working on it!'

      switch (name) {
        case COS_DUCK.CREATE_DEAL_TRANSACTION:
          text1 = 'Creating Deal Transaction Failed'
          text2 = `${formattedMessage}`
          break
        case COS_DUCK.VERIFY_DEAL_PURCHASE:
          // TODO when VERIFY_DEAL_PURCHASE FAILS and has 304, return deal purchased successfully but ask user to wait
          // Consider count as well, in order not to show multiple alerts
          text1 = 'Verifying purchase document'
          text2 = `Check your portfolio after few mins`
          break
        default:
          break
      }
      console.log('Toast', text1, text2)
      Toast.error(`${text1}. ${text2}`)
    }
    if (name === COS_DUCK.VERIFY_DEAL_PURCHASE && status === REQUEST_STATUS.SUCCESS) {
      console.log('Toast Success', 'Deal Purchased Sus')
      Toast.success(`Deal Purchased successfully`)
    }
  }, [confirmationOfSigningState])

  useEffect(() => {
    const { dealCode, dealTransactionCode, name, status, message, count, signUrl } = confirmationOfSigningState
    let timeoutId

    switch (name) {
      case COS_DUCK.CREATE_DEAL_TRANSACTION:
        if (status === REQUEST_STATUS.SUCCESS) {
          fetchSignUrlAction(dealCode, dealTransactionCode, type)(authAxios, confirmationOfSigningDispatch)
        }
        if (status === REQUEST_STATUS.FAILURE) {
          cancelPurchase()
        }
        break
      case COS_DUCK.FETCH_SIGN_URL:
        if (status === REQUEST_STATUS.FAILURE) {
          if (count === 1) {
            fetchSignUrlAction(dealCode, dealTransactionCode, type)(authAxios, confirmationOfSigningDispatch)
          } else {
            cancelPurchase()
          }
        } else if (status === REQUEST_STATUS.SUCCESS) {
          leegality.init()
          leegality.esign(signUrl)
        }
        break
      case COS_DUCK.VERIFY_DEAL_PURCHASE:
        // TODO Handle successful retries and failure scenarios
        if (status === REQUEST_STATUS.SUCCESS) {
          // Success case is handled by Purchase Verification with a success screen
          // As it is successful navigate back to DEALS and clear state
          cancelPurchase()
        }
        if (status === REQUEST_STATUS.FAILURE) {
          // Backend en.yml - purchase_in_progress
          // Retry 3 times with a delay b/w requests
          if (message === 304 && count <= 3) {
            // Wait 1000ms before verify purchase's response and another request
            timeoutId = setTimeout(() => {
              console.log(count, Date(Date.now()))
              verifyDealPurchaseAction(dealCode, dealTransactionCode, type)(authAxios, confirmationOfSigningDispatch)
            }, 2000)
          } else {
            cancelPurchase()
          }
        }
        break
      default:
        // Handle rest of the cases where failure happens
        if (status === REQUEST_STATUS.FAILURE) {
          cancelPurchase()
        }
        break
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [authAxios, confirmationOfSigningState, confirmationOfSigningDispatch, type, cancelPurchase])

  const createDealTransaction = useCallback(() => {
    createDealTransactionAction({ dealCode, type, financierId, purchaseAmount, dealLiquidationId })(
      authAxios,
      confirmationOfSigningDispatch
    )
  }, [authAxios, confirmationOfSigningDispatch, dealCode, type, financierId, purchaseAmount, dealLiquidationId])

  useEffect(() => {
    if (confirmationOfSigningState?.name === COS_DUCK.EOL) {
      createDealTransaction()
    }
  }, [createDealTransaction, confirmationOfSigningState])

  return (
    <div className={styles.cos}>
      {/* Header */}
      <div className={styles.header}>
        <Text bold>Purchasing - {dealCode}</Text>
        <Button type='danger' handleClick={cancelPurchase} label='Cancel'></Button>
      </div>
      <CosProgress />
      {confirmationOfSigningState?.status === REQUEST_STATUS.PENDING && <LoadingIndicator scale={0.5} />}
    </div>
  )
}
