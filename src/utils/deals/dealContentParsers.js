import { DEAL } from '../../core/constants'
import { currencyParser, durationToDaysParser } from '../misc'

const emptyProp = {
  type: '',
  title: '',
  val: '',
}

export const stdDealContentParser = deal => {
  // Don't show Duration only on the content of deal card when its AR
  // based on the strategical decision of Ops
  const durationProps = deal?.isAR
    ? emptyProp
    : {
        type: 'duration',
        title: 'Tentative Duration',
        val: durationToDaysParser(deal?.duration),
      }

  return [
    {
      type: 'netIRR',
      title: 'Net IRR',
      val: deal?.netIRR,
    },
    durationProps,
    {
      type: 'minPurchaseAmount',
      title: 'Min. Purchasable Amount',
      val: currencyParser(deal?.minPurchaseAmount),
    },
  ]
}

export const stdSecDealContentParser = deal => {
  const durationProps = deal?.isAR
    ? emptyProp
    : {
        type: 'duration',
        title: 'Tentative Duration',
        val: durationToDaysParser(deal?.duration),
      }

  return [
    {
      type: 'netIRR',
      title: 'Net IRR',
      val: deal?.netIRR,
    },
    durationProps,
    {
      type: 'minPurchaseAmount',
      title: 'Purchasable Amount',
      val: currencyParser(deal?.minPurchaseAmount),
    },
  ]
}

export const debtDealContentParser = deal => {
  return [
    {
      type: 'netIRR',
      title: 'Net IRR',
      val: deal?.netIRR,
    },
    {
      type: 'availableLots',
      title: 'Available Lots',
      val: deal?.availableLots,
    },
    {
      type: 'amountPerLot',
      title: 'Amount Per Lot',
      val: currencyParser(deal?.amountPerLot),
    },
  ]
}

export const debtSecDealContentParser = deal => {
  return [
    {
      type: 'netIRR',
      title: 'Net IRR',
      val: deal?.netIRR,
    },
    {
      type: 'availableLots',
      title: 'Available Lots',
      val: deal?.availableLots,
    },
    {
      type: 'amountPerLot',
      title: 'Amount Per Lot',
      val: currencyParser(deal?.amountPerLot),
    },
  ]
}

export const leaseDealContentParser = deal => {
  return [
    {
      type: 'netIRR',
      title: 'Net IRR',
      val: deal?.netIRR,
    },
    {
      type: 'minPurchaseAmount',
      title: 'Min. Purchasable Amount',
      val: currencyParser(deal?.minPurchaseAmount),
    },
  ]
}

export const dealContentParser = deal => {
  switch (deal?.type) {
    case DEAL.STANDARD:
      return stdDealContentParser(deal)
    case DEAL.STANDARD_SECONDARY:
      return stdSecDealContentParser(deal)
    case DEAL.DEBT:
      return debtDealContentParser(deal)
    case DEAL.DEBT_SECONDARY:
      return debtSecDealContentParser(deal)
    case DEAL.LEASE:
      return leaseDealContentParser(deal)
    default:
      break
  }
}
