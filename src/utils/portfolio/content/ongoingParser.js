import { PORTFOLIO } from '../../../core/constants'
import { currencyParser, customDateFormat } from '../../misc'

export const standardOngoingContentParser = portfolio => {
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
      title: 'Tentative Maturity Amount',
      val: portfolio?.settlementAmount,
    },
    {
      type: 'investmentDate',
      title: 'Investment Date',
      val: customDateFormat(portfolio?.investmentDate),
    },
    {
      type: 'duration',
      title: 'Tentative Duration',
      val: portfolio?.duration,
    },
    {
      type: 'settlementDate',
      title: 'Tentative Due Date',
      val: portfolio?.settlementDate,
    },
  ]
}

export const debtOngoingContentParser = portfolio => {
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
      type: 'sumOfRemainingInstallments',
      title: 'Sum of remaining installments',
      val: currencyParser(portfolio?.sumOfRemainingInstallments),
    },
    {
      type: 'remainingInstallments',
      title: 'Remaining Installments',
      val: portfolio?.remainingInstallments,
    },
    {
      type: 'investmentDate',
      title: 'Investment Date',
      val: customDateFormat(portfolio?.investmentDate),
    },
    {
      type: 'nextInstallmentDate',
      title: 'Next Installment Date',
      val: customDateFormat(portfolio?.nextInstallmentDate),
    },
  ]
}

export const leaseOngoingContentParser = portfolio => {
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
      type: 'remainingRentals',
      title: 'Remaining Rentals',
      // Removing Residual Tranche's rental count as per OPS requirement
      val: portfolio?.remainingRentals - 1,
    },
    {
      type: 'investmentDate',
      title: 'Investment Date',
      val: customDateFormat(portfolio?.investmentDate),
    },
    {
      type: 'nextRentalDate',
      title: 'Next Rental Date',
      val: customDateFormat(portfolio?.nextRentalDate),
    },
  ]
}

export const ongoingContentParser = portfolio => {
  switch (portfolio?.type) {
    case PORTFOLIO.STANDARD:
      return standardOngoingContentParser(portfolio)
    case PORTFOLIO.STANDARD_SECONDARY:
      return standardOngoingContentParser(portfolio)
    case PORTFOLIO.DEBT:
      return debtOngoingContentParser(portfolio)
    case PORTFOLIO.DEBT_SECONDARY:
      return debtOngoingContentParser(portfolio)
    case PORTFOLIO.LEASE:
      return leaseOngoingContentParser(portfolio)
    default:
      break
  }
}
