import React, { useEffect, useState } from 'react'
import { WITHDRAWAL_REASONS_KEY, WITHDRAWAL_REASON_DAY_KEY } from '../../core/constants'
import Chip from '../chip'
import Input from '../input'
import Text from '../text'
import * as styles from './WithdrawalReasons.css'

const withdrawalReasons = [
  'Looking for Short Term Deals',
  'Looking for Long Term Deals',
  'Looking for Small Ticket size deals',
  'Having issues with platform',
  'Investing with another platform',
  'We can discuss over call',
]

export const WithdrawalReasons = ({ setWithdrawalReason }) => {
  const [shuffledReasons, setShuffledReasons] = useState([])
  const [selectedChipIndex, setSelectedChipIndex] = useState()

  const currentDay = String(new Date().getDate())

  const shuffleReasons = async () => {
    const storedDay = await localStorage.getItem(WITHDRAWAL_REASON_DAY_KEY)
    let shuffled = await localStorage.getItem(WITHDRAWAL_REASONS_KEY)
    shuffled = shuffled?.split(',')
    if (storedDay != currentDay) {
      shuffled = withdrawalReasons.sort(() => 0.5 - Math.random())

      await localStorage.setItem(WITHDRAWAL_REASONS_KEY, shuffled.toString())
      await localStorage.setItem(WITHDRAWAL_REASON_DAY_KEY, currentDay)
    }
    setShuffledReasons(shuffled)
  }

  useEffect(() => {
    // Append others at the end
    if (!shuffledReasons.includes('Others')) {
      setShuffledReasons(reasons => {
        reasons.push('Others')
        return reasons
      })
    }
  }, [shuffledReasons])

  useEffect(() => {
    setWithdrawalReason(
      shuffledReasons[selectedChipIndex] === 'Others' ? undefined : shuffledReasons[selectedChipIndex]
    )
  }, [selectedChipIndex, shuffledReasons, setWithdrawalReason])

  useEffect(() => {
    shuffleReasons()
  }, [])

  return (
    <div className={styles.withdrawalReasons}>
      <Text>My reason for withdrawal</Text>
      <Text size='0.8' color='#838e9f'>
        Kindly choose a reason, so we can understand your needs better
      </Text>
      <div className={styles.shuffledReasons}>
        {shuffledReasons.map((reason, index) => (
          <Chip
            key={index}
            selected={selectedChipIndex === index}
            handleClick={() => {
              setSelectedChipIndex(index)
            }}>
            <Text size='0.85'>{reason}</Text>
          </Chip>
        ))}
      </div>
      {shuffledReasons[selectedChipIndex] === 'Others' ? (
        <Input placeholder={'Enter reason'} onChange={val => setWithdrawalReason(val)} />
      ) : null}
    </div>
  )
}
