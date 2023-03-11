import { DEAL } from '../../core/constants'
import {
  calcMaturityValue,
  currencyParser,
  customDateFormat,
  durationToDateParser,
  durationToDaysParser,
} from '../misc'

export const stdDealSummaryParser = (deal, purchaseAmount) => {
  return [
    {
      type: 'netIRR',
      title: 'Expected Net IRR',
      val: deal?.netIRR + ' %',
    },
    {
      type: 'duration',
      title: 'Tentative Deal Duration',
      val: durationToDaysParser(deal?.duration),
    },
    {
      type: 'maturityDate',
      title: 'Tentative Maturity Date',
      val: durationToDateParser(deal?.duration),
    },
    {
      type: 'purchaseAmount',
      title: 'Investment Amount',
      val: currencyParser(purchaseAmount?.replace(/,/g, '')),
    },
    {
      type: 'maturityValue',
      title: 'Tentative Maturity Value',
      val: currencyParser(calcMaturityValue(purchaseAmount?.replace(/,/g, ''), deal?.duration, deal?.netIRR)),
    },
  ]
}

export const stdSecDealSummaryParser = deal => {
  return [
    {
      type: 'netIRR',
      title: 'Expected Net IRR',
      val: deal?.netIRR + ' %',
    },
    {
      type: 'duration',
      title: 'Tentative Deal Duration',
      val: durationToDaysParser(deal?.duration),
    },
    {
      type: 'maturityDate',
      title: 'Tentative Maturation Date',
      val: customDateFormat(deal?.maturityDate),
    },
    {
      type: 'minPurchaseAmount',
      title: 'Investment Amount',
      val: currencyParser(deal?.minPurchaseAmount),
    },
    {
      type: 'maturityValue',
      title: 'Tentative maturity Value',
      val: deal?.duration < 0 ? 'Value as per IRR' : currencyParser(deal?.maturityValue),
    },
  ]
}

export const leaseDealSummaryParser = deal => {
  return [
    {
      type: 'netIRR',
      title: 'Expected Net IRR',
      val: deal?.netIRR + ' %',
    },
    {
      type: 'rentalStartDate',
      title: 'Rental Start Date',
      val: durationToDateParser(deal?.rentalStartDuration),
    },
    {
      type: 'rentalFrequency',
      title: 'Rental Frequency',
      val: durationToDaysParser(deal?.rentalFrequency),
    },
    {
      type: 'rentalEndDate',
      title: 'Rental End Date',
      val: deal?.rentalEndDate,
    },
    {
      type: 'totalNumberOfRentals',
      title: 'No. of Rentals',
      val: deal?.totalNumberOfRentals,
    },
    {
      type: 'rentalValue',
      title: 'Rental Value',
      val: currencyParser(deal?.rentalValue),
    },
  ]
}

/**
 * All Custom Fields, calculations and namings shall be done here
 */
export const dealSummaryParser = (deal, purchaseAmount) => {
  switch (deal?.type) {
    case DEAL.STANDARD:
      return stdDealSummaryParser(deal, purchaseAmount)
    case DEAL.STANDARD_SECONDARY:
      return stdSecDealSummaryParser(deal)
    case DEAL.LEASE:
      return leaseDealSummaryParser(deal)
    default:
      break
  }
}
