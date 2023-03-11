import { Modal } from 'antd'
import React, { useState } from 'react'
import DealFooterAttribute from '../dealFooterAttribute'
import KeyRisk from '../keyRisk'
import LeaseRepaymentTable from '../leaseRepaymentTable'
import PdfViewer from '../pdfViewer'
import RepaymentTable from '../repaymentTable'
import * as styles from './DealFooter.css'

export const DealFooter = ({ footer, showSummary, setShowSummary, purchaseAmount }) => {
  // Contains type from Footer parser
  const [modalType, setModalType] = useState()

  return (
    <>
      <div className={styles.dealFooter}>
        {footer?.map(({ type, title, val }) => (
          <DealFooterAttribute
            key={type}
            type={type}
            title={title}
            val={val}
            showSummary={showSummary}
            setModalType={setModalType}
            setShowSummary={setShowSummary}
          />
        ))}
      </div>
      {modalType ? (
        <Modal
          title={modalType.title}
          open={modalType}
          onCancel={() => setModalType()}
          footer={null}
          // TODO Alter Width to be responsive
          width={'50vw'}
          bodyStyle={{ maxHeight: '80vh', overflowY: 'scroll', padding: '1rem 1.5rem' }}>
          {modalType.type === 'risks' ? (
            <KeyRisk />
          ) : modalType.type === 'dealReport' || modalType.type === 'debtTerms' ? (
            <PdfViewer reportUrl={modalType.val} title={modalType.title} closeModal={() => setModalType()} />
          ) : modalType.type === 'repaymentTable' ? (
            // purchaseAmount passed will overwrite any values parsed down from Parsers, used in case of multiple Debt Deal Lots
            <RepaymentTable {...modalType.val} purchaseAmount={purchaseAmount?.replace(/,/g, '')} />
          ) : modalType.type === 'leaseRepaymentTable' ? (
            <LeaseRepaymentTable deal={modalType.val} purchaseAmount={purchaseAmount?.replace(/,/g, '')} />
          ) : null}
        </Modal>
      ) : null}
    </>
  )
}
