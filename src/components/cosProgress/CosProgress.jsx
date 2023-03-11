import { Steps } from 'antd'
import React, { useEffect, useState } from 'react'
import { COS_DUCK, REQUEST_STATUS } from '../../core/actions'
import { useGlobal } from '../../core/GlobalContext'
import Text from '../text'
import * as styles from './CosProgress.css'

export const CosProgress = () => {
  const { confirmationOfSigningState } = useGlobal()
  const [message, setMessage] = useState()
  const [status, setStatus] = useState()
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const { name, status } = confirmationOfSigningState

    switch (name) {
      case COS_DUCK.CREATE_DEAL_TRANSACTION:
        setMessage('Creating Debt Transaction')
        setCurrentStep(0)
        break
      case COS_DUCK.FETCH_SIGN_URL:
        setMessage('Fetching Leegality for signing')
        setCurrentStep(1)
        break
      case COS_DUCK.VERIFY_DEAL_PURCHASE:
        setMessage('Finding a slot for you in the deal')
        setCurrentStep(2)
        break
      default:
        break
    }

    switch (status) {
      case REQUEST_STATUS.PENDING:
        setStatus('process')
        break
      case REQUEST_STATUS.SUCCESS:
        setStatus('finish')
        break
      case REQUEST_STATUS.FAILURE:
        setStatus('error')
        break
      default:
        break
    }
  }, [confirmationOfSigningState])

  return (
    <div className={styles.cosProgress}>
      <Steps
        current={currentStep}
        status={status}
        progressDot
        size='small'
        items={[
          {
            title: <Text>Create Txn</Text>,
          },
          {
            title: <Text>Sign Document</Text>,
          },
          {
            title: <Text>Verification</Text>,
          },
        ]}
      />
    </div>
  )
}
