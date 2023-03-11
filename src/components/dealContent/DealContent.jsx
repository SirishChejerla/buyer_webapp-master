import React from 'react'
import DealAttribute from '../dealAttribute'
import * as styles from './DealContent.css'

/**
 * iterator for all attributes
 */
export const DealContent = ({ content }) => {
  return (
    <div className={styles.dealContent}>
      {content?.map(({ type, title, val }) => (
        <DealAttribute key={type} type={type} title={title} val={val} />
      ))}
    </div>
  )
}
