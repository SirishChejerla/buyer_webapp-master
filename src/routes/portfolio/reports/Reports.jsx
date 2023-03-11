import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/button'
import Input from '../../../components/input'
import Text from '../../../components/text'
import { REQUEST_STATUS, ROUTES } from '../../../core/actions'
import { useAxios } from '../../../core/AxiosContext'
import { useGlobal, useGlobalDispatch } from '../../../core/GlobalContext'
import {
  fetchEarningsReportUrlAction,
  fetchMisReportUrlAction,
  fetchOutstandingsReportUrlAction,
} from '../../financier/FinancierDuck'
import * as styles from './Reports.css'

export const Reports = () => {
  const {
    financierState: { financier, misReportStatus, earningsReportStatus, outstandingsReportStatus },
  } = useGlobal()
  const { financierDispatch } = useGlobalDispatch()
  const { authAxios } = useAxios()
  const [outstandingsDate, setOutstandingsDate] = useState()

  const navigate = useNavigate()
  const handleBackIconPress = () => navigate(ROUTES.FINANCIER)

  const openInNewTab = link => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const handleMISClick = () =>
    fetchMisReportUrlAction(financier?.financierPAN)(authAxios, financierDispatch)(misUrl => openInNewTab(misUrl))

  const handleEarningsReport = () =>
    fetchEarningsReportUrlAction(financier?.financierPAN)(authAxios, financierDispatch)(earningsUrl =>
      openInNewTab(earningsUrl)
    )

  const handleOutstandingsReport = () =>
    fetchOutstandingsReportUrlAction(financier?.financierPAN, outstandingsDate)(authAxios, financierDispatch)(
      outstandingsUrl => openInNewTab(outstandingsUrl)
    )

  return (
    <div className={styles.reports}>
      <div className={styles.headerText}>
        <Button handleClick={handleBackIconPress} type='icon'>
          <ion-icon name={'arrow-back'} />
        </Button>
        <Text size='1.3' bold>
          Reports
        </Text>
      </div>
      <div className={styles.downloadList}>
        <div className={styles.report}>
          {/* TODO Handle Case where MBA is not signed and allow for signing */}
          <div className={styles.downloadText}>
            <Text size='1.05'>MBA — Master Buy Agreement</Text>
            <Text size='0.85' color='#838e9f'>
              Your signed MBA
            </Text>
          </div>
          <Button type='text' label='View' handleClick={() => openInNewTab(financier?.mba?.url)}></Button>
        </div>
        <div className={styles.report}>
          <div className={styles.downloadText}>
            <Text size='1.05'>Latest MIS Report</Text>
            <Text size='0.85' color='#838e9f'>
              consists of Wallet transaction ledger, collection details and GST Invoices
            </Text>
          </div>
          <Button
            type='text'
            label={misReportStatus === REQUEST_STATUS.PENDING ? 'Generating' : 'Download'}
            handleClick={handleMISClick}
            disabled={misReportStatus === REQUEST_STATUS.PENDING}
          />
        </div>
        <div className={styles.report}>
          <div className={styles.reportBody}>
            <div className={styles.downloadText}>
              <Text size='1.05'>Earnings Statement</Text>
              <Text size='0.85' color='#838e9f'>
                consists of your earnings for every financial year
              </Text>
            </div>
            <div className={styles.info}>
              <ion-icon name='information-circle-outline'></ion-icon>
              <Text size='0.8' color='#999999'>
                Earnings Statement will be updated on the 1st day of every financial quarter.
              </Text>
            </div>
          </div>
          <Button
            type='text'
            label={earningsReportStatus === REQUEST_STATUS.PENDING ? 'Generating' : 'Download'}
            handleClick={handleEarningsReport}
            disabled={earningsReportStatus === REQUEST_STATUS.PENDING}
          />
        </div>
        <div className={styles.report}>
          <div className={styles.reportBody}>
            <div className={styles.downloadText}>
              <Text size='1.05'>Outstandings Report</Text>
              <Text size='0.85' color='#838e9f'>
                to view outstanding txns. until
              </Text>
            </div>
            <Input
              value={outstandingsDate}
              type='date'
              name='outstandingsDate'
              onChange={val => setOutstandingsDate(val)}
            />
          </div>
          <Button
            type='text'
            label={outstandingsReportStatus === REQUEST_STATUS.PENDING ? 'Generating' : 'Download'}
            handleClick={handleOutstandingsReport}
            disabled={outstandingsReportStatus === REQUEST_STATUS.PENDING}
          />
        </div>
      </div>
    </div>
  )
}
