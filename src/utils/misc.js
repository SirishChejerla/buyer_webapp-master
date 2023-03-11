import 'intl'
import 'intl/locale-data/jsonp/en'
import { INR } from '../core/constants'
import indianNumberFormat from './indianNumberFormat'

/**
 * TradeCred's Float parser that takes in a string and rounds it to two decimal places and returns float
 */
export const customParseFloat = str => {
  return parseFloat(str.toFixed(2))
}

/**
 * Custom Date Format - takes in datestring from ruby and converts it into human understandable date string
 * monthOptions - short, long
 */
export const customDateFormat = (dateString, monthOptions = 'long') => {
  // Making it null, incase the dateString is undefined it throws Invalid Date
  const date = new Date(dateString ? dateString : null)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: monthOptions,
    day: 'numeric',
  }).format(date)
}

export const customTimeFormat = dateString => {
  const date = new Date(dateString ? dateString : null)
  return new Intl.DateTimeFormat('en-US', { timeStyle: 'full', timeZone: 'Asia/Kolkata' }).format(date)
}

/**
 * Using compound interest to calculate maturity value A = P(1 + r)^n
 * 1000(1+ 0.12)^(90/365)=1028.33
 */
export const calcMaturityValue = (purchaseAmount, duration, netIRR) => {
  return customParseFloat(purchaseAmount * Math.pow(1 + netIRR / 100, duration / 365))
}

export const inputSanitation = val => {
  // Strips 4,00,00 and returns 40,000
  const newVal = indianNumberFormat(String(val).replace(/,/g, ''))
  // number_format handles characters in input to be '0', which resets input field
  return val ? (newVal === '0' ? '' : newVal) : ''
}

/**
 * Input 20000000
 * Output ₹ 2,00,00,000
 */
export const currencyParser = amount => {
  return `${INR}\u202F${indianNumberFormat(amount)}`
}

/**
 * Calculates maturation date using the given duration
 * Returns string of date or Overdue in case of negative duration
 */
export const durationToDateParser = duration => {
  if (duration < 0) return 'Overdue'
  const date = new Date()
  date.setDate(date.getDate() + duration)
  return customDateFormat(date)
}

export const durationToDaysParser = duration => {
  if (duration < 0) return 'Overdue'
  return duration + ' days'
}

/**
 * Camel Case to Separate Capitalized words
 * camelCaseWohoo - Camel Case Wohoo
 */
export const camelToWords = camelCase => {
  const words = camelCase.replace(/([a-z])([A-Z])/g, '$1 $2')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/**
 * Checks if elements contained in both arrays are equal
 */
export const arraysEqual = (a, b) => {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  a.sort()
  b.sort()

  return a.every((val, idx) => val === b[idx])
}

export const removeSpaces = text => {
  return text.replace(/^\s+|\s+$/gm, '')
}
