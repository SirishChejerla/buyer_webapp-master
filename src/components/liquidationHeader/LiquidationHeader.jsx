import React from 'react'
import Button from '../button'
import Text from '../text'
import * as styles from './LiquidationHeader.css'

export const LiquidationHeader = ({ handleBackPress, dealCode }) => {
  return (
    <div className={styles.liquidationHeader}>
      <Button handleClick={handleBackPress} type='icon'>
        <ion-icon name={'arrow-back-outline'} />
      </Button>
      <Text size='1.5' color='#273746' bold>
        Liquidating Deal ID - {dealCode}
      </Text>
    </div>
  )
}
