import { DEAL } from '../../core/constants'
import { customParseFloat, durationToDateParser } from '../misc'

/**
 * Global modifications need to exist in global parser here
 * Custom logical changes or minor nuances must be handled in
 * respective children parsers
 */
export const standardDealParser = deal => {
  // Import object params as per documentation
  const stdDeal = {
    dealCode: deal?.code,
    isAR: deal?.is_auto_renewable,
    netIRR: deal?.net_irr_to_be_given_to_investor_percentage,
    originalDuration: deal?.credit_period_in_days,
    graceDuration: deal?.grace_period_for_investor_in_days,
    minPurchaseAmount: deal?.minimum_purchase_amount,
    progressBar: true,
    totalAmount: deal?.consideration_amount,
    soldAmount: deal?.new_funded_amount,
    dealReportUrl: deal?.document_deal_report?.service_url,
    logo: deal?.deal_brand?.document_deal_brand_logo?.service_url,
  }

  const { netIRR, originalDuration, graceDuration } = stdDeal

  stdDeal.type = DEAL.STANDARD
  stdDeal.netIRR = customParseFloat(netIRR)
  stdDeal.duration = originalDuration + graceDuration

  return { ...stdDeal }
}

export const standardSecondaryDealParser = deal => {
  const stdSecDeal = {
    dealCode: deal?.deal_transaction?.code,
    isAR: deal?.is_auto_renewable,
    netIRR: deal?.deal_transaction?.net_irr_to_be_given_to_investor_percentage,
    duration: deal?.secondary_investment_tenure,
    minPurchaseAmount: deal?.secondary_consideration_amount,
    dealLiquidationId: deal?.id,
    isSecondary: true,
    maturityValue: deal?.deal_transaction?.net_tentative_maturity_value_rounded,
    maturityDate: deal?.deal_transaction?.financier_due_date,
    dealReportUrl: deal?.deal_transaction?.deal?.document_deal_report?.service_url,
    logo: deal?.deal_transaction?.deal?.deal_brand?.document_deal_brand_logo?.service_url,
  }

  const { netIRR } = stdSecDeal

  stdSecDeal.type = DEAL.STANDARD_SECONDARY
  stdSecDeal.netIRR = customParseFloat(netIRR)

  return { ...stdSecDeal }
}

export const debtDealParser = deal => {
  const debtDeal = {
    dealCode: deal?.code,
    netIRR: deal?.net_irr_to_be_given_to_investor_percentage,
    availableLots: deal?.available_lots,
    amountPerLot: deal?.current_consideration_amount_per_lot,
    debtTermsUrl: deal?.document_debt_deal_term?.service_url,
    logo: deal?.deal_brand?.document_deal_brand_logo?.service_url,
    isZC: true,
    isUnits: deal?.lots_or_units === 'UNITS',
  }

  const { netIRR } = debtDeal

  debtDeal.type = DEAL.DEBT
  debtDeal.netIRR = customParseFloat(netIRR)

  return { ...debtDeal }
}

export const debtSecondaryDealParser = deal => {
  const debtSecDeal = {
    baseDealCode: deal?.deal_transaction?.deal?.code,
    dealCode: deal?.deal_transaction?.code,
    netIRR: deal?.deal_transaction?.net_irr_to_be_given_to_investor_percentage,
    availableLots: deal?.available_lots,
    amountPerLot: deal?.secondary_consideration_amount,
    dealLiquidationId: deal?.id,
    isSecondary: true,
    debtTermsUrl: deal?.deal_transaction?.deal?.document_debt_deal_term?.service_url,
    logo: deal?.deal_transaction?.deal?.deal_brand?.document_deal_brand_logo?.service_url,
    isZC: true,
    isUnits: deal?.lots_or_units === 'UNITS',
  }

  const { netIRR } = debtSecDeal

  debtSecDeal.type = DEAL.DEBT_SECONDARY
  debtSecDeal.netIRR = customParseFloat(netIRR)

  return { ...debtSecDeal }
}

export const leaseDealParser = deal => {
  const leaseDeal = {
    dealCode: deal?.code,
    netIRR: deal?.net_irr_to_be_given_to_investor_percentage,
    minPurchaseAmount: deal?.minimum_purchase_amount,
    considerationAmount: deal?.consideration_amount,
    logo: deal?.deal_brand?.document_deal_brand_logo?.service_url,
    totalUnits: deal?.number_of_units,
    residualPercentage: deal?.lease_residual_amount_percent,
    tdsPercentage: deal?.tds_on_rent_deducted_by_customer,
    totalAmount: deal?.lease_total_investmnent_value,
    soldAmount: deal?.new_funded_amount,
    totalNumberOfRentals: deal?.number_of_rental_payments,
    rentalFrequency: deal?.time_gap_between_rental_payments,
    rentalValue: deal?.amount_of_rent,
    rentalStartDuration: deal?.first_rental_due_in_days,
    dealReportUrl: deal?.document_deal_report?.service_url,
  }

  const { netIRR, tdsPercentage, rentalFrequency, totalNumberOfRentals } = leaseDeal

  leaseDeal.type = DEAL.LEASE
  leaseDeal.netIRR = customParseFloat(netIRR)
  leaseDeal.tdsPercentage = customParseFloat(tdsPercentage / 100)
  leaseDeal.rentalEndDate = durationToDateParser(rentalFrequency * totalNumberOfRentals)

  return { ...leaseDeal }
}

export const leaseSecondaryDealParser = () => {}
