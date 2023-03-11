import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/button'
import LoadingIndicator from '../../components/loadingIndicator'
import OverviewItemCard from '../../components/overviewItemCard'
import Text from '../../components/text'
import { REQUEST_STATUS, ROUTES } from '../../core/actions'
import { useAxios } from '../../core/AxiosContext'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import { currencyParser } from '../../utils/misc'
import { fetchFinancierAction } from '../financier/FinancierDuck'

import * as styles from './Overview.css'
import { refreshPortfolioGraphsAction, refreshPortfolioTrackerAction } from './OverviewDuck'

export const Overview = () => {
  const { authAxios } = useAxios()
  const navigate = useNavigate()
  const {
    financierState: { financier, status },
    overviewState: { portfolioTracker, portfolioTrackerStatus },
  } = useGlobal()
  const { financierDispatch, overviewDispatch } = useGlobalDispatch()

  useEffect(() => {
    fetchFinancierAction()(authAxios, financierDispatch)
  }, [])

  useEffect(() => {
    financier && refreshPortfolio()
  }, [financier])

  const handleDepositClick = () => navigate(ROUTES.DEPOSIT)
  const handleWithdrawClick = () => navigate(ROUTES.WITHDRAW)

  const refreshPortfolio = async () => {
    await refreshPortfolioGraphsAction(financier?.financierPAN)(authAxios)
    refreshPortfolioTrackerAction()(authAxios, overviewDispatch)
  }

  return (
    <div className={styles.overview}>
      {status === REQUEST_STATUS.PENDING ? (
        <LoadingIndicator />
      ) : (
        <div>
          <div className={styles.balanceAndActions}>
            <div className={styles.balanceWrapper}>
              <Text color='#6f6f6f' bold>
                Wallet Balance
              </Text>
              <Text size='1.7' bold number>
                {currencyParser(financier?.walletBalance)}
              </Text>
            </div>
            <div className={styles.actionButtons}>
              <Button className={styles.button} handleClick={handleDepositClick}>
                <Text color='white' className={styles.depositText}>
                  Deposit
                </Text>
              </Button>
              <Button className={styles.button} label='Withdraw ' type='skeleton' handleClick={handleWithdrawClick}>
                <Text color='#1a73e8' className={styles.withdrawText}>
                  Withdraw
                </Text>
              </Button>
            </div>
          </div>
          {portfolioTrackerStatus === REQUEST_STATUS.PENDING ? (
            <LoadingIndicator />
          ) : (
            <div className={styles.overviewItems}>
              {portfolioTracker?.map(portfolioTracker => {
                return <OverviewItemCard key={portfolioTracker?.type} portfolioTracker={portfolioTracker} />
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
