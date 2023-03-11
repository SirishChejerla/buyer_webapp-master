import { useEffect, useState } from 'react'

const useTranches = (purchaseAmount, purchase) => {
  // None of the calculations are rounded off, even though the sum will not match rounded off sum(visually shown)
  const [response, setResponse] = useState({})

  useEffect(() => {
    // Get value ratio and get units
    const consideredUnits = (purchaseAmount / purchase?.totalAmount) * purchase?.totalUnits
    // Using units and calculating the fraction of rentalValue
    const tranchValue = purchase?.rentalValue * (consideredUnits / purchase?.totalUnits)
    const residualValue = (tranchValue * purchase?.residualPercentage) / 100
    const tdsAmount = tranchValue * purchase?.tdsPercentage

    setResponse({
      tranchValue: tranchValue,
      residualValue: residualValue,
      tdsAmount: tdsAmount,
    })
  }, [purchaseAmount, purchase])

  return response
}

export default useTranches
