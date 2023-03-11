import React from 'react'

import * as styles from './LoadingIndicator.css'

export const LoadingIndicator = ({ scale }) => {
  const scaleStyle = scale ? { transform: `scale(${scale})` } : null

  return (
    <div className={styles.wrapper}>
      <div className={styles.loadingRoller} style={scaleStyle}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
