import React, { useEffect, useState } from 'react'
import useTranches from '../../customhooks/useTranches'
import { currencyParser, durationToDateParser } from '../../utils/misc'
import Text from '../text'
import * as styles from './LeaseRepaymentTable.css'

export const LeaseRepaymentTable = ({ deal, purchaseAmount }) => {
  const [repaymentTable, setRepaymentTable] = useState([])
  const tranchesCalc = useTranches(purchaseAmount?.replace(/,/g, ''), deal)
  const headers = ['Name', 'Due Date', 'Rental Amount', `TDS (${deal?.tdsPercentage * 100} %)`, 'Net Amount']

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

  const rowComponent = repaymentTable?.map((rental, index) => (
    <div key={index} className={styles.headerRow}>
      <div className={styles.tableTextViewCenter}>
        <Text size='0.8'>{rental?.name}</Text>
      </div>
      <div className={styles.tableTextViewRight}>
        <Text size='0.8'>{rental?.dueDate}</Text>
      </div>
      <div className={styles.tableTextViewRight}>
        <Text size='0.8'>{currencyParser(rental?.rentalAmount)}</Text>
      </div>
      <div className={styles.tableTextViewRight}>
        <Text size='0.8'>{currencyParser(rental?.tds)}</Text>
      </div>
      <div className={styles.tableTextViewRight}>
        <Text bold size='0.8'>
          {currencyParser(rental?.netAmount)}
        </Text>
      </div>
    </div>
  ))

  useEffect(() => {
    if (tranchesCalc?.tranchValue) {
      for (let i = 0; i < deal?.totalNumberOfRentals; i++) {
        setRepaymentTable(repaymentTable => [
          ...repaymentTable,
          {
            name: `Rental Payment ${i + 1}`,
            dueDate: durationToDateParser(deal?.rentalStartDuration + deal?.rentalFrequency * i),
            rentalAmount: tranchesCalc?.tranchValue,
            tds: tranchesCalc?.tdsAmount,
            netAmount: tranchesCalc?.tranchValue - tranchesCalc?.tdsAmount,
          },
        ])
      }
      setRepaymentTable(repaymentTable => [
        ...repaymentTable,
        {
          name: `Residual Value`,
          dueDate: durationToDateParser(
            deal?.rentalStartDuration + deal?.rentalFrequency * deal?.totalNumberOfRentals - 1
          ),
          rentalAmount: tranchesCalc?.residualValue,
          tds: '',
          netAmount: tranchesCalc?.residualValue,
        },
      ])
      setRepaymentTable(repaymentTable => [
        ...repaymentTable,
        {
          name: `TOTAL`,
          dueDate: '',
          rentalAmount: repaymentTable?.reduce((acc, { rentalAmount }) => acc + rentalAmount, 0),
          tds: repaymentTable?.reduce((acc, { tds }) => acc + tds, 0),
          netAmount: repaymentTable?.reduce((acc, { netAmount }) => acc + netAmount, 0),
        },
      ])
    }
  }, [deal, tranchesCalc])

  return (
    <div className={styles.repaymentTable}>
      {headerComponent}
      {rowComponent}
    </div>
  )
}
