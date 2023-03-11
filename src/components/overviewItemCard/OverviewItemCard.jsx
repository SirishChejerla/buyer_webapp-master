import React from 'react'
import Text from '../text'
import * as styles from './OverviewItemCard.css'

export const OverviewItemCard = ({ portfolioTracker }) => {
  const { title, val, icon, iconColor } = portfolioTracker
  return (
    <div className={styles.overviewItem}>
      <div className={styles.topRow}>
        <Text size='1.1' className={styles.label}>
          {title}
        </Text>
        <img className={styles.icon} style={{ backgroundColor: iconColor }} src={icon} alt='' />
      </div>
      <Text size='1.25' number>
        {val}
      </Text>
    </div>
  )
}
