export const liquidationParser = liq => {
  const liqParser = {
    liquidationId: liq?.id,
    liquidationAmount: liq?.liquidation_amount,
    liquidationRequestedDate: liq?.liquidation_request_placed_on,
    liquidationExpirationDate: liq?.liquidation_request_expiry_date,
    effectiveIRR: liq?.effective_irr,
    isAR: liq?.is_auto_renewable,
    offerForSaleDoc: liq?.document_secondary_offer_for_sale?.service_url,
  }

  return liqParser
}
