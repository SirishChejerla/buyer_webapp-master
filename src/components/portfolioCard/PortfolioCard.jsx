import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../core/actions'
import { useAxios } from '../../core/AxiosContext'
import { DEAL } from '../../core/constants'
import { useGlobalDispatch } from '../../core/GlobalContext'
import { createLiquidationAction } from '../../routes/portfolio/LiquidationDuck'
import { completedContentParser } from '../../utils/portfolio/content/completedParser'
import { ongoingContentParser } from '../../utils/portfolio/content/ongoingParser'
import { completedFooterParser } from '../../utils/portfolio/footer/completedParser'
import { ongoingFooterParser } from '../../utils/portfolio/footer/ongoingParser'
import Button from '../button'
import DealCode from '../dealCode'
import DealTag from '../dealTag'
import LeaseRepaidTable from '../leaseRepaidTable'
import PortfolioAttribute from '../portfolioAttribute'

import * as styles from './PortfolioCard.css'

const PortfolioAttributes = ({ attributes }) => {
  return (
    <div className={styles.portfolioAttributes}>
      {attributes?.map(({ type, title, val }) => (
        <PortfolioAttribute key={type} type={type} title={title} val={val} />
      ))}
    </div>
  )
}

const PortfolioFooterAttributes = ({ attributes, setModalType }) => {
  const handleURLClick = (type, title, val) => {
    switch (type) {
      case 'leaseRepaidTable':
        setModalType({ type, title, val })
        break
      default:
        setModalType()
        // TODO Check type and have a view tranches modal
        window.open(val, '_blank', 'noopener,noreferrer')
        break
    }
  }

  return attributes?.map(
    ({ type, title, val }) =>
      val && (
        <div key={type} className={styles.footerAttributes}>
          <Button type={'text'} label={title} handleClick={() => handleURLClick(type, title, val)} />
        </div>
      )
  )
}

export const PortfolioCard = ({ portfolio, selectedTab, innerRef }) => {
  const { authAxios } = useAxios()
  const { liquidationDispatch } = useGlobalDispatch()
  const navigate = useNavigate()

  const [content, setContent] = useState([])
  const [footer, setFooter] = useState([])
  const [modalType, setModalType] = useState()

  useEffect(() => {
    switch (selectedTab) {
      // Switch case for future expansion in case of custom fields needed to be shown for each page
      case 'settled':
        setContent(completedContentParser(portfolio))
        setFooter(completedFooterParser(portfolio))
        break
      default:
        setContent(ongoingContentParser(portfolio))
        setFooter(ongoingFooterParser(portfolio))
        break
    }
  }, [portfolio, selectedTab])

  const handleLiquidation = () => {
    navigate(ROUTES.LIQUIDATE)
    createLiquidationAction(portfolio?.dealCode, portfolio?.dealTransactionCode)(authAxios, liquidationDispatch)
  }

  return (
    <div
      className={`${styles.portfolioCard} ${
        portfolio?.dealTransactionCode?.slice(0, 1) === 'D' ? styles.debt : styles.std
      }`}
      ref={innerRef}>
      <DealCode code={portfolio?.dealTransactionCode} />
      <div className={styles.logoWrapper}>
        <DealTag isAR={portfolio?.isAR} isZC={portfolio?.isZC} />
        <img
          src={portfolio?.logo}
          className={styles.portfolioLogo}
          alt={`${portfolio?.dealTransactionCode?.slice(3, 14)}`}
        />
      </div>
      <PortfolioAttributes attributes={content} />
      <div className={styles.divider}></div>

      <div className={styles.footer}>
        <div className={styles.documents}>
          <PortfolioFooterAttributes attributes={footer} setModalType={setModalType} />
        </div>
        {portfolio?.type !== DEAL.LEASE && selectedTab === 'completed' && (
          <Button label={'Liquidate Deal'} handleClick={handleLiquidation} disabled={!portfolio?.liquefiable} />
        )}
        {modalType && (
          // TODO Move the modal to the root and just play with it by passing params and not have to declare it everywhere
          <Modal
            title={modalType.title}
            open={modalType}
            onCancel={() => setModalType()}
            footer={null}
            // TODO Alter Width to be responsive
            width={'65vw'}
            bodyStyle={{ maxHeight: '80vh', overflowY: 'scroll', padding: '1rem 1.5rem' }}>
            {modalType.type === 'leaseRepaidTable' ? (
              <LeaseRepaidTable dealTransactionCode={portfolio?.dealTransactionCode} />
            ) : null}
          </Modal>
        )}
      </div>
    </div>
  )
}
