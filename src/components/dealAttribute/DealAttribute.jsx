import React from 'react'
import Text from '../text'
import * as styles from './DealAttribute.css'

export const DealAttribute = ({ type, title, val }) => {
  if (type === 'netIRR') {
    val = val + '\u2006%'
  }
  return (
    <div className={styles.dealAttr}>
      <Text size='.9' color='var(--deal-attributes-color)' className={styles.attrTitle}>
        {title}
      </Text>
      <Text
        size='1.15'
        color={type === 'netIRR' && 'var(--deal-attributes-INR-color)'}
        number
        className={type === 'netIRR' ? styles.netIRR : styles.attrVal}>
        {val}
      </Text>
    </div>
  )
}
