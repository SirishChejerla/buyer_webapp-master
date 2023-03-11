import React, { useEffect, useState } from 'react'
import {
  debtDealParser,
  debtSecondaryDealParser,
  leaseDealParser,
  leaseSecondaryDealParser,
  standardDealParser,
  standardSecondaryDealParser,
} from '../../utils/deals/dealParsers'
import DealCard from '../dealCard'

import * as styles from './Deal.css'

const dealParser = deal => {
  // Secondary types
  if (deal?.type === 'deal_transaction_liquidation')
    switch (deal?.deal_transaction?.deal?.deal_type) {
      case 'StandardDeal':
        return standardSecondaryDealParser(deal)
      case 'DebtDeal':
        return debtSecondaryDealParser(deal)
      case 'LeaseDeal':
        return leaseSecondaryDealParser(deal)
      default:
        return {}
    }

  switch (deal?.deal_type) {
    case 'StandardDeal':
      return standardDealParser(deal)
    case 'DebtDeal':
      return debtDealParser(deal)
    case 'LeaseDeal':
      return leaseDealParser(deal)
    default:
      return {}
  }
}

/**
 * Deal - Parses the incoming deal object into meaningful params
 * Pass custom props to DealCard based on deal type
 */
export const Deal = ({ deal, innerRef }) => {
  const [parsedDeal, setParsedDeal] = useState()

  useEffect(() => {
    setParsedDeal(dealParser(deal))
  }, [deal])

  return (
    <>
      <DealCard innerRef={innerRef} deal={parsedDeal} />
    </>
  )
}
