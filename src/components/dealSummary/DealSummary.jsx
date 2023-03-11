import React from 'react'
import { TRADECRED_SUPPORT_EMAIL } from '../../core/constants'
import Button from '../button'
import Text from '../text'
import * as styles from './DealSummary.css'

export const DealSummary = ({ summary, setShowSummary }) => {
  const handleBackIconPress = () => setShowSummary(false)

  return (
    <div className={styles.dealSummary}>
      <div className={styles.summaryHeader}>
        <Button handleClick={handleBackIconPress} type='icon' className={styles.backButton}>
          <ion-icon name={'arrow-back'} />
        </Button>
        <Text bold color='#616161' size='1.1' className={styles.textHeader}>
          Summary
        </Text>
      </div>
      <div className={styles.summaryList}>
        {summary.map(({ type, title, val }) => {
          return (
            <div key={type} className={styles.summaryAttr}>
              <Text size='0.95'>{title}</Text>
              <Text number>{val}</Text>
            </div>
          )
        })}
      </div>
      <div className={styles.footer}>
        <Text color='#6c6b6b' size='0.75'>
          Transactions might take upto 48 hours to reflect in your account.
        </Text>
        <Text color='#6c6b6b' size='0.75'>
          For further queries, you can reach us at {TRADECRED_SUPPORT_EMAIL}. We are happy to help.
        </Text>
      </div>
    </div>
  )
}
