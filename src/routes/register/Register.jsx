import { message as Toast } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/button'
import RegisterAttribute from '../../components/registerAttribute'
import RegisterDocument from '../../components/registerDocument'
import Text from '../../components/text'
import { REGISTER_DUCK, REGISTRATION_STATUS, ROUTES, VALIDATION_STATUS } from '../../core/actions'
import { useAxios } from '../../core/AxiosContext'
import { TRADECRED_SUPPORT_EMAIL } from '../../core/constants'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import { arraysEqual } from '../../utils/misc'
import { registerSubmitParsers } from '../../utils/register/RegisterSubmitParsers'
import { validateRegisterAttributes } from '../../utils/validations'
import * as styles from './Register.css'
import { registerAction, uploadDocumentAction } from './RegisterDuck'
import { gstnKYC, registerOptions } from './registerOptions'
import { documentSubmitParser, registerSubmitOptions } from './registerSubmitOptions'

const AccountType = ({ type, title, description }) => {
  const { registerDispatch } = useGlobalDispatch()

  return (
    <div className={styles.accountType}>
      <div className={styles.accountTypeWrapper}>
        <input
          type='radio'
          id={type}
          value={type}
          name={'accountType'}
          onClick={() => registerDispatch({ type: REGISTER_DUCK.ACCOUNT_TYPE, payload: { accountType: type } })}
        />
        <Text>{title}</Text>
      </div>
      <Text size='0.8' color='#808B96'>
        {description}
      </Text>
    </div>
  )
}

const GstnDetails = ({ kyc }) => {
  // TODO Dispatch has GSTN to attributes file
  return (
    <div className={styles.registrationDetails}>
      <Text className={styles.detailsWrapper} size='1.3' color='#273746' bold>
        {kyc?.attributesTitle}
      </Text>
      <Text size='0.8' color='#808B96'>
        {kyc?.attributesDescription}
      </Text>
      <div className={styles.attributesWrapper}>
        {kyc?.attributes?.map((attr, index) => (
          <RegisterAttribute key={index} attr={attr} />
        ))}
        {kyc?.documents?.map((attr, index) => (
          <RegisterDocument key={index} attr={attr} />
        ))}
      </div>
      <div className={styles.divider}></div>
    </div>
  )
}

const RegistrationDetails = ({ kyc }) => {
  return (
    <div className={styles.registrationDetails}>
      <Text className={styles.detailsWrapper} size='1.3' color='#273746' bold>
        {kyc?.attributesTitle}
      </Text>
      <Text size='0.8' color='#808B96'>
        {kyc?.attributesDescription}
      </Text>
      <div className={styles.attributesWrapper}>
        {kyc?.attributes?.map((attr, index) => (
          <RegisterAttribute key={index} attr={attr} />
        ))}
      </div>

      <div className={styles.halfdivider}></div>

      {kyc?.documents?.length > 0 && (
        <>
          <Text className={styles.uploadDetailsWrapper} size='1.3' color='#273746' bold>
            Upload your documents
          </Text>
          <Text size='0.8' color='#808B96'>
            Maximum file size is 5 MiB for each document or image
          </Text>
          <div className={styles.attributesWrapper}>
            {kyc?.documents?.map((attr, index) => (
              <RegisterDocument key={index} attr={attr} />
            ))}
          </div>

          <div className={styles.divider}></div>
        </>
      )}
    </div>
  )
}

export const Register = () => {
  const { registerState } = useGlobal()
  const { registerDispatch } = useGlobalDispatch()
  const { publicAxios } = useAxios()

  const [selectedKYC, setSelectedKYC] = useState({})
  const [authorizedUserKYC, setAuthorizedUserKYC] = useState({})
  const [termsAndConditions, setTermsAndConditions] = useState(false)
  const [hasGSTN, setHasGSTN] = useState(false)
  const [finalSubmitObject, setFinalSubmitObject] = useState({})
  const [submitPressed, setSubmitPressed] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  const [softSubmit, setSoftSubmit] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleBackPress = () => navigate(ROUTES.LOGIN)

  const handleHasGSTN = () => {
    setHasGSTN(val => {
      registerDispatch({ type: REGISTER_DUCK.VALUES_CHANGE, payload: { values: { hasGSTN: !val } } })
      return !val
    })
  }

  const handleTNC = () => {
    setTermsAndConditions(val => {
      registerDispatch({ type: REGISTER_DUCK.VALUES_CHANGE, payload: { values: { termsAndConditions: !val } } })
      return !val
    })
  }

  const uploadAllDocuments = () => {
    // Uploads all the required documents and saves its ID in Global State
    registerSubmitOptions[registerState.accountType].documents?.map(camelCaseKey => {
      if (document.getElementById(camelCaseKey)?.files[0]) {
        uploadDocumentAction(
          document.getElementById(camelCaseKey)?.files[0],
          camelCaseKey,
          documentSubmitParser(camelCaseKey),
          registerState.values?.pan
        )(publicAxios, registerDispatch)
      }
    })
  }

  const handleSubmit = () => {
    /*
    TODO check validation
    1. Uploads all documents.
    2. If success count is equal to the required documents
         - Trigger a use effect to do register action
       else
         - Trigger a popup asking user to resubmit (failure to upload documents)
    */
    uploadAllDocuments()
    setSubmitPressed(true)
  }

  useEffect(() => {
    validateRegisterAttributes('hasGSTN', hasGSTN)({}, registerDispatch)
    validateRegisterAttributes('termsAndConditions', termsAndConditions)({}, registerDispatch)
  }, [hasGSTN, termsAndConditions])

  useEffect(() => {
    setFinalSubmitObject(
      registerSubmitParsers(registerState.accountType, {
        values: registerState.values,
        documents: registerState.documents,
      })
    )
  }, [registerState.accountType, registerState.values, registerState.documents])

  useEffect(() => {
    if (registerState.accountType) {
      setCanSubmit(
        registerSubmitOptions[registerState.accountType].required.every(key => {
          return registerState.message[key]?.status === VALIDATION_STATUS.SUCCESS
        })
      )
      setSoftSubmit(
        registerSubmitOptions[registerState.accountType].minimumAttributes.every(key => {
          return registerState.message[key]?.status === VALIDATION_STATUS.SUCCESS
        })
      )
    }
  }, [registerState.accountType, registerState.message])

  useEffect(() => {
    // Checks if all required fields are validated successfully
    if (submitPressed && canSubmit) {
      const uploadedDocuments = registerSubmitOptions[registerState.accountType].documents.filter(documentKey => {
        console.log(documentKey, hasGSTN)

        // Assume gstnDocument to be true just for checking, in case of no GSTN
        if (!hasGSTN && documentKey === 'gstnDocument') {
          return true
        }
        if (registerState.documents[documentKey].id && registerState.documents[documentKey].size > 0) {
          return true
        } else {
          return false
        }
      })

      console.log(uploadedDocuments)

      // Submits only after all Document Ids are available
      if (arraysEqual(registerSubmitOptions[registerState.accountType].documents, uploadedDocuments)) {
        console.log('Final Object', finalSubmitObject)
        registerAction(finalSubmitObject)(publicAxios, registerDispatch)
      } else {
        console.log('Failed to submit, waiting for documents to be uploaded.')
      }
    }
  }, [canSubmit, submitPressed, finalSubmitObject])

  useEffect(() => {
    setSubmitPressed(false)
  }, [registerState.reason])

  useEffect(() => {
    if (location?.state?.referralCode) {
      registerDispatch({
        type: REGISTER_DUCK.VALUES_CHANGE,
        payload: { values: { referralCode: location?.state?.referralCode } },
      })
      registerDispatch({
        type: REGISTER_DUCK.MESSAGE_CHANGE,
        payload: {
          message: {
            referralCode: {
              status: VALIDATION_STATUS.SUCCESS,
              value: 'Autofilled Referral Code shared by your friend',
            },
          },
        },
      })
    }
    // Set hasGSTN and termsAndConditions to false initially
    registerDispatch({
      type: REGISTER_DUCK.VALUES_CHANGE,
      payload: { values: { hasGSTN: false, termsAndConditions: false } },
    })
    validateRegisterAttributes('hasGSTN', false)(registerState, registerDispatch)
    validateRegisterAttributes('termsAndConditions', false)(registerState, registerDispatch)
  }, [])

  useEffect(() => {
    // On Account Type change, cleanup unknown fields and retain similar filled fields
    const extractedKYC = registerOptions.filter(({ type }) => type === registerState.accountType)[0]
    setSelectedKYC(extractedKYC)
    extractedKYC?.authorizedUser && setAuthorizedUserKYC(extractedKYC.authorizedUser)

    // Tidy up
    return () => {
      setAuthorizedUserKYC({})
    }
  }, [registerState.accountType])

  useEffect(() => {
    if (registerState.registrationStatus === REGISTRATION_STATUS.REGISTRATION_SUCCESS) {
      Toast.success('We have received your information, you will be contacted in 24-36 hours after verification')
      handleBackPress()
    } else if (registerState.registrationStatus === REGISTRATION_STATUS.UPLOADING_DOCUMENTS) {
      Toast.info('Uploading your documents...')
    } else if (registerState.registrationStatus === REGISTRATION_STATUS.REGISTRATION_FAILURE) {
      Toast.error(
        registerState.reason
          ? registerState.reason
          : 'Recheck all the fields again and provide all necessary information'
      )
    }
  }, [registerState.registrationStatus])

  return (
    <div className={styles.registerWrapper}>
      <div className={styles.register}>
        <div className={styles.header}>
          <div className={styles.headerWrapper}>
            <Button handleClick={handleBackPress} type='icon'>
              <ion-icon name='arrow-back-outline' />
            </Button>
            <Text size='1.7' bold>
              Create a new TradeCred account
            </Text>
          </div>
          <Text size='0.8' color='#808B96'>
            Stuck anywhere? Reach out to {TRADECRED_SUPPORT_EMAIL}, we will gladly help you out
          </Text>
        </div>
        <div className={styles.accountTypesWrapper}>
          <Text size='1.3' color='#273746' bold>
            Choose your Account Type
          </Text>
          <div className={styles.accountTypes}>
            {registerOptions.map(({ type, title, description }) => (
              <AccountType key={type} type={type} title={title} description={description} />
            ))}
          </div>
        </div>
        {registerState.accountType && (
          <>
            <RegistrationDetails kyc={selectedKYC} />
            <div className={styles.tAndC}>
              <input type='checkbox' value={hasGSTN} onChange={handleHasGSTN} name='gstn' />
              <Text>I am registered with GST</Text>
            </div>
            {hasGSTN && <GstnDetails kyc={gstnKYC} />}
            {authorizedUserKYC?.type && <RegistrationDetails kyc={authorizedUserKYC} />}

            <div className={styles.tAndC}>
              <input type='checkbox' value={termsAndConditions} onChange={handleTNC} name='termsAndConditions' />
              <div>
                <Text>I hereby agree to these</Text>
                <Button
                  type='text'
                  handleClick={() => {
                    // TODO Replace with Terms and Conditions link
                    window.open('https://google.com', '_blank', 'noopener,noreferrer')
                  }}>
                  <Text color='#1a73e8'>Terms & Conditions </Text>
                </Button>
                <Text>and submit the above information to be used to create an account in TradeCred.</Text>
              </div>
            </div>
            <Text size='0.8' color='#808B96'>
              Your account will be created after we successfully verify your details. We will share the status of your
              account creation by email & sms.
            </Text>
            <Button
              className={styles.submitBtn}
              label='Submit'
              handleClick={handleSubmit}
              disabled={
                !softSubmit ||
                registerState.registrationStatus === REGISTRATION_STATUS.UPLOADING_DOCUMENTS ||
                registerState.registrationStatus === REGISTRATION_STATUS.REGISTRATION_PENDING
              }></Button>
          </>
        )}
      </div>
    </div>
  )
}
