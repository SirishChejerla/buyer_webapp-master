import React from 'react'
import useMBASign from '../../customhooks/useMBASign'
import Button from '../button'
import Text from '../text'
import * as styles from './MasterBuyAgreementHighlight.css'

export const MasterBuyAgreementHighlight = () => {
  const { mbaSign } = useMBASign()

  return (
    <div className={styles.mba}>
      <Text size='0.9' color='#fa541c'>
        Your Master Buy Agreement (MBA) signing is pending.{' '}
      </Text>
      <Button label='Sign now' type='text' handleClick={mbaSign}></Button>
    </div>
  )
}
