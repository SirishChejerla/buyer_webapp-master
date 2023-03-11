import { message as Toast } from 'antd'
import React, { useEffect, useState } from 'react'
import { REQUEST_STATUS } from '../../core/actions'
import { useAxios } from '../../core/AxiosContext'
import { addNomineeDetailsAction } from '../../routes/financier/FinancierDuck'
import { removeSpaces } from '../../utils/misc'
import { EMAIL_FORMAT, PAN_FORMAT, PHONE_FORMAT } from '../../utils/validations'
import Button from '../button'
import ChangeBankAccountAttribute from '../changeBankAccountAttribute'
import Text from '../text'
import * as styles from './AddNomineeDetails.css'

export const AddNomineeDetails = ({ financierPAN, setAddNominee }) => {
  const [fullName, setFullName] = useState('')
  const [errorFullName, setErrorFullName] = useState('')
  const [nomineeEmail, setNomineeEmail] = useState('')
  const [errorNomineeEmail, setErrorNomineeEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errorPhoneNumber, setErrorPhoneNumber] = useState('')
  const [pan, setPan] = useState('')
  const [errorPan, setErrorPan] = useState('')
  const [relation, setRelation] = useState('')
  const [errorRelation, setErrorRelation] = useState('')
  const [allowSubmit, setAllowSubmit] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(REQUEST_STATUS.IDLE)

  const { authAxios } = useAxios()

  const addNomineeDetails = () => {
    const successfulTransaction = response => {
      console.log('Added nominee details successfully!', response)
      Toast.success('Added nominee details successfully!')
      setAddNominee(false)

      setSubmitStatus(REQUEST_STATUS.SUCCESS)
    }
    const transactionFailed = error => {
      console.log('Failed to add nominee details', error)
      Toast.error('Failed to add nominee details. Please try again after some time.')
      setAddNominee(false)

      setSubmitStatus(REQUEST_STATUS.FAILURE)
    }
    const data = {
      financier_id: financierPAN,
      user_attributes: { full_name: fullName, email: nomineeEmail, phone: phoneNumber },
      person_kyc_attributes: { permanent_account_number: removeSpaces(pan) },
      designation: relation,
    }
    if (allowSubmit) {
      addNomineeDetailsAction(data)(authAxios)(successfulTransaction, transactionFailed)
      setSubmitStatus(REQUEST_STATUS.PENDING)
    }
  }

  useEffect(() => {
    if (!errorFullName && !errorNomineeEmail && !errorPhoneNumber && !errorPan && !errorRelation) {
      setAllowSubmit(true)
    } else {
      setAllowSubmit(false)
    }
  }, [errorFullName, errorNomineeEmail, errorPhoneNumber, errorPan, errorRelation])

  useEffect(() => {
    setErrorFullName(fullName ? '' : "Enter Nominee's Full Name")
  }, [fullName])

  useEffect(() => {
    setNomineeEmail(removeSpaces(nomineeEmail))
    setErrorNomineeEmail(
      nomineeEmail
        ? EMAIL_FORMAT.test(nomineeEmail)
          ? ''
          : 'Enter a valid email address'
        : "Enter Nominee's email address"
    )
  }, [nomineeEmail])

  useEffect(() => {
    setErrorPhoneNumber(
      phoneNumber
        ? PHONE_FORMAT.test(phoneNumber)
          ? ''
          : 'Enter a valid phone number'
        : "Enter Nominee's phone number"
    )
  }, [phoneNumber])

  useEffect(() => {
    setErrorPan(
      pan ? (PAN_FORMAT.test(pan) ? '' : 'PAN should be in the format of ABCAA1234A') : "Enter Nominee's PAN number"
    )
  }, [pan])

  useEffect(() => {
    setErrorRelation(relation ? '' : "Enter Nominee's relation to you")
  }, [relation])

  return (
    <div>
      <div>
        <Text>Provide your nominee details</Text>
      </div>
      <div className={styles.editAttributes}>
        <ChangeBankAccountAttribute
          title={'Name'}
          placeholder={'Full Name'}
          value={fullName}
          message={errorFullName}
          setValue={setFullName}
        />
        <ChangeBankAccountAttribute
          title={'Email'}
          placeholder={'Email ID'}
          value={nomineeEmail}
          success={!errorNomineeEmail && nomineeEmail ? 'Valid email address!' : ''}
          message={errorNomineeEmail}
          setValue={setNomineeEmail}
        />
        <ChangeBankAccountAttribute
          title={'Mobile Number'}
          placeholder={'10 digit mobile number'}
          value={phoneNumber}
          message={errorPhoneNumber}
          setValue={setPhoneNumber}
        />
        <ChangeBankAccountAttribute
          title={'PAN'}
          placeholder={'Enter PAN'}
          value={pan}
          success={!errorPan && pan ? 'Valid PAN!' : ''}
          message={errorPan}
          setValue={setPan}
        />
        <ChangeBankAccountAttribute
          title={'Relation'}
          placeholder={'He/She/They are your ... ?'}
          value={relation}
          message={errorRelation}
          setValue={setRelation}
        />
      </div>
      <Button
        label={submitStatus === REQUEST_STATUS.PENDING ? 'In Progress ...' : 'Add Nominee'}
        handleClick={addNomineeDetails}
        disabled={!allowSubmit || submitStatus === REQUEST_STATUS.PENDING}
      />
    </div>
  )
}
