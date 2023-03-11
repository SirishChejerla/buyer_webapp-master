import React, { useEffect, useState } from 'react'
import { VALIDATION_STATUS } from '../../core/actions'
import { DEAL } from '../../core/constants'
import { useGlobal } from '../../core/GlobalContext'
import usePurchaseValidation from '../../customhooks/usePurchaseValidation'
import { inputSanitation } from '../../utils/misc'
import Button from '../button'
import Input from '../input'
import Text from '../text'
import * as styles from './DealPurchase.css'

export const DealPurchase = ({ purchase, purchaseAmount, setPurchaseAmount, buyDeal }) => {
  const {
    financierState: {
      financier: { walletBalance },
    },
  } = useGlobal()

  const [purchaseLots, setPurchaseLots] = useState('')

  const purchaseValidation = usePurchaseValidation(purchaseAmount?.replace(/,/g, ''), purchase)

  const handleInputChange = val => {
    setPurchaseAmount(inputSanitation(val))
  }

  const handleLotsChange = lots => {
    let validatedLots = parseInt(lots) > purchase?.availableLots ? purchase?.availableLots : lots
    setPurchaseLots(inputSanitation(validatedLots))
    setPurchaseAmount(inputSanitation(validatedLots * purchase?.minClearedAmount))
  }

  // This is run only once during component Init
  useEffect(() => {
    if (purchase?.editable === false) {
      handleInputChange(purchase?.minClearedAmount)
      /**
     * Pre fill multiple lots input logic
     * 
     * 80 Lots 1L per Lot
    | Balance | Lots to show |    Calculation   |
    |:-------:|:------------:|:----------------:|
    | 7.6L    | 7lots        | (7.6/1=7)        |
    | 0       | 80lots       | (0/1=0)          |
    | 58k     | 80lots       | (58000/100000=0) |
     */
      if (purchase?.availableLots > 1 && purchase?.type === DEAL.DEBT) {
        handleLotsChange(
          String(
            parseInt(walletBalance / purchase?.minClearedAmount)
              ? parseInt(walletBalance / purchase?.minClearedAmount)
              : purchase?.availableLots
          )
        )
      } else if (purchase?.type === DEAL.DEBT_SECONDARY) {
        // Remove the if conditions when we start to support purchasing multiple lot purchase in secondary deals
        handleLotsChange(String(purchase?.availableLots))
      }
    } else {
      /**
       * Pre fill purchase amount input logic
       *
       * handleInputChange will validate 0 or null or '' values to undefined
       * Set minClearedAmount if minClearedAmount > walletBalance
       * Set walletBalance if walletBalance > minClearedAmount
       * Set totalAmount if walletBalance > totalAmount
       */
      handleInputChange(
        String(
          purchase?.minClearedAmount > walletBalance
            ? purchase?.minClearedAmount
            : walletBalance > purchase?.totalAmount
            ? purchase?.totalAmount
            : walletBalance
        )
      )
    }
  }, [purchase, walletBalance])

  // TODO - All hex colors needs to be added to colors in themes

  const textColor =
    purchaseValidation?.status === VALIDATION_STATUS.WARNING
      ? '#fc8019' //#FFB407
      : purchaseValidation?.status === VALIDATION_STATUS.SUCCESS
      ? '#30B195'
      : '#DB676D' //#DB676D -new    #d62650 -old

  const iconName =
    purchaseValidation?.status === VALIDATION_STATUS.WARNING
      ? 'information-circle'
      : purchaseValidation?.status === VALIDATION_STATUS.SUCCESS
      ? 'trending-up'
      : 'trending-down'

  const handleBuyButtonPress = () => buyDeal(purchaseValidation)

  return (
    <div>
      <div className={styles.purchase}>
        <Input
          className={styles.purchaseInput}
          textStyle={styles.purchaseInputText}
          placeholder={`Enter Amount ..`}
          onChange={handleInputChange}
          value={purchaseAmount}
          number
          editable={purchase?.editable}
          showINR
        />
        {purchase?.type === DEAL.DEBT && purchase?.availableLots > 1 && !purchase?.isUnits && (
          <Input
            className={styles.lotsInput}
            placeholder={'Enter Lots ..'}
            onChange={handleLotsChange}
            number
            value={purchaseLots}
          />
        )}
        <Button
          label={'BUY'}
          className={styles.button}
          disabled={purchaseValidation?.status !== VALIDATION_STATUS.SUCCESS}
          handleClick={handleBuyButtonPress}
        />
      </div>
      {/* Error Validation needs to be shown here */}
      {purchaseValidation.status === VALIDATION_STATUS.IDLE ? (
        <div className={styles.purchaseError}>
          <Text className={styles.errorText}>{''}</Text>
        </div>
      ) : (
        <div className={styles.purchaseError}>
          <Text size='0.9' bold={purchaseValidation?.status === VALIDATION_STATUS.SUCCESS} color={textColor}>
            {purchaseValidation?.message}
          </Text>
          <Button type='text' handleClick={purchaseValidation.action}>
            <Text size='0.9' color='#1a73e8'>
              {' ' + purchaseValidation?.actionText}
            </Text>
          </Button>
        </div>
      )}
    </div>
  )
}
