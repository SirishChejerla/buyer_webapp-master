import React, { useEffect, useState } from 'react'
import { currencyParser, customDateFormat, customParseFloat } from '../../utils/misc'
import PortfolioAttribute from '../portfolioAttribute'
import * as styles from './LiquidationAttributes.css'

export const LiquidationAttributes = ({ liquidationData }) => {
  const [liquidationAttr, setLiquidationAttr] = useState([{ type: '', title: '', val: '' }])

  useEffect(() => {
    if (liquidationData?.liquidationAmount) {
      setLiquidationAttr([
        {
          type: 'netIRR',
          title: 'Effective IRR',
          val: customParseFloat(liquidationData?.effectiveIRR),
        },
        {
          type: 'liquidationAmount',
          title: 'Liquidation Amount',
          val: currencyParser(liquidationData?.liquidationAmount),
        },
        {
          type: 'liquidationRequestedDate',
          title: 'Liquidation Requested Date',
          val: customDateFormat(liquidationData?.liquidationRequestedDate),
        },
        {
          type: 'liquidationExpirationDate',
          title: 'Liquidation Expiry Date',
          val: customDateFormat(liquidationData?.liquidationExpirationDate),
        },
      ])
    }
  }, [liquidationData])

  return (
    <div className={styles.liquidationAttributes}>
      {liquidationAttr?.map(({ type, title, val }) => (
        <PortfolioAttribute key={type} type={type} title={title} val={val} />
      ))}
    </div>
  )
}
