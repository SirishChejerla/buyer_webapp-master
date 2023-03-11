import React from 'react'
import { useGlobal } from '../../core/GlobalContext'
import { currencyParser } from '../../utils/misc'
import Text from '../text'
import * as styles from './ReferralDetailsInfo.css'

export const ReferralDetailsInfo = ({ index, year, months }) => {
  const {
    financierState: { referrals },
  } = useGlobal()

  return (
    <table className={styles.referralTable}>
      <tr>
        <th className={styles.tableCell}>
          <Text bold size='0.9' color='#757474' value='MONTH' />
        </th>
        <th className={styles.tableCell}>
          <Text bold size='0.9' color='#757474' value='AVG. OUTSTANDING' />
        </th>
        <th className={styles.tableCell}>
          <Text bold size='0.9' color='#757474' value='INCENTIVES EARNED' />
        </th>
      </tr>
      {months.map(month => {
        return (
          <tr key={month}>
            <td className={styles.tableCell}>
              <Text size='0.95' value={month} />
            </td>
            <td className={styles.tableCell}>
              <Text size='0.95' value={currencyParser(referrals[index][year][month]?.average_outstanding || 0)} />
            </td>
            <td className={styles.tableCell}>
              <Text size='0.95' value={currencyParser(referrals[index][year][month]?.incentive_earned || 0)} />
            </td>
          </tr>
        )
      })}
      <tr>
        <td className={styles.tableCell}>
          <Text size='0.98' bold value={year} />
        </td>
        <td></td>
        <td className={styles.tableCell}>
          <Text size='0.98' bold value={currencyParser(referrals[index][year]?.incentive_earned || 0)} />
        </td>
      </tr>
    </table>
  )
}
