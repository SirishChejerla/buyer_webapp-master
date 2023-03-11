import { Progress } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dealContentParser } from '../../utils/deals/dealContentParsers'
import { dealFooterParser } from '../../utils/deals/dealFooterParsers'
import { dealPurchaseParser } from '../../utils/deals/dealPurchaseParsers'
import { dealSummaryParser } from '../../utils/deals/dealSummaryParsers'
import { currencyParser, customParseFloat } from '../../utils/misc'
import ConfirmationOfSigning from '../confirmationOfSigning'
import DealCode from '../dealCode'
import DealContent from '../dealContent'
import DealFooter from '../dealFooter'
import DealPurchase from '../dealPurchase'
import DealSummary from '../dealSummary'
import DealTag from '../dealTag'
import Text from '../text'

import * as styles from './DealCard.css'

/**
 * Every comp. must work exclusively
 * DealCode
 * DealHeader - Will contain AR, ZeroCost Liquidity & LOGO
 * DealContent
 * DealPurchase - Includes error
 * DealFooter
 */
export const DealCard = ({ deal, innerRef }) => {
  const navigate = useNavigate()
  const [showSummary, setShowSummary] = useState(false)
  const [showSigning, setShowSigning] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [dealContent, setDealContent] = useState()
  const [dealSummary, setDealSummary] = useState()
  const [dealFooter, setDealFooter] = useState()
  const [dealPurchase, setDealPurchase] = useState()

  useEffect(() => {
    setDealContent(dealContentParser(deal))
    setDealFooter(dealFooterParser(deal))
    setDealPurchase(dealPurchaseParser(deal))
  }, [deal])

  useEffect(() => {
    setDealSummary(dealSummaryParser(deal, purchaseAmount))
  }, [deal, purchaseAmount])

  const buyDeal = purchaseValidation => {
    console.log(purchaseValidation)
    setShowSigning(true)
  }

  const get_color_based_on_progress = progress => (progress < 0.5 ? '#6190E8' : progress < 0.8 ? '#43cea2' : '#FD746C')

  const deal_progress = customParseFloat(deal?.soldAmount / deal?.totalAmount)
  const deal_progress_percentage = Math.floor(deal_progress * 100)
  const progress_color = get_color_based_on_progress(deal_progress)

  // TODO Replace this progress bar with custom component
  const ProgressBarComponent = (
    <div className={styles.progressBar}>
      <div>
        <Progress percent={deal_progress_percentage} status='active' strokeColor={progress_color} />
      </div>
      <div className={styles.progressText}>
        <Text size='0.82' color='#757474' number>
          {currencyParser(deal?.totalAmount - deal?.soldAmount) + ' — Available'}
        </Text>
        <Text size='0.82' color='#757474' number>
          {currencyParser(deal?.totalAmount) + ' — Total'}
        </Text>
      </div>
    </div>
  )

  return (
    <div
      className={`${styles.dealCard} ${deal?.dealCode?.slice(0, 1) === 'D' ? styles.debt : styles.std}`}
      ref={innerRef}>
      <DealCode code={deal?.dealCode} />
      <div className={styles.dealCardContent}>
        {showSigning ? (
          <ConfirmationOfSigning
            purchase={dealPurchase}
            purchaseAmount={purchaseAmount?.replace(/,/g, '')}
            setShowSigning={setShowSigning}
          />
        ) : showSummary ? (
          <DealSummary summary={dealSummary} setShowSummary={setShowSummary} />
        ) : (
          <>
            <div className={styles.logoWrapper}>
              <DealTag isAR={deal?.isAR} isZC={deal?.isZC} />
              <img src={deal?.logo} className={styles.dealLogo} alt={`${deal?.dealCode?.slice(3, 14)}`} />
            </div>
            {deal?.progressBar && ProgressBarComponent}
            <DealContent content={dealContent} />
            <DealPurchase
              purchase={dealPurchase}
              purchaseAmount={purchaseAmount}
              setPurchaseAmount={setPurchaseAmount}
              buyDeal={buyDeal}
            />
          </>
        )}
        {!showSigning && (
          <DealFooter
            footer={dealFooter}
            showSummary={showSummary}
            setShowSummary={setShowSummary}
            purchaseAmount={purchaseAmount}
          />
        )}
      </div>
    </div>
  )
}
