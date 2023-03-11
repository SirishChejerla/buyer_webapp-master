import { DEAL } from '../../core/constants'

export const standardDealPurchaseParser = deal => {
  const standardPurchase = {
    type: deal?.type,
    dealCode: deal?.dealCode,
    isAR: deal?.isAR,
    // minClearedAmount is equivalent to minPurchaseAmount, minClearedAmount is only used for validations and prefills
    minClearedAmount: deal?.minPurchaseAmount,
    totalAmount: deal?.totalAmount,
  }

  standardPurchase.editable = true

  return { ...standardPurchase }
}

export const standardSecondaryDealPurchaseParser = deal => {
  const standardSecondaryPurchase = {
    type: deal?.type,
    dealCode: deal?.dealCode,
    isAR: deal?.isAR,
    minClearedAmount: deal?.minPurchaseAmount,
    dealLiquidationId: deal?.dealLiquidationId,
  }

  standardSecondaryPurchase.editable = false

  return { ...standardSecondaryPurchase }
}

export const debtDealPurchaseParser = deal => {
  const debtPurchase = {
    type: deal?.type,
    dealCode: deal?.dealCode,
    minClearedAmount: deal?.amountPerLot,
    availableLots: deal?.availableLots,
    isUnits: deal?.isUnits,
  }

  debtPurchase.editable = false

  return { ...debtPurchase }
}

export const debtSecondaryDealPurchaseParser = deal => {
  const debtPurchase = {
    type: deal?.type,
    dealCode: deal?.dealCode,
    minClearedAmount: deal?.amountPerLot,
    availableLots: deal?.availableLots,
    dealLiquidationId: deal?.dealLiquidationId,
    isUnits: deal?.isUnits,
  }

  debtPurchase.editable = false

  return { ...debtPurchase }
}

export const leaseDealPurchaseParser = deal => {
  const leasePurchase = {
    type: deal?.type,
    dealCode: deal?.dealCode,
    totalAmount: Math.round(deal?.totalAmount),
    minClearedAmount: deal?.minPurchaseAmount,
    considerationAmount: deal?.considerationAmount,
    totalUnits: deal?.totalUnits,
    residualPercentage: deal?.residualPercentage,
    tdsPercentage: deal?.tdsPercentage,
    totalNumberOfRentals: deal?.totalNumberOfRentals,
    rentalValue: deal?.rentalValue,
    rentalEndDate: deal?.rentalEndDate,
  }

  leasePurchase.editable = true

  return { ...leasePurchase }
}

export const dealPurchaseParser = deal => {
  switch (deal?.type) {
    case DEAL.STANDARD:
      return standardDealPurchaseParser(deal)
    case DEAL.STANDARD_SECONDARY:
      return standardSecondaryDealPurchaseParser(deal)
    case DEAL.DEBT:
      return debtDealPurchaseParser(deal)
    case DEAL.DEBT_SECONDARY:
      return debtSecondaryDealPurchaseParser(deal)
    case DEAL.LEASE:
      return leaseDealPurchaseParser(deal)
    default:
      break
  }
}
