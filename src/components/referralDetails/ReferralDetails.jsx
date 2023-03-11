import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAxios } from '../../core/AxiosContext'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import { referralDetailsAction } from '../../routes/financier/FinancierDuck'
import { currencyParser, customDateFormat } from '../../utils/misc'
import ReferralDetailsInfo from '../referralDetailsInfo'
import Text from '../text'
import * as styles from './ReferralDetails.css'

export const ReferralDetails = ({ selectedQuarter, selectedYear }) => {
  const [selectedReferralIndex, setSelectedReferralIndex] = useState(null)
  const { authAxios } = useAxios()
  const {
    financierState: { financier, referrals },
  } = useGlobal()
  const { financierDispatch } = useGlobalDispatch()
  const quarterReference = {
    Q1: {
      months: ['Jan', 'Feb', 'Mar'],
      days: [31, 28, 31],
    },
    Q2: {
      months: ['Apr', 'May', 'Jun'],
      days: [30, 31, 30],
    },
    Q3: {
      months: ['Jul', 'Aug', 'Sep'],
      days: [31, 31, 30],
    },
    Q4: {
      months: ['Oct', 'Nov', 'Dec'],
      days: [31, 30, 31],
    },
  }

  useEffect(() => {
    referralDetailsAction(financier?.financierPAN)(authAxios, financierDispatch)
  }, [])

  const ReferralRow = ({ key, referral, index }) => (
    <tr className={styles.referralRow} key={key} onClick={() => setSelectedReferralIndex(index)}>
      <td>
        <Text size='0.95'>{referral?.name}</Text>
      </td>
      <td>
        <Text size='0.95'>{referral?.phone}</Text>
      </td>
      <td>
        <Text size='0.95'>{customDateFormat(referral?.onboarded_at, 'short')}</Text>
      </td>
      <td>
        <Text size='0.95'>
          {/* Sum of (Outstanding of a month * Days in that month) in a quarter / Sum of days in the quarter */}
          {currencyParser(
            (referral[selectedYear][quarterReference[selectedQuarter].months[0]].average_outstanding *
              quarterReference[selectedQuarter].days[0] +
              referral[selectedYear][quarterReference[selectedQuarter].months[1]].average_outstanding *
                quarterReference[selectedQuarter].days[1] +
              referral[selectedYear][quarterReference[selectedQuarter].months[2]].average_outstanding *
                quarterReference[selectedQuarter].days[2]) /
              quarterReference[selectedQuarter].days.reduce((partial, acc) => partial + acc, 0)
          )}
        </Text>
      </td>
      <td>
        <Text size='0.95'>
          {currencyParser(
            referral[selectedYear][quarterReference[selectedQuarter].months[0]].incentive_earned +
              referral[selectedYear][quarterReference[selectedQuarter].months[1]].incentive_earned +
              referral[selectedYear][quarterReference[selectedQuarter].months[2]].incentive_earned
          )}
        </Text>
      </td>
    </tr>
  )

  return (
    <div>
      {referrals.length > 0 ? (
        <table className={styles.referralTable}>
          <colgroup>
            <col width='16%' />
            <col width='16%' />
            <col width='16%' />
            <col width='26%' />
            <col width='26%' />
          </colgroup>
          <thead>
            <tr>
              <th>
                <Text bold size='0.9' color='#757474' value='NAME' />
              </th>
              <th>
                <Text bold size='0.9' color='#757474' value='PHONE' />
              </th>
              <th>
                <Text bold size='0.9' color='#757474' value='ONBOARDED' />
              </th>
              <th>
                <Text bold size='0.9' color='#757474' value='AVG. OUTSTANDING' />
              </th>
              <th>
                <Text bold size='0.9' color='#757474' value='INCENTIVES EARNED' />
              </th>
            </tr>
          </thead>
          <tbody>
            {referrals?.map((referral, index) =>
              referral[selectedYear] ? <ReferralRow key={referral.pan} referral={referral} index={index} /> : <></>
            )}
          </tbody>
        </table>
      ) : (
        <Text color='#808080'>
          No referrals found. Share your referral code to your friends and earn incentives once they start investing.
        </Text>
      )}
      {Number.isInteger(selectedReferralIndex) && (
        <Modal
          title={`Incentives split-up for ${selectedYear} — ${referrals[selectedReferralIndex]?.name}`}
          open={Number.isInteger(selectedReferralIndex)}
          onCancel={() => setSelectedReferralIndex(null)}
          footer={null}
          width={'65vw'}
          bodyStyle={{ maxHeight: '80vh', overflowY: 'scroll', padding: '2rem 1.5rem' }}>
          <ReferralDetailsInfo
            index={selectedReferralIndex}
            year={selectedYear}
            months={quarterReference[selectedQuarter].months}
          />
        </Modal>
      )}
    </div>
  )
}
