import { Tabs } from 'antd'
import React, { useCallback, useRef, useState } from 'react'
import LoadingIndicator from '../../components/loadingIndicator'
import NoDealsInfo from '../../components/noDealsInfo'
import PortfolioCard from '../../components/portfolioCard'
import Text from '../../components/text'
import { PORTFOLIO_FILTERS } from '../../core/constants'
import useOrdersToDisplay from '../../customhooks/useOrdersToDisplay'
import * as styles from './Portfolio.css'

export const Portfolio = () => {
  const observer = useRef()
  // completed is the Ongoing Transactions Tab
  const [selectedTab, setSelectedTab] = useState('completed')

  const [pageNumber, setPageNumber] = useState(1)
  const { orders, hasMore, loading, error } = useOrdersToDisplay(pageNumber, selectedTab)

  const handleTabChange = activeKey => {
    setPageNumber(1)
    setSelectedTab(PORTFOLIO_FILTERS[activeKey].state)
  }

  // Callback increments PageNumber when last element is viewed
  const lastBookElementRef = useCallback(
    node => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(prevPageNumber => prevPageNumber + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore, selectedTab]
  )

  return (
    <div className={styles.portfolioTabs}>
      <Tabs
        defaultActiveKey='0'
        onChange={handleTabChange}
        items={PORTFOLIO_FILTERS.map((filters, index) => ({
          label: filters?.title,
          key: index,
          children: (
            <>
              <div className={styles.orders}>
                {orders?.map((item, index) => {
                  if (orders?.length === index + 1) {
                    return (
                      <PortfolioCard
                        className={styles.order}
                        innerRef={lastBookElementRef}
                        key={item?.dealTransactionCode}
                        portfolio={item}
                        selectedTab={selectedTab}
                      />
                    )
                  } else {
                    return (
                      <PortfolioCard
                        className={styles.order}
                        key={item?.dealTransactionCode}
                        portfolio={item}
                        selectedTab={selectedTab}
                      />
                    )
                  }
                })}
              </div>
              {orders?.length === 0 && loading === false && <NoDealsInfo />}
              <div>{loading && <LoadingIndicator />}</div>
              <div>{error && <Text>{error}</Text>}</div>
            </>
          ),
        }))}
      />
    </div>
  )
}
