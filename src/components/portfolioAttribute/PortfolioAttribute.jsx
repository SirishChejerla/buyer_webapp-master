import React from 'react'
import Text from '../text'
import * as styles from './PortfolioAttribute.css'

export const PortfolioAttribute = ({ type, title, val }) => {
  if (type === 'netIRR') {
    val = val + '\u2006%'
  }
  return (
    <div className={styles.portfolioAttr}>
      <Text bold color='var(--deal-portfolio-attributes-color)' size='0.8' className={styles.attrTitle}>
        {title}
      </Text>
      <Text
        color={type === 'netIRR' && 'var(--deal-portfolio-attributes-INR-color)'}
        className={type === 'netIRR' ? styles.netIRR : styles.attrVal}
        number>
        {val}
      </Text>
    </div>
  )
}
