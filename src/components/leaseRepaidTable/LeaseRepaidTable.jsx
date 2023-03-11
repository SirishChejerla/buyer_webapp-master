import React, { useCallback, useEffect, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { REQUEST_STATUS } from '../../core/actions'
import { useAxios } from '../../core/AxiosContext'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import { fetchRepaidTableAction } from '../../routes/portfolio/PortfolioDuck'
import jsonParse from '../../utils/jsonapi'
import { currencyParser, customDateFormat } from '../../utils/misc'
import LoadingIndicator from '../loadingIndicator'
import Text from '../text'
import * as styles from './LeaseRepaidTable.css'

export const LeaseRepaidTable = ({ dealTransactionCode }) => {
  const [repaymentTable, setRepaymentTable] = useState([])
  const [nextPage, setNextPage] = useState()
  const [page, setPage] = useState(1)
  const {
    portfolioState: { repaidTableStatus },
  } = useGlobal()
  const { portfolioDispatch } = useGlobalDispatch()
  const { authAxios } = useAxios()

  const headers = [
    'Name',
    'Rental Amount',
    'Due Date',
    'Settlement Date',
    'Buyer Cashback',
    'Status',
    `TDS`,
    'Net Amount Repaid',
  ]

  const headerComponent = (
    <div className={styles.headerRow}>
      {headers?.map((header, index) => (
        <div key={index} className={styles.tableHeaderView}>
          <Text bold size='0.85' color='#757474'>
            {header}
          </Text>
        </div>
      ))}
    </div>
  )

  const RowComponent = ({ rental }) => (
    <div className={styles.headerRow}>
      <div className={styles.tableTextViewCenter}>
        <Text size='0.8'>{rental?.tranch_code.substring(dealTransactionCode.length)}</Text>
      </div>
      <div className={styles.tableTextViewCenter}>
        <Text size='0.8'>{currencyParser(rental?.amount)}</Text>
      </div>
      <div className={styles.tableTextViewRight}>
        <Text size='0.8'>{customDateFormat(rental?.repayment_date)}</Text>
      </div>
      <div className={styles.tableTextViewCenter}>
        <Text size='0.8'>
          {rental?.actual_settlement_date ? customDateFormat(rental.actual_settlement_date) : 'NA'}
        </Text>
      </div>
      <div className={styles.tableTextViewCenter}>
        <Text size='0.8'>{rental?.tc_buyer_cashback ? currencyParser(rental?.tc_buyer_cashback) : 'NA'}</Text>
      </div>
      <div className={styles.tableTextViewCenter}>
        <Text size='0.8' bold>
          {rental?.aasm_state === 'Repaid' ? 'Repaid' : 'Expected'}
        </Text>
      </div>
      <div className={styles.tableTextViewCenter}>
        <Text size='0.8'>{rental?.tds_amount ? currencyParser(rental?.tds_amount) : 'NA'}</Text>
      </div>
      <div className={styles.tableTextViewCenter}>
        <Text bold size='0.8'>
          {currencyParser(rental?.net_amount_to_buyer)}
        </Text>
      </div>
    </div>
  )

  const renderFooter = () => {
    if (repaidTableStatus === REQUEST_STATUS.PENDING) return <LoadingIndicator scale={0.5} />
    else if (nextPage) return null
    else
      return (
        <div className={styles.end}>
          <Text size='0.8'>End of Repayments.</Text>
        </div>
      )
  }

  const loadMore = useCallback(() => {
    setPage(nextPage)
  }, [nextPage])

  const onSuccess = data => {
    console.log(data)
    setRepaymentTable(prev => [...prev, ...jsonParse(data).data])
    setNextPage(data.meta.next)
  }

  useEffect(() => {
    page && fetchRepaidTableAction(dealTransactionCode, page)(authAxios, portfolioDispatch)(onSuccess)
  }, [dealTransactionCode, page, authAxios, portfolioDispatch])

  return (
    <div className={styles.repaymentTable}>
      {headerComponent}
      <Virtuoso
        data={repaymentTable}
        style={{ height: '55vh' }}
        itemContent={(index, rental) => <RowComponent key={index} rental={rental} />}
        components={{ Footer: renderFooter }}
        endReached={loadMore}
      />
    </div>
  )
}
