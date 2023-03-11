import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/button'
import Cashfree from '../../../components/cashfree'
import LoadingIndicator from '../../../components/loadingIndicator'
import Text from '../../../components/text'
import { REQUEST_STATUS, ROUTES } from '../../../core/actions'
import { useAxios } from '../../../core/AxiosContext'
import { INR, TRADECRED_SUPPORT_EMAIL } from '../../../core/constants'
import { useGlobal, useGlobalDispatch } from '../../../core/GlobalContext'
import { currencyParser } from '../../../utils/misc'
import { fetchFinancierAction } from '../../financier/FinancierDuck'
import * as styles from './Deposit.css'

export const Deposit = () => {
  const { authAxios } = useAxios()
  const {
    financierState: { financier, status },
  } = useGlobal()
  const { financierDispatch } = useGlobalDispatch()
  const navigate = useNavigate()

  const handleBackPress = () => navigate(ROUTES.OVERVIEW)

  // TODO Engineer a way to remove this call from every page and have it just once
  useEffect(() => {
    fetchFinancierAction()(authAxios, financierDispatch)
  }, [authAxios, financierDispatch])

  return (
    <div className={styles.deposit}>
      <div className={styles.header}>
        <Button handleClick={handleBackPress} type='icon'>
          <ion-icon name='arrow-back-outline' />
        </Button>
        <Text size='1.5' color='#273746' bold>
          Deposit {INR} to wallet
        </Text>
      </div>
      <Text size='0.8' color='#838e9f'>
        Deposit money from your bank account to your Escrow Account (TradeCred Wallet)
      </Text>
      <div className={styles.divider} />

      {status === REQUEST_STATUS.PENDING ? (
        <LoadingIndicator />
      ) : financier?.escrow?.accountNumber ? (
        <div className={styles.depositDetails}>
          <div className={styles.availableBalance}>
            <Text size='1.2'>Available Wallet Balance</Text>
            <Text size='1.2' bold number>
              {currencyParser(financier?.walletBalance)}
            </Text>
          </div>
          <Text size='0.85' color='#838e9f'>
            To deposit via UPI or Netbanking
          </Text>
          <Cashfree type='Deposit' enabled={true} />
          <Text size='0.85' color='#838e9f'>
            Note: Amount may take{' '}
            <Text size='0.9' color='#7B6E66' bold>
              up to 48 hours
            </Text>{' '}
            to reflect in your wallet
          </Text>
          <div className={styles.divider}></div>

          <Text color='#d62650'>
            Please do not use <strong>IMPS</strong>
          </Text>
          <Text>
            For <strong>NEFT or RTGS</strong> transfers, add your escrow account as
            <strong> Other Bank Beneficiary</strong> in your bank account
          </Text>
          <Text size='1.1' color='#616161' bold className={styles.escrowAccount}>
            Your Escrow Account Details
          </Text>
          <div className={styles.bankDetailsView}>
            <div className={styles.bankDetailsAttr}>
              <Text>Beneficiary Name</Text>
              <Text>Account Number</Text>
              <Text>Bank Name</Text>
              <Text>IFSC</Text>
              <Text>Account Type</Text>
            </div>
            <div className={styles.bankDetailsAttr}>
              <Text bold>{financier?.escrow?.holderName}</Text>
              <Text bold number>
                {financier?.escrow?.accountNumber}
              </Text>
              <Text bold>{financier?.escrow?.bankName}</Text>
              <Text bold>{financier?.escrow?.IFSC}</Text>
              <Text bold>Current Account</Text>
            </div>
          </div>
          <div className={styles.divider}></div>

          <Text size='0.85' color='#838e9f'>
            In case the amount is not credited within 48 hours, please reach out to us at {TRADECRED_SUPPORT_EMAIL}{' '}
            before raising dispute with your bank.
          </Text>
        </div>
      ) : (
        <div className={styles.depositDetails}>
          <Text>Oops! We couldn&apos;t find your escrow account details</Text>
          <Text>
            Please send an email to {TRADECRED_SUPPORT_EMAIL} and ask them to allot an escrow bank account to your
            account.
          </Text>
        </div>
      )}
    </div>
  )
}
