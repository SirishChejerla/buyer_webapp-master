import { useEffect, useState } from 'react'
import { VALIDATION_STATUS } from '../core/actions'
import { DEAL } from '../core/constants'
import { useGlobal } from '../core/GlobalContext'
import { currencyParser } from '../utils/misc'
import useMBASign from './useMBASign'

const usePurchaseValidation = (purchaseAmount, purchase) => {
  const {
    financierState: {
      financier: {
        walletBalance,
        fixedIRR,
        mba: { hasMBA },
      },
    },
  } = useGlobal()
  const { mbaSign } = useMBASign()

  const [response, setResponse] = useState({
    status: VALIDATION_STATUS.IDLE,
    message: 'Yet to begin',
    action: () => {},
    actionText: '',
  })

  const handleMBA = () => {
    console.log('Handling MBA Signing')
    mbaSign()
  }

  const handleDeposit = () => {
    console.log('Handling Additional money deposit')
  }

  useEffect(() => {
    // Debt Deals aren't required to have a signed MBA, Hence exempted
    if (!hasMBA && !(purchase?.type === DEAL.DEBT || purchase?.type === DEAL.DEBT_SECONDARY)) {
      setResponse({
        status: VALIDATION_STATUS.FAILURE,
        message: 'Sign Master Buy Agreement(MBA) to buy this deal.',
        action: handleMBA,
        actionText: 'Sign MBA',
      })
    } else if (purchaseAmount === 0 || purchaseAmount === '' || !purchaseAmount) {
      setResponse({
        status: VALIDATION_STATUS.IDLE,
        message: `Enter a valid purchase amount.`,
        action: () => {},
        actionText: '',
      })
    } else if (purchaseAmount < purchase?.minClearedAmount) {
      setResponse({
        status: VALIDATION_STATUS.FAILURE,
        message: 'Minimum purchase amount criteria not met.',
        action: () => {},
        actionText: '',
      })
    } else if (purchaseAmount > walletBalance) {
      setResponse({
        status: VALIDATION_STATUS.WARNING,
        message: `Add ${currencyParser(purchaseAmount - walletBalance)} to your wallet to buy this deal.`,
        action: handleDeposit,
        actionText: '',
      })
    } else if (purchaseAmount > purchase?.totalAmount) {
      setResponse({
        status: VALIDATION_STATUS.WARNING,
        message: `Too much! Consider to invest ${currencyParser(
          purchaseAmount - purchase?.totalAmount
        )} in other deals.`,
        action: () => {},
        actionText: '',
      })
    } else if (fixedIRR && purchase?.isAR) {
      setResponse({
        status: VALIDATION_STATUS.FAILURE,
        message: `Investors with fixed IRRs cannot buy AR deal.`,
        action: () => {},
        actionText: '',
      })
    } else {
      setResponse({
        status: VALIDATION_STATUS.SUCCESS,
        message: 'Ready to purchase.',
        action: () => {},
        actionText: '',
      })
    }
  }, [purchaseAmount, purchase, walletBalance, fixedIRR, hasMBA])

  return response
}

export default usePurchaseValidation
