import React from 'react'
import Text from '../text'
import * as styles from './CardAttributes.css'

export const CardAttributes = ({ className, name, value }) => {
  return (
    <div className={`${styles.cardAttributes} ${className}`}>
      <Text size='0.82' color='#808B96' bold>
        {name.toUpperCase()}
      </Text>
      <Text size='0.95'>{value}</Text>
    </div>
  )
}
