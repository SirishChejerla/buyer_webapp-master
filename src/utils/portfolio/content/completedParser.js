import { PORTFOLIO } from '../../../core/constants'
import { currencyParser, customDateFormat } from '../../misc'

const standardCompletedContentParser = portfolio => {
  // TODO Modify in case of expansion or a change

  if (Date(portfolio.settlementDate) < Date.now()) {
    portfolio.settlementDate = 'Overdue'
  }

  return [
    {
      type: 'investmentAmount',
      title: 'Investment Amount',
      val: currencyParser(portfolio?.investmentAmount),
    },
    {
      type: 'netIRR',
      title: 'Net IRR',
      val: portfolio?.netIRR,
    },
    {
      type: 'settlementAmount',
      title: 'Settlement Amount',
      val: portfolio?.settlementAmount,
    },
    {
      type: 'investmentDate',
      title: 'Investment Date',
      val: customDateFormat(portfolio?.investmentDate),
    },
    {
      type: 'duration',
      title: 'Invested Duration',
      val: portfolio?.duration,
    },
    {
      type: 'settlementDate',
      title: 'Settlement Date',
      val: portfolio?.settlementDate,
    },
  ]
}

const debtCompletedContentParser = portfolio => {
  return [
    {
      type: 'investmentAmount',
      title: 'Actual Amount Invested',
      val: currencyParser(portfolio?.investmentAmount),
    },
    {
      type: 'netIRR',
      title: 'Net IRR',
      val: portfolio?.netIRR,
    },
    {
      type: 'sumOfReceivedInstallments',
      title: 'Sum of received installments',
      val: currencyParser(portfolio?.sumOfReceivedInstallments),
    },
    {
      type: 'receivedInstallments',
      title: 'Received Installments',
      val: portfolio?.receivedInstallments,
    },
    {
      type: 'investmentDate',
      title: 'Investment Date',
      val: customDateFormat(portfolio?.investmentDate),
    },
    {
      type: 'lastInstallmentDate',
      title: 'Last Installment Date',
      val: customDateFormat(portfolio?.lastInstallmentDate),
    },
  ]
}

const leaseCompletedContentParser = portfolio => {
  return [
    {
      type: 'investmentAmount',
      title: 'Investment Amount',
      val: currencyParser(portfolio?.investmentAmount),
    },
    {
      type: 'netIRR',
      title: 'Net IRR',
      val: portfolio?.netIRR,
    },
    {
      type: 'expectedRentalPayment',
      title: 'Total Expected Repayments',
      val: currencyParser(portfolio?.expectedRentalPayment),
    },
    {
      type: 'settlementAmount',
      title: 'Settlement Amount',
      val: currencyParser(portfolio?.settlementAmount),
    },
    {
      type: 'investmentDate',
      title: 'Investment Date',
      val: customDateFormat(portfolio?.investmentDate),
    },
  ]
}

export const completedContentParser = portfolio => {
  switch (portfolio?.type) {
    case PORTFOLIO.STANDARD:
      return standardCompletedContentParser(portfolio)
    case PORTFOLIO.STANDARD_SECONDARY:
      return standardCompletedContentParser(portfolio)
    case PORTFOLIO.DEBT:
      return debtCompletedContentParser(portfolio)
    case PORTFOLIO.DEBT_SECONDARY:
      return debtCompletedContentParser(portfolio)
    case PORTFOLIO.LEASE:
      return leaseCompletedContentParser(portfolio)
    default:
      break
  }
}
