import { DownOutlined } from '@ant-design/icons'
import { Button as AntdButton, Dropdown } from 'antd'
import React, { useState } from 'react'
import { camelToWords } from '../../utils/misc'
import Button from '../button'
import CardAttributes from '../cardAttributes'
import ChangeBankAccount from '../changeBankAccount'
import NomineeDetails from '../nomineeDetails'
import ReferralDetails from '../referralDetails'
import Text from '../text'
import * as styles from './ProfileDetails.css'

export const ProfileDetails = ({ financier }) => {
  const profileTitles = ['Authorized User', 'Escrow Account', 'Bank Account', 'Nominees', 'Referrals']
  const [activeProfile, setActiveProfile] = useState(0)
  const [showEditBank, setShowEditBank] = useState(false)
  const [addNominee, setAddNominee] = useState(false)
  const [selectedReferralYear, setSelectedReferralYear] = useState('FY22-23')
  const [selectedQuarter, setSelectedQuarter] = useState('Q1')

  const referralYearItems = [
    {
      label: 'FY22-23',
      key: '0',
    },
    {
      label: 'FY23-24',
      key: '1',
    },
  ]

  const handleReferralYearClick = e => {
    setSelectedReferralYear(referralYearItems.find(item => e.key === item.key).label)
  }

  const referralYearMenuProps = {
    items: referralYearItems,
    onClick: handleReferralYearClick,
  }

  const referralQuarterItems = [
    {
      label: 'Q1',
      key: '0',
    },
    {
      label: 'Q2',
      key: '1',
    },
    {
      label: 'Q3',
      key: '2',
    },
    {
      label: 'Q4',
      key: '3',
    },
  ]

  const handleReferralQuarterClick = e => {
    setSelectedQuarter(referralQuarterItems.find(item => e.key === item.key).label)
  }

  const referralQuarterMenuProps = {
    items: referralQuarterItems,
    onClick: handleReferralQuarterClick,
  }

  const handleEditBank = () => {
    setShowEditBank(val => !val)
  }

  const handleNominee = () => {
    setAddNominee(val => !val)
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileTitles}>
        {profileTitles.map((title, index) => {
          return (
            <div key={title}>
              <div className={styles.profileDivider} />
              <Button handleClick={() => setActiveProfile(index)} type='text' className={styles.profileTitleBtn}>
                <Text size='0.9' color={activeProfile === index && '#4786E9'} className={styles.profileTitle}>
                  {title}
                </Text>
              </Button>
            </div>
          )
        })}
        <div className={styles.profileDivider} />
      </div>

      <div className={styles.profileDetails}>
        {activeProfile === 0 && (
          <div className={styles.profileCard}>
            <Text size='1.2' color='#2C3E50' bold>
              Authorized User
            </Text>
            {Object.entries(financier?.authorizedUser)?.map(entry => {
              return <CardAttributes key={entry[0]} name={camelToWords(entry[0])} value={entry[1]}></CardAttributes>
            })}
          </div>
        )}

        {activeProfile === 1 && (
          <div className={styles.profileCard}>
            <Text size='1.2' color='#2C3E50' bold>
              Escrow Account (TradeCred Wallet)
            </Text>
            {Object.entries(financier?.escrow)?.map(entry => {
              return <CardAttributes key={entry[0]} name={camelToWords(entry[0])} value={entry[1]}></CardAttributes>
            })}
          </div>
        )}

        {activeProfile === 2 && (
          <div className={styles.profileCard}>
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <Text size='1.2' color='#2C3E50' bold>
                  Bank Account
                </Text>
                <Text size='0.8' color='#838e9f'>
                  Withdrawals from wallet are credited into this account
                </Text>
              </div>
              <Button handleClick={handleEditBank} type='text'>
                {showEditBank ? 'Cancel' : financier?.financierBank?.id ? 'Edit Account' : 'Add Account'}
              </Button>
            </div>
            {showEditBank ? (
              <ChangeBankAccount />
            ) : financier?.financierBank?.id ? (
              Object.entries(financier?.financierBank)?.map(entry => {
                return <CardAttributes key={entry[0]} name={camelToWords(entry[0])} value={entry[1]}></CardAttributes>
              })
            ) : (
              <div>
                <Text>Add your bank account to process withdrawals from wallet</Text>
              </div>
            )}
          </div>
        )}

        {activeProfile === 3 && (
          <div className={styles.profileCard}>
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <Text size='1.2' color='#2C3E50' bold>
                  Nominee Details
                </Text>
                <Text size='0.8' color='#838e9f'>
                  Nominees for your TradeCred account are as follows
                </Text>
              </div>
              <Button handleClick={handleNominee} type='text'>
                {addNominee ? 'Cancel' : 'Add Nominee'}
              </Button>
            </div>
            <NomineeDetails addNominee={addNominee} setAddNominee={setAddNominee} />
          </div>
        )}

        {activeProfile === 4 && (
          <div className={styles.profileCard}>
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <Text size='1.2' color='#2C3E50' bold>
                  Referrals
                </Text>
                <Text size='0.8' color='#838e9f'>
                  Users who have used your referral code while signing up
                </Text>
              </div>
              <div className={styles.referralDropDowns}>
                <Dropdown menu={referralQuarterMenuProps}>
                  <AntdButton>
                    {selectedQuarter}
                    <DownOutlined />
                  </AntdButton>
                </Dropdown>
                <Dropdown menu={referralYearMenuProps}>
                  <AntdButton>
                    {selectedReferralYear}
                    <DownOutlined />
                  </AntdButton>
                </Dropdown>
              </div>
            </div>
            <ReferralDetails selectedYear={selectedReferralYear} selectedQuarter={selectedQuarter} />
          </div>
        )}
      </div>
    </div>
  )
}
