import { Popover } from 'antd'
import React from 'react'
import Text from '../text'
import * as styles from './DealTag.css'

export const DealTag = ({ isAR, isZC }) => {
  const arContent = (
    <div>
      <p>AR deals will be automatically renewed, at the end of deal maturity.</p>
    </div>
  )

  const zcContent = (
    <div>
      <p>We offer zero cost liquidity for this deal.</p>
    </div>
  )

  return (
    <div className={styles.tag}>
      {isAR && (
        <Popover content={arContent} title='Autorenew (AR)'>
          <div className={styles.outerAR}>
            <div className={styles.tagAR}>
              <Text bold size='0.8' color='white'>
                AR
              </Text>
            </div>
            <Text bold size='0.8' color='#35a37e'>
              Auto Renew
            </Text>
          </div>
        </Popover>
      )}
      {isAR || isZC ? (
        <Popover content={zcContent} title='Zero Cost (ZC)'>
          <div className={styles.outerZC}>
            <div className={styles.tagZC}>
              <Text bold size='0.8' color='white'>
                ZC
              </Text>
            </div>
            <Text bold size='0.8' color='#5181c2'>
              Zero Cost Liquidity
            </Text>
          </div>
        </Popover>
      ) : (
        <div></div>
      )}
    </div>
  )
}
