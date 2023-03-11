import { PORTFOLIO } from '../../../core/constants'

export const standardOngoingFooterParser = portfolio => {
  return [
    {
      type: 'confirmationOfPurchaseUrl',
      title: 'Confirmation of Purchase',
      val: portfolio?.confirmationOfPurchaseUrl,
    },
    {
      type: 'dealReport',
      title: 'Deal Report',
      val: portfolio?.dealReport,
    },
  ]
}

export const debtOngoingFooterParser = portfolio => {
  return [
    {
      type: 'confirmationOfPurchaseUrl',
      title: 'Securities Transfer Form',
      val: portfolio?.confirmationOfPurchaseUrl,
    },
    {
      type: 'dealCalculationsUrl',
      title: 'Deal Calculations',
      val: portfolio?.dealCalculationsUrl,
    },
  ]
}

export const leaseOngoingFooterParser = portfolio => {
  return [
    {
      type: 'confirmationOfRentUrl',
      title: 'Confirmation of Purchase & Rent',
      val: portfolio?.confirmationOfRentUrl,
    },
    {
      type: 'leaseRepaidTable',
      title: 'Repayment Table',
      val: {},
    },
  ]
}

export const ongoingFooterParser = portfolio => {
  switch (portfolio?.type) {
    case PORTFOLIO.STANDARD:
      return standardOngoingFooterParser(portfolio)
    case PORTFOLIO.STANDARD_SECONDARY:
      return standardOngoingFooterParser(portfolio)
    case PORTFOLIO.DEBT:
      return debtOngoingFooterParser(portfolio)
    case PORTFOLIO.DEBT_SECONDARY:
      return debtOngoingFooterParser(portfolio)
    case PORTFOLIO.LEASE:
      return leaseOngoingFooterParser(portfolio)
    default:
      break
  }
}
