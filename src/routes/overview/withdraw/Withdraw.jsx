import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/button'
import Cashfree from '../../../components/cashfree'
import ChangeBankAccount from '../../../components/changeBankAccount'
import Text from '../../../components/text'
import WithdrawalReasons from '../../../components/withdrawalReasons'
import { REQUEST_STATUS, ROUTES } from '../../../core/actions'
import { useAxios } from '../../../core/AxiosContext'
import { INR, TRADECRED_SUPPORT_EMAIL } from '../../../core/constants'
import { useGlobal, useGlobalDispatch } from '../../../core/GlobalContext'
import { currencyParser } from '../../../utils/misc'
import { fetchFinancierAction } from '../../financier/FinancierDuck'
import * as styles from '../deposit/Deposit.css'

export const Withdraw = () => {
  const { authAxios } = useAxios()
  const {
    financierState: { financier },
    overviewState: { cashfreeStatus, cashfreeType },
  } = useGlobal()
  const { financierDispatch } = useGlobalDispatch()
  const navigate = useNavigate()

  const [withdrawalReason, setWithdrawalReason] = useState()

  const handleBackPress = () => navigate(ROUTES.OVERVIEW)

  // TODO Engineer a way to remove this call from every page and have it just once
  useEffect(() => {
    fetchFinancierAction()(authAxios, financierDispatch)
  }, [authAxios, financierDispatch])

  // Refresh wallet balance after successful withdrawal
  useEffect(() => {
    if (cashfreeType === 'WITHDRAW' && cashfreeStatus === REQUEST_STATUS.SUCCESS) {
      fetchFinancierAction()(authAxios, financierDispatch)
    }
  }, [cashfreeStatus, cashfreeType, authAxios, financierDispatch])

  return (
    <div className={styles.deposit}>
      <div className={styles.header}>
        <Button handleClick={handleBackPress} type='icon'>
          <ion-icon name='arrow-back-outline' />
        </Button>
        <Text size='1.5' color='#273746' bold>
          Withdraw {INR} from wallet
        </Text>
      </div>
      <Text size='0.8' color='#838e9f'>
        Withdraw money from your Escrow Account (TradeCred Wallet) to your registered Bank Account
      </Text>
      <div className={styles.divider} />

      {financier?.financierBank?.accountNumber ? (
        <div className={styles.depositDetails}>
          <div className={styles.bankDetailsView}>
            <div className={styles.bankDetailsAttr}>
              <Text>Credit to Account Number</Text>
              <Text>Bank Name</Text>
              <Text>IFSC</Text>
            </div>
            <div className={styles.bankDetailsAttr}>
              <Text bold number>
                {financier?.financierBank?.accountNumber}
              </Text>
              <Text bold>{financier?.financierBank?.bankName}</Text>
              <Text bold>{financier?.financierBank?.IFSC}</Text>
            </div>
          </div>
          <div className={styles.divider} />

          <div className={styles.availableBalance}>
            <Text size='1.2'>Available Wallet Balance</Text>
            <Text size='1.2' bold number>
              {currencyParser(financier?.walletBalance)}
            </Text>
          </div>

          <Cashfree type='Withdraw' enabled={withdrawalReason} withdrawalReason={withdrawalReason} />
          <WithdrawalReasons setWithdrawalReason={setWithdrawalReason} />
          <div className={styles.divider} />

          <Text size='0.85' color='#838e9f'>
            In case the amount is not credited within 48 hours, please reach out to us at {TRADECRED_SUPPORT_EMAIL}{' '}
            before raising dispute with your bank.
          </Text>
        </div>
      ) : (
        <div>
          <Text size='0.9'>
            We haven&apos;t received your bank account details yet. Please provide the same in order to process
            withdrawals.
          </Text>
          <div className={styles.changeBankAccount}>
            <ChangeBankAccount />
          </div>
        </div>
      )}
    </div>
  )
}
