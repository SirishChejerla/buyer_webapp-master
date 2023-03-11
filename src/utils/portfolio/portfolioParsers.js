import { PORTFOLIO } from '../../core/constants'
import { currencyParser, customDateFormat } from '../misc'

const temporaryUseCaseBasedParser = portfolio => {
  let settlementAmount = currencyParser(portfolio?.net_tentative_maturity_value_rounded)
  let settlementDate = customDateFormat(portfolio?.financier_due_date)
  let duration = portfolio?.credit_period_in_days + portfolio?.grace_period_for_investor_in_days

  if (portfolio?.aasm_state === 'settled') {
    if (portfolio?.deal_transaction_settlements?.length > 0) {
      settlementAmount = currencyParser(portfolio?.deal_transaction_settlements[0]?.net_amount_paid_to_financier)
      settlementDate = customDateFormat(portfolio?.deal_transaction_settlements[0]?.settled_on)
      duration = portfolio?.deal_transaction_settlements[0].actual_credit_period_in_days_for_financier
    }
  } else if (portfolio?.transacted_on > portfolio?.financier_due_date) {
    settlementAmount = 'Amount as per Net IRR'
    settlementDate = 'Overdue'
  }

  return [settlementAmount, settlementDate, duration]
}

export const portfolioParser = portfolio => {
  const type = portfolio?.deal_type
  if (['DealTransaction', 'SecondaryDealTransaction', 'StandardDeal', null].includes(type)) {
    return standardPortfolioParser(portfolio)
  } else if (['DebtDealTransaction', 'SecondaryDebtDealTransaction'].includes(type)) {
    return debtPortfolioParser(portfolio)
  } else {
    return leasePortfolioParser(portfolio)
  }
}

const standardPortfolioParser = portfolio => {
  const stdPortfolio = {
    dealCode: portfolio?.deal?.code,
    dealTransactionCode: portfolio?.code,
    state: portfolio?.aasm_state,
    netIRR: portfolio?.net_irr_to_be_given_to_investor_percentage,
    isAR: portfolio?.deal?.is_auto_renewable,
    investmentAmount: portfolio?.amount_offered,
    investmentDate: portfolio?.transacted_on,
    liquefiable: portfolio?.is_liquefiable,
    dealReport: portfolio?.deal?.document_deal_report?.service_url,
    logo: portfolio?.deal?.deal_brand?.document_deal_brand_logo?.service_url,
    liquidateDisabledReason:
      portfolio?.current_secondary_sale_config && portfolio?.aasm_state !== 'settled'
        ? portfolio?.disabled_liquidation_message
        : '',
    confirmationOfPurchaseUrl:
      portfolio?.document_confirmation_of_purchase?.service_url ||
      portfolio?.document_secondary_confirmation_of_purchase?.service_url,
  }

  const [settlementAmount, settlementDate, duration] = temporaryUseCaseBasedParser(portfolio)
  stdPortfolio.settlementAmount = settlementAmount
  stdPortfolio.settlementDate = settlementDate
  stdPortfolio.duration = duration

  // Because of some older deals that doesn't have deal_type belonging to either of the mentioned
  stdPortfolio.type =
    portfolio?.deal_type === 'SecondaryDealTransaction'
      ? PORTFOLIO.STANDARD_SECONDARY
      : portfolio?.deal_type === 'DealTransaction'
      ? PORTFOLIO.STANDARD
      : PORTFOLIO.STANDARD

  // TODO - Apparently both secondary and primary deal have credit_period_in_days in the root object itself instead of one inside "deal"
  // if ('SecondaryDealTransaction'.includes(stdPortfolio.type)) {
  //   stdPortfolio.duration = portfolio?.credit_period_in_days + portfolio?.grace_period_for_investor_in_days
  // }

  return stdPortfolio
}

const debtPortfolioParser = portfolio => {
  const debtPortfolio = {
    dealCode: portfolio?.deal?.code,
    dealTransactionCode: portfolio?.code,
    state: portfolio?.aasm_state,
    netIRR: portfolio?.net_irr_to_be_given_to_investor_percentage,
    isZC: true,
    investmentAmount: portfolio?.amount_offered,
    investmentDate: portfolio?.transacted_on,
    liquefiable: portfolio?.is_liquefiable,
    logo: portfolio?.deal?.deal_brand?.document_deal_brand_logo?.service_url,
    remainingInstallments: portfolio?.remaining_installments_count,
    receivedInstallments: portfolio?.received_installments_count,
    sumOfRemainingInstallments: portfolio?.sum_of_remaining_installments,
    sumOfReceivedInstallments: portfolio?.sum_of_received_installments,
    nextInstallmentDate: portfolio?.next_installment_date,
    lastInstallmentDate: portfolio?.last_installment_received_date,
    confirmationOfPurchaseUrl: portfolio?.document_securities_transfer_form?.service_url,
    dealCalculationsUrl: portfolio?.document_ncd_calculation_file?.service_url,
  }

  debtPortfolio.type =
    portfolio?.deal_type === 'SecondaryDebtDealTransaction' ? PORTFOLIO.DEBT_SECONDARY : PORTFOLIO.DEBT

  // console.log(debtPortfolio)
  return debtPortfolio
}

const leasePortfolioParser = portfolio => {
  const leasePortfolio = {
    dealCode: portfolio?.deal?.code,
    dealTransactionCode: portfolio?.code,
    type: PORTFOLIO.LEASE,
    netIRR: portfolio?.net_irr_to_be_given_to_investor_percentage,
    investmentAmount: portfolio?.amount_offered,
    investmentDate: portfolio?.transacted_on,
    liquefiable: portfolio?.is_liquefiable,
    logo: portfolio?.deal?.deal_brand?.document_deal_brand_logo?.service_url,
    nextRentalDate: portfolio?.next_installment_date,
    remainingRentals: portfolio?.remaining_installments_count,
    expectedRentalPayment: portfolio?.total_expected_rental_payment,
    confirmationOfRentUrl: portfolio?.document_lease_confirmation_of_rent_for_buyer?.service_url,
  }

  // console.log(leasePortfolio)
  return leasePortfolio
}
