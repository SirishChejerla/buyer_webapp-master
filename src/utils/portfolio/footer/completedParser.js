import { PORTFOLIO } from '../../../core/constants'
import { debtOngoingFooterParser, leaseOngoingFooterParser, standardOngoingFooterParser } from './ongoingParser'

const standardCompletedFooterParser = portfolio => {
  // TODO Change in case of expansion or a change
  return standardOngoingFooterParser(portfolio)
}

const debtCompletedFooterParser = portfolio => {
  return debtOngoingFooterParser(portfolio)
}

const leaseCompletedFooterParser = portfolio => {
  return leaseOngoingFooterParser(portfolio)
}

export const completedFooterParser = portfolio => {
  switch (portfolio?.type) {
    case PORTFOLIO.STANDARD:
      return standardCompletedFooterParser(portfolio)
    case PORTFOLIO.STANDARD_SECONDARY:
      return standardCompletedFooterParser(portfolio)
    case PORTFOLIO.DEBT:
      return debtCompletedFooterParser(portfolio)
    case PORTFOLIO.DEBT_SECONDARY:
      return debtCompletedFooterParser(portfolio)
    case PORTFOLIO.LEASE:
      return leaseCompletedFooterParser(portfolio)
    default:
      break
  }
}
