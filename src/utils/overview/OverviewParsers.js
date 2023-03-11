import amountInvested from '../../assets/svg/amountInvested.svg'
import currentValue from '../../assets/svg/currentValue.svg'
import netGain from '../../assets/svg/netGain.svg'
import netIRR from '../../assets/svg/netIRR.svg'
import { currencyParser, customParseFloat } from '../misc'

const portfolioTrackerParser = portfolioTracker => {
  return {
    amountInvested: portfolioTracker?.amount_invested,
    currentInvestedValue: portfolioTracker?.current_value,
    netGain: portfolioTracker?.net_gain,
    netIRR: portfolioTracker?.net_irr,
  }
}

export const portfolioTrackersParser = portfolioTracker => {
  const parsedPortfolioTracker = portfolioTrackerParser(portfolioTracker)
  return [
    {
      type: 'amountInvested',
      title: 'Amount Invested',
      val: currencyParser(parsedPortfolioTracker?.amountInvested),
      icon: amountInvested,
      iconColor: '#2765fc',
    },
    {
      type: 'currentInvestedValue',
      title: 'Current Value',
      val: currencyParser(parsedPortfolioTracker?.currentInvestedValue),
      icon: currentValue,
      iconColor: '#fa9353',
    },
    {
      type: 'netGain',
      title: 'Net Gain',
      val: currencyParser(parsedPortfolioTracker?.netGain),
      icon: netGain,
      iconColor: '#37c2cf',
    },
    {
      type: 'netIRR',
      title: 'Net IRR',
      val: customParseFloat(parsedPortfolioTracker?.netIRR) + '\u2006' + '%',
      icon: netIRR,
      iconColor: '#a067fa',
    },
  ]
}
