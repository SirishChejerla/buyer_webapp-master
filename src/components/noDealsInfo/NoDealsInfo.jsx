import React from 'react'
import Text from '../text'
import * as styles from './NoDealsInfo.css'

export const NoDealsInfo = () => {
  return (
    <div className={styles.noDealsInfo}>
      <Text color='#808080'>Alas! No deals were found</Text>
    </div>
  )
}
