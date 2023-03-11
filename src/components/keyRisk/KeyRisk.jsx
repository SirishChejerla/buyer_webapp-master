import React from 'react'
import { useGlobal } from '../../core/GlobalContext'
import Text from '../text'
import * as styles from './KeyRisk.css'

export const KeyRisk = () => {
  const {
    financierState: { financier },
  } = useGlobal()

  const keyRiskData = {
    body: `I, ${financier?.financierName}, understand the risks
    involved while transacting and deploying capital on tradecred.com or on TradeCred platform. I am completely aware and acknowledge of the following risks: `,
    points: [
      `There can be a
    delay in collection of money pertaining to the invoice amount, which is outside the control of TradeCred at
    any time.`,
      `There can be a
      shortfall in collection of money pertaining to the invoice amount, which is outside the control of TradeCred
      at any time.`,
      `There can be a
      diversion of funds outside of the Seller Escrow Account, which can lead to cashflow moving outside the control
      of TradeCred at any time.`,
      `There are chances
      of intentional fraud by the Seller, which may not have been detected by TradeCred.`,
      `There is a
      possibility that TradeCred may not have control over the funds lying in the Seller Escrow Account in case of
      bankruptcy proceedings or any notices received from regulatory authorities.`,
    ],
  }

  return (
    <div className={styles.keyRisk}>
      <Text size='0.92' className={styles.bodyText}>
        {keyRiskData.body}
      </Text>
      {keyRiskData.points.map((point, index) => (
        <div className={styles.point} key={index}>
          <div className={styles.dot} />
          <Text size='0.88'>{point}</Text>
        </div>
      ))}
    </div>
  )
}
