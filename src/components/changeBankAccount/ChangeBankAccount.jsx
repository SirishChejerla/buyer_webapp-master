import { message as Toast } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { REQUEST_STATUS } from '../../core/actions'
import { useAxios } from '../../core/AxiosContext'
import { IFSC_FORMAT } from '../../core/constants'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import {
  createFinancierBankAccountAction,
  fetchFinancierAction,
  updateFinancierBankAccountAction,
} from '../../routes/financier/FinancierDuck'
import { removeSpaces } from '../../utils/misc'
import Button from '../button'
import ChangeBankAccountAttribute from '../changeBankAccountAttribute'
import Text from '../text'
import * as styles from './ChangeBankAccount.css'

export const ChangeBankAccount = () => {
  const {
    financierState: { financier },
  } = useGlobal()
  const { financierDispatch } = useGlobalDispatch()
  const { authAxios } = useAxios()

  const [accountNumber, setAccountNumber] = useState(financier?.financierBank?.accountNumber || '')
  const [errorAccountNumber, setErrorAccountNumber] = useState('')
  const [reAccountNumber, setReAccountNumber] = useState(financier?.financierBank?.accountNumber || '')
  const [errorReAccountNumber, setErrorReAccountNumber] = useState('')
  const [holderName, setHolderName] = useState(financier?.financierBank?.holderName || financier?.financierName || '')
  const [errorHolderName, setErrorHolderName] = useState('')
  const [ifsc, setIfsc] = useState(financier?.financierBank?.IFSC || '')
  const [errorIfsc, setErrorIfsc] = useState('')
  const [bankName, setBankName] = useState(financier?.financierBank?.bankName || '')
  const [errorBankName, setErrorBankName] = useState('')
  const [allowSubmit, setAllowSubmit] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(REQUEST_STATUS.IDLE)

  const successful_transaction = response => {
    console.log('Added bank details successfully', response)
    Toast.success('Changed bank details successfully')
    setSubmitStatus(REQUEST_STATUS.SUCCESS)
    fetchFinancierAction()(authAxios, financierDispatch)
  }
  const transaction_failed = ({ response }) => {
    console.log('Failed to add bank details', response?.data?.message)
    Toast.error(response?.data?.message || 'Unable to change bank details. Please try after some time.')
    setSubmitStatus(REQUEST_STATUS.FAILURE)
  }

  const changeBankAccount = () => {
    console.log('Change banak acc')
    const data = {
      financier_code: financier?.financierPAN,
      bank_account_code: financier?.financierBank?.id ? financier.financierBank.id : null,
      phone: financier?.authorizedUser?.phone,
      account_number: reAccountNumber,
      account_holder_name: holderName.trim(),
      bank_name: bankName.trim(),
      ifsc: ifsc,
    }
    if (allowSubmit) {
      financier?.financierBank?.id
        ? updateFinancierBankAccountAction(data)(authAxios)(successful_transaction, transaction_failed)
        : createFinancierBankAccountAction(data)(authAxios)(successful_transaction, transaction_failed)
      setSubmitStatus(REQUEST_STATUS.PENDING)
    }
  }

  const getBankNameWithIFSC = useCallback(
    ifsc => {
      console.log('[FETCH][PENDING] Bank name with IFSC')
      authAxios
        .get('/api/v1/financier_bank_accounts/get_bank_name', { params: { ifsc: ifsc } })
        .then(({ data }) => {
          console.log(`[FETCH][SUCCESS] Bank name with IFSC ${data?.bank_name}`)
          // Set Bank Name only if Valid Bank Name is found and don't clear entried Name
          setBankName(data?.bank_name ? data?.bank_name : bankName)
        })
        .catch(error => {
          console.error('[FETCH][ERROR] Bank name with IFSC', error)
        })
    },
    [authAxios, bankName]
  )

  useEffect(() => {
    if (accountNumber) setAccountNumber(removeSpaces(accountNumber))
    if (reAccountNumber) setReAccountNumber(removeSpaces(reAccountNumber))

    setErrorAccountNumber(!accountNumber && 'Enter Account Number')
    setErrorReAccountNumber(accountNumber !== reAccountNumber && 'Must match with Account Number')
  }, [accountNumber, reAccountNumber])

  useEffect(() => {
    setErrorHolderName(holderName ? '' : 'Enter Bank Account holder name')
  }, [holderName])

  useEffect(() => {
    if (ifsc) setIfsc(removeSpaces(ifsc))
    // Fetch Bank Details only if IFSC is valid
    IFSC_FORMAT.test(ifsc) && getBankNameWithIFSC(ifsc)
    setErrorIfsc(ifsc ? (IFSC_FORMAT.test(ifsc) ? '' : 'IFSC should be in format HDFC0123456') : 'Enter Bank IFSC code')
  }, [ifsc, getBankNameWithIFSC])

  useEffect(() => {
    setErrorBankName(!bankName && 'Enter Bank Name')
  }, [bankName])

  useEffect(() => {
    if (errorAccountNumber || errorReAccountNumber || errorHolderName || errorIfsc || errorBankName) {
      setAllowSubmit(false)
    } else {
      setAllowSubmit(true)
    }
  }, [errorAccountNumber, errorReAccountNumber, errorHolderName, errorIfsc, errorBankName])

  return (
    <div>
      <div className={styles.editAttributes}>
        <ChangeBankAccountAttribute
          title={'Account Number'}
          placeholder={'Account Number'}
          value={accountNumber}
          setValue={setAccountNumber}
          message={errorAccountNumber}
        />
        <ChangeBankAccountAttribute
          title={'Re-Enter Account Number'}
          placeholder={'* * * * * * * * * *'}
          value={reAccountNumber}
          setValue={setReAccountNumber}
          message={errorReAccountNumber}
        />
        <ChangeBankAccountAttribute
          title={'Account Holder Name'}
          placeholder={'Name'}
          value={holderName}
          setValue={setHolderName}
          editable={false}
          message={errorHolderName}
        />
        <ChangeBankAccountAttribute
          title={'IFSC Code'}
          placeholder={'HDFC0123456'}
          value={ifsc}
          setValue={setIfsc}
          message={errorIfsc}
        />
        <ChangeBankAccountAttribute
          title={'Bank Name'}
          placeholder={'Bank Name'}
          value={bankName}
          setValue={setBankName}
          message={errorBankName}
        />
      </div>
      <Text size='0.8' color='#838e9f'>
        Bank account updation can be done only once in a month. Please reach us out at support@tradecred.com for further
        assistance.
      </Text>
      <br />
      <Button
        className={styles.button}
        label={
          submitStatus === REQUEST_STATUS.PENDING
            ? 'In Progress ...'
            : financier?.financierBank?.id
            ? 'Edit bank Account'
            : 'Add Bank Account'
        }
        handleClick={changeBankAccount}
        disabled={!allowSubmit || submitStatus === REQUEST_STATUS.PENDING}
      />
    </div>
  )
}
