import React from 'react'
import { TRADECRED_SUPPORT_EMAIL, TRADECRED_SUPPORT_PHONE } from '../../core/constants'
import Text from '../text'
import * as styles from './Footer.css'

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerText}>
        <div className={styles.footerAddress}>
          <Text color='#1d1d1f' size='0.81' value='Address' />
          <Text color='#6e6e73' size='0.8' value='Unit 703/704, 7th Floor, Midas Building,' />
          <Text color='#6e6e73' size='0.8' value='Sahar Plaza, Andheri Kurla Road,' />
          <Text color='#6e6e73' size='0.8' value='Andheri(E), Mumbai - 400059' />
        </div>
        <div className={styles.footerAddress}>
          <Text color='#1d1d1f' size='0.81' value='Legal' />
          <a href='https://www.tradecred.com/Privacy_Policy.html' target='_blank' rel='noreferrer'>
            <Text color='#6e6e73' size='0.8' value='Privacy Policy' />
          </a>
          <a href='https://www.tradecred.com/Terms_And_Conditions.html' target='_blank' rel='noreferrer'>
            <Text color='#6e6e73' size='0.8' value='Terms & Conditions' />
          </a>
          <a href='https://www.tradecred.com/Refund_And_Cancellation.html' target='_blank' rel='noreferrer'>
            <Text color='#6e6e73' size='0.8' value='Refund & Cancellation Policy' />
          </a>
        </div>
      </div>
      <div className={styles.footerText}>
        <div className={styles.footerAddress}>
          <Text color='#1d1d1f' size='0.81' value='Contact' />
          <Text color='#6e6e73' size='0.8' value={'Email — ' + TRADECRED_SUPPORT_EMAIL} />
          <Text color='#6e6e73' size='0.8' value={'or Call — ' + TRADECRED_SUPPORT_PHONE} />
        </div>
      </div>

      <div className={styles.footerDivider}></div>
      <div className={styles.footerTextBottom}>
        <Text color='#6e6e73' size='0.8' value='Copyright ©2022 TradeCred. All rights reserved.' />
        <Text color='#6e6e73' size='0.8' value='Mumbai, India' />
      </div>
    </div>
  )
}
