import React, { useCallback, useEffect, useRef, useState } from 'react'
import Deal from '../../components/deal'
import LoadingIndicator from '../../components/loadingIndicator'
import NoDealsInfo from '../../components/noDealsInfo'
import Text from '../../components/text'
import { useAxios } from '../../core/AxiosContext'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import useDealsToDisplay from '../../customhooks/useDealsToDisplay'
import { fetchFinancierAction } from '../financier/FinancierDuck'
import * as styles from './Deals.css'

export const Deals = () => {
  const [noDealsCurrently, setNoDealsCurrently] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [dealFetchType, setDealFetchType] = useState('primary')

  const { authAxios } = useAxios()
  const {
    financierState,
    dealsState: { query },
  } = useGlobal()
  const { financierDispatch } = useGlobalDispatch()
  const observer = useRef()

  const { deals, hasMore, loading, error } = useDealsToDisplay(query, pageNumber, dealFetchType)

  useEffect(() => {
    // When all primaries are loaded set to load secondary deal and reset page number
    if (dealFetchType === 'primary' && !hasMore && !loading) {
      setDealFetchType('secondary')
      setPageNumber(1)
    }
  }, [dealFetchType, hasMore, loading])

  useEffect(() => {
    // On query change reset all
    setDealFetchType('primary')
    setPageNumber(1)
  }, [query])

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
    [loading, hasMore]
  )

  // Initially, Fetch Financier Data
  useEffect(() => {
    fetchFinancierAction()(authAxios, financierDispatch)
  }, [])

  // Show when No deals are available
  useEffect(() => {
    setNoDealsCurrently(deals?.length === 0 && !loading)
  }, [deals, loading])

  return financierState?.financier ? (
    <>
      {noDealsCurrently ? (
        <NoDealsInfo />
      ) : (
        <>
          <div className={styles.deals}>
            {deals.map((item, index) => {
              if (deals?.length === index + 1) {
                return <Deal className={styles.deal} key={item.id} innerRef={lastBookElementRef} deal={item} />
              } else {
                return <Deal className={styles.deal} key={item.id} deal={item} />
              }
            })}
          </div>
          <div>{loading && <LoadingIndicator />}</div>
          <div>{error && <Text>{error}</Text>}</div>
        </>
      )}
    </>
  ) : (
    <LoadingIndicator />
  )
}
