import React, { useCallback, useEffect, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { REQUEST_STATUS } from '../../core/actions'
import { useAxios } from '../../core/AxiosContext'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import { fetchRepaymentTableAction } from '../../routes/deals/ConfirmationOfSigningDuck'
import jsonParse from '../../utils/jsonapi'
import { currencyParser, customDateFormat } from '../../utils/misc'
import LoadingIndicator from '../loadingIndicator'
import Text from '../text'
import * as styles from './RepaymentTable.css'

export const RepaymentTable = ({ purchaseAmount, dealCode }) => {
  const { confirmationOfSigningState } = useGlobal()
  const { confirmationOfSigningDispatch } = useGlobalDispatch()
  const { authAxios } = useAxios()

  const [repaymentTable, setRepaymentTable] = useState([])
  const [nextPage, setNextPage] = useState()
  const [page, setPage] = useState(1)

  const onSuccess = data => {
    setRepaymentTable(prev => [...prev, ...jsonParse(data).data])
    setNextPage(data.meta.next)
  }

  useEffect(() => {
    page &&
      fetchRepaymentTableAction(dealCode, page, purchaseAmount)(authAxios, confirmationOfSigningDispatch)(onSuccess)
  }, [purchaseAmount, dealCode, authAxios, confirmationOfSigningDispatch, page])

  const loadMore = useCallback(() => {
    setPage(nextPage)
  }, [nextPage])

  const headerComponent = (
    <div className={styles.headerRow}>
      <div className={styles.tableTextView}>
        <Text bold size='0.85' color='#757474'>
          Repayment Date
        </Text>
      </div>
      <div className={styles.tableTextView}>
        <Text bold size='0.85' color='#757474'>
          Principal amount
        </Text>
      </div>
      <div className={styles.tableTextView}>
        <Text bold size='0.85' color='#757474'>
          Interest amount
        </Text>
      </div>
      <div className={styles.tableTextView}>
        <Text bold size='0.85' color='#757474'>
          Repayment status
        </Text>
      </div>
    </div>
  )

  const RepaymentRow = ({
    repayment_item: { repayment_date, principal_amount, interest_amount, aasm_state },
    index,
  }) => (
    <div className={index % 2 === 0 ? styles.headerRowEven : styles.headerRow}>
      <div className={styles.tableTextView}>
        <Text size='0.9' number>
          {customDateFormat(repayment_date, 'short')}
        </Text>
      </div>
      <div className={styles.tableTextView}>
        <Text size='0.9' number>
          {currencyParser(principal_amount)}
        </Text>
      </div>
      <div className={styles.tableTextView}>
        <Text size='0.9' number>
          {currencyParser(interest_amount)}
        </Text>
      </div>
      <div className={styles.tableTextView}>
        <Text size='0.85'>{aasm_state === 'repaid' ? 'Repaid' : 'Expected'}</Text>
      </div>
    </div>
  )

  const renderFooter = () => {
    if (confirmationOfSigningState?.loadingRepayments === REQUEST_STATUS.PENDING)
      return <LoadingIndicator scale={0.5} />
    else if (nextPage) return null
    else
      return (
        <div className={styles.end}>
          <Text size='0.8'>End of Repayments.</Text>
        </div>
      )
  }

  return (
    <div className={styles.repaymentTable}>
      {headerComponent}
      <Virtuoso
        data={repaymentTable}
        style={{ height: '55vh' }}
        itemContent={(index, item) => <RepaymentRow key={index} repayment_item={item} index={index} />}
        components={{ Footer: renderFooter }}
        endReached={loadMore}
      />
    </div>
  )
}
