import React from 'react'
import { useNavigate } from 'react-router-dom'
import { DEALS_DUCK, ROUTES } from '../../core/actions'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import { currencyParser } from '../../utils/misc'
import IconWithLink from '../iconWithLink'
import Input from '../input'
import Text from '../text'
import * as styles from './Navbar.css'

export const Navbar = ({ selectedNav, setSelectedNav }) => {
  const { dealsDispatch } = useGlobalDispatch()
  const navigate = useNavigate()
  const {
    financierState: { financier },
  } = useGlobal()

  const searchDeals = val => {
    dealsDispatch({ type: DEALS_DUCK.SEARCH, payload: { query: val.trim().toString() } })
  }

  const navigateToDeposit = () => {
    setSelectedNav(1)
    navigate(ROUTES.DEPOSIT)
  }

  return (
    <div className={styles.navbar}>
      <IconWithLink icon='wallet-outline' text='Deposit' onClick={navigateToDeposit} textColor='#414141' />

      {selectedNav === 0 && (
        <Input
          className={styles.searchBar}
          textStyle={styles.searchBarStyle}
          placeholder='Search by Deal code ...'
          onChange={searchDeals}
        />
      )}

      <div className={styles.walletBalance}>
        <Text className={styles.walletBalanceLabel} size='0.9'>
          Wallet balance
        </Text>
        <Text size='1.2' bold number>
          {currencyParser(financier?.walletBalance)}
        </Text>
      </div>
    </div>
  )
}
