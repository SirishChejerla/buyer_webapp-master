import { DEAL } from '../../core/constants'

export const stdDealFooterParser = deal => {
  return [
    {
      type: 'risks',
      title: 'Risks',
    },
    {
      type: 'summary',
      title: 'Summary',
      val: {},
    },
    {
      type: 'dealReport',
      title: 'Deal Report',
      val: deal?.dealReportUrl,
    },
  ]
}

export const stdSecDealFooterParser = deal => {
  return [
    {
      type: 'risks',
      title: 'Risks',
    },
    {
      type: 'summary',
      title: 'Summary',
      val: {},
    },
    {
      type: 'dealReport',
      title: 'Deal Report',
      val: deal?.dealReportUrl,
    },
  ]
}

export const debtDealFooterParser = deal => {
  return [
    {
      type: 'risks',
      title: 'Risks',
    },
    {
      type: 'repaymentTable',
      title: 'Repayments',
      val: { purchaseAmount: deal?.amountPerLot, dealCode: deal?.dealCode },
    },
    {
      type: 'debtTerms',
      title: 'Debt Terms',
      val: deal?.debtTermsUrl,
    },
  ]
}

export const debtSecDealFooterParser = deal => {
  return [
    {
      type: 'risks',
      title: 'Risks',
    },
    {
      type: 'repaymentTable',
      title: 'Repayments',
      val: { purchaseAmount: deal?.amountPerLot, dealCode: deal?.baseDealCode },
    },
    {
      type: 'debtTerms',
      title: 'Debt Terms',
      val: deal?.debtTermsUrl,
    },
  ]
}

export const leaseDealFooterParser = deal => {
  return [
    {
      type: 'risks',
      title: 'Risks',
    },
    {
      type: 'summary',
      title: 'Summary',
      val: {},
    },
    {
      type: 'leaseRepaymentTable',
      title: 'Repayments',
      val: {
        totalNumberOfRentals: deal?.totalNumberOfRentals,
        rentalFrequency: deal?.rentalFrequency,
        rentalStartDuration: deal?.rentalStartDuration,
        // useTranches require these params
        totalAmount: deal?.totalAmount,
        tdsPercentage: deal?.tdsPercentage,
        totalUnits: deal?.totalUnits,
        rentalValue: deal?.rentalValue,
        residualPercentage: deal?.residualPercentage,
      },
    },
    {
      type: 'dealReport',
      title: 'Deal Report',
      val: deal?.dealReportUrl,
    },
  ]
}

export const dealFooterParser = deal => {
  switch (deal?.type) {
    case DEAL.STANDARD:
      return stdDealFooterParser(deal)
    case DEAL.STANDARD_SECONDARY:
      return stdSecDealFooterParser(deal)
    case DEAL.DEBT:
      return debtDealFooterParser(deal)
    case DEAL.DEBT_SECONDARY:
      return debtSecDealFooterParser(deal)
    case DEAL.LEASE:
      return leaseDealFooterParser(deal)
    default:
      break
  }
}
