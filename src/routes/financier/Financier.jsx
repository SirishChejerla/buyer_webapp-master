import { message as Toast } from 'antd'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/button'
import MasterBuyAgreement from '../../components/masterBuyAgreementHighlight'
import ProfileDetails from '../../components/profileDetails'
import Text from '../../components/text'
import { ROUTES } from '../../core/actions'
import { useAxios } from '../../core/AxiosContext'
import { BUYER_LINK } from '../../core/constants'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import * as styles from './Financier.css'
import { fetchFinancierAction } from './FinancierDuck'

export const Financier = () => {
  const { authAxios } = useAxios()
  const {
    financierState: { financier },
  } = useGlobal()
  const { financierDispatch } = useGlobalDispatch()

  const handleCopyReferral = () => {
    Toast.info(`Copied your referral code to clipboard`)
    navigator.clipboard.writeText(
      `Hey, Use my referral code to invest in TradeCred and earn 12% + extra 1% returns\nhttps://${BUYER_LINK}/register/${financier?.referralCode}`
    )
  }

  useEffect(() => {
    fetchFinancierAction()(authAxios, financierDispatch)
  }, [])

  return (
    <div className={styles.financier}>
      <div>
        <div className={styles.header}>
          <Text size='1.3' color='#2C3E50' bold>
            {financier?.financierName}
          </Text>
          <Text size='1.1' color='#566573' bold>
            {financier?.financierPAN}
          </Text>
        </div>

        <div className={styles.referralCode}>
          <Text size='0.82' color='#808B96' bold>
            {'Referral Code'.toUpperCase()}
          </Text>
          <div className={styles.referralCodeInner}>
            <Text size='0.95'>{financier?.referralCode}</Text>
            <Button type='icon' handleClick={handleCopyReferral}>
              <ion-icon name='copy-outline' />
            </Button>
          </div>
        </div>

        {!financier?.mba?.hasMBA && <MasterBuyAgreement />}
      </div>

      <div className={styles.divider} />

      {financier && <ProfileDetails financier={financier} />}

      <div className={styles.divider} />

      <div className={styles.faq}>
        <Text size='1.2' color='#2C3E50' bold>
          Frequently Asked Questions
        </Text>
        <Link to={ROUTES.FAQ}>See FAQs</Link>
      </div>
    </div>
  )
}
