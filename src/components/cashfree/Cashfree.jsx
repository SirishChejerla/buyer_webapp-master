import { message as Toast } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OVERVIEW_DUCK, REQUEST_STATUS, ROUTES } from '../../core/actions'
import { useAxios } from '../../core/AxiosContext'
import { INR } from '../../core/constants'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import { depositWalletAction, withdrawWalletAction } from '../../routes/overview/OverviewDuck'
import { currencyParser, inputSanitation } from '../../utils/misc'
import Button from '../button'
import Input from '../input'
import Text from '../text'
import * as styles from './Cashfree.css'

export const Cashfree = ({ type, enabled, withdrawalReason }) => {
  const { authAxios } = useAxios()
  const { overviewDispatch } = useGlobalDispatch()
  const {
    financierState: { financier },
    overviewState: { cashfreePaymentSessionId, cashfreeStatus, cashfreeType, cashfreeMessage },
  } = useGlobal()
  const [amount, setAmount] = useState('')
  const [errorMessage, setErrorMessage] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    cashfreeMessage && Toast.info(cashfreeMessage)
  }, [cashfreeMessage])

  useEffect(() => {
    if (
      cashfreeType === 'WITHDRAW' &&
      (cashfreeStatus === REQUEST_STATUS.SUCCESS || cashfreeStatus === REQUEST_STATUS.FAILURE)
    ) {
      overviewDispatch({ type: OVERVIEW_DUCK.CASHFREE_EOL })
      navigate(ROUTES.OVERVIEW)
    }
  }, [cashfreeType, cashfreeStatus, overviewDispatch])

  const handleDepositChange = value => {
    setAmount(inputSanitation(value))
    if (value <= 0) {
      setErrorMessage(`Please enter an amount greater than ${INR} 0.`)
    } else {
      setErrorMessage(null)
    }
  }

  const handleWithdrawChange = value => {
    setAmount(inputSanitation(value))
    value = parseInt(value?.replace(/,/g, ''))
    if (value <= 0) {
      setErrorMessage('Please enter a value greater than 0.')
    } else if (value > financier?.walletBalance) {
      setErrorMessage(`You cannot withdraw more than ${currencyParser(financier?.walletBalance)}`)
    } else {
      setErrorMessage(null)
    }
  }

  const handleAmountChange = value => {
    if (type === 'Deposit') {
      handleDepositChange(value)
    } else if (type === 'Withdraw') {
      handleWithdrawChange(value)
    }
  }

  const handleClick = () => {
    if (type === 'Deposit') {
      depositWalletAction(financier?.financierPAN, amount?.replace(/,/g, ''))(authAxios, overviewDispatch)
    } else if (type === 'Withdraw') {
      withdrawWalletAction(
        financier?.walletId,
        withdrawalReason,
        amount?.replace(/,/g, '')
      )(authAxios, overviewDispatch)
    }
    // Clears Amount
    setAmount('')
  }

  useEffect(() => {
    if (cashfreeType === 'DEPOSIT' && cashfreePaymentSessionId) {
      //TODO Open cashfreePaymentSessionId
      const cashfree_pg = new window.Cashfree(cashfreePaymentSessionId)
      cashfree_pg.redirect()
    }
  }, [cashfreeType, cashfreePaymentSessionId])

  return (
    <>
      <div className={styles.cashfree}>
        <Input onChange={handleAmountChange} value={amount} placeholder='Enter Amount' number />
        <Button label={type} handleClick={handleClick} disabled={!enabled || !amount || errorMessage} />
      </div>
      <Text size='0.8' color='#d62650'>
        {errorMessage}
      </Text>
    </>
  )
}
