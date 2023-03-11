import { message as Toast } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/button'
import Input from '../../../components/input'
import LiquidationAttributes from '../../../components/liquidationAttributes'
import LiquidationHeader from '../../../components/liquidationHeader'
import LoadingIndicator from '../../../components/loadingIndicator'
import Text from '../../../components/text'
import { LIQUIDATION_DUCK, REQUEST_STATUS, ROUTES } from '../../../core/actions'
import { useAxios } from '../../../core/AxiosContext'
import { useGlobal, useGlobalDispatch } from '../../../core/GlobalContext'
import { createLiquidationSendOTPAction, createLiquidationVerifyOTPAction } from '../LiquidationDuck'
import * as styles from './Liquidate.css'

export const Liquidate = () => {
  const {
    liquidationState: { dealCode, dealTransactionCode, name, status, message, data },
  } = useGlobal()
  const { liquidationDispatch } = useGlobalDispatch()
  const { authAxios } = useAxios()
  const navigate = useNavigate()

  const [displayMessage, setDisplayMessage] = useState('')
  const [otp, setOtp] = useState('')

  const handleOTPChange = val => {
    setOtp(val.trim())
  }

  const handleBackPress = () => {
    liquidationDispatch({ type: LIQUIDATION_DUCK.EOL })
    navigate(ROUTES.PORTFOLIO)
  }

  const handleConfirmLiquidation = () => {
    createLiquidationSendOTPAction(dealCode, dealTransactionCode, data?.liquidationId)(authAxios, liquidationDispatch)
  }

  const handleSubmitOTP = () => {
    createLiquidationVerifyOTPAction(
      dealCode,
      dealTransactionCode,
      data?.liquidationId,
      otp
    )(authAxios, liquidationDispatch)
  }

  const handleViewOfferForSale = () => {
    window.open(data?.offerForSaleDoc, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    switch (name) {
      case LIQUIDATION_DUCK.SEND_OTP:
        setDisplayMessage(message)
        break
      case LIQUIDATION_DUCK.RESEND_OTP:
        break
      default:
        break
    }
  }, [name, message])

  useEffect(() => {
    if (name === LIQUIDATION_DUCK.VERIFY_OTP && status === REQUEST_STATUS.SUCCESS) {
      handleBackPress()
      Toast.success('Deal has been successfully Liquidated. Check Liquidation requested tab for status on it')
    } else if (name === LIQUIDATION_DUCK.VERIFY_OTP && status === REQUEST_STATUS.FAILURE) {
      handleBackPress()
      Toast.error('Deal liquidation verification failure. Please try liquidating after a while.')
    }
  }, [name, status])

  return (
    <div className={styles.liquidate}>
      <LiquidationHeader handleBackPress={handleBackPress} dealCode={dealTransactionCode} />

      {status === REQUEST_STATUS.PENDING && name === LIQUIDATION_DUCK.CREATE_LIQUIDATION ? (
        <LoadingIndicator />
      ) : (
        <div className={styles.liquidationCard}>
          <LiquidationAttributes liquidationData={data} />

          {data?.isAR && (
            <Text size='0.8'>
              We provide zero cost liquidity for this deal. Hence no liquidation cost will be applicable.
            </Text>
          )}

          {data?.offerForSaleDoc && (
            <div>
              <Text size='0.95' color='#2C3E50' bold>
                Offer For Sale —
              </Text>
              <Button label='View document' type='text' handleClick={handleViewOfferForSale} />
            </div>
          )}

          <Text size='0.8' color='#35A37E'>
            {displayMessage}
          </Text>

          {name === LIQUIDATION_DUCK.SEND_OTP || name === LIQUIDATION_DUCK.RESEND_OTP ? (
            <div className={styles.inputWrapper}>
              <Text value='For validating deal liquidation'></Text>
              <div className={styles.inputSubmitBtn}>
                <Input placeholder='Enter OTP' value={otp} onChange={handleOTPChange} />
                <Button handleClick={handleSubmitOTP}>Submit OTP</Button>
              </div>
            </div>
          ) : null}

          {name === LIQUIDATION_DUCK.CREATE_LIQUIDATION && status === REQUEST_STATUS.SUCCESS && (
            <div className={styles.confirmLiquidationButton}>
              <Button handleClick={handleConfirmLiquidation}>Proceed to liquidate</Button>
            </div>
          )}

          {name === LIQUIDATION_DUCK.VERIFY_OTP && status === REQUEST_STATUS.PENDING && <LoadingIndicator />}
        </div>
      )}
    </div>
  )
}
