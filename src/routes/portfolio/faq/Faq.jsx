import { Collapse } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/button'
import Text from '../../../components/text'
import { ROUTES } from '../../../core/actions'
import { useAuth } from '../../../core/AuthContext'
import {
  BUYER_LINK,
  COMPANY_NAME,
  DBS_BACKEND_API_URL,
  ICICI_BACKEND_API_URL,
  IDFC_BACKEND_API_URL,
  isTradecred,
  TRADECRED_SUPPORT_EMAIL,
} from '../../../core/constants'
import * as styles from './Faq.css'
const { Panel } = Collapse

export const Faq = () => {
  let host = ''
  const {
    authState: { baseUrl },
  } = useAuth()
  switch (baseUrl) {
    case ICICI_BACKEND_API_URL:
      host = 'ICICI'
      break
    case IDFC_BACKEND_API_URL:
      host = 'IDFC'
      break
    case DBS_BACKEND_API_URL:
      host = 'DBS'
      break
    default:
      break
  }
  const BANK_NAME = host === 'ICICI' ? 'ICICI' : host === 'IDFC' ? 'IDFC' : 'DBS'
  const IFSC_CODE = host === 'ICICI' ? 'ICIC0000106' : host === 'IDFC' ? 'IDFB0040101' : 'DBSS0IN0811'
  const BRANCH_NAME = host === 'ICICI' ? 'RPC Delhi' : host === 'IDFC' ? 'BKC - Naman Chambers' : 'Mumbai'

  const GeneralQueries = [
    {
      key: 1,
      query: `How to register as a Buyer on ${COMPANY_NAME}?`,
      answer: `To register as a Buyer:<br/> a) Go to ${TRADECRED_SUPPORT_EMAIL} or open the mobile application;<br/> b) Click on Register;<br/> c) Choose the buyer type (Individual/HUF/Partnership Firm/LLP/Private/ Public Limited Company / NBFC / Bank/NRI<br/> d) Fill all the details of the buyer as asked on the page. Also, upload necessary documents as per the requirement<br/> e) Once everything is done, click on submit.<br/><br/> After the request has been received by us, KYC verification and registration process shall be completed within 24 working hours, if all the documents submitted are correct.<br/><br/> A welcome mail will be received by the applicant on registered email address.<br/> `,
    },
    {
      key: 2,
      query: `What is the difference between masked EAadhaar & unmasked EAadhaar?`,
      answer: `Masked Aadhaar Card only shows the last 4 digits of the Aadhaar number instead of the 12 digits in the regular one whereas Unmasked Aadhaar card shows all the 12 digits of your Aadhaar card.<br/> E.g.: Unmasked Aadhaar No.: 1234 5678 9012; Masked Aadhaar No.: XXXX XXXX 9012.<br/>`,
    },
    {
      key: 3,
      query: `What is a Buyer Escrow account?`,
      answer: `It is a virtual account which is linked to the Buyer and can be used to add funds to the wallet.<br/>`,
    },
    {
      key: 4,
      query: `What is a Master Buy Agreement?`,
      answer: `Master Buy Agreement is an agreement which mentions all terms and conditions for a Buyer as well as Seller to transact on the ${COMPANY_NAME} platform. A Buyer cannot transact on the ${COMPANY_NAME} platform without signing the Master Buy Agreement.<br/> `,
    },
    {
      key: 5,
      query: `How to sign a Master Buy Agreement?`,
      answer: `The Master Buy Agreement can be signed in following manner: Through website:<br/> Login to ${TRADECRED_SUPPORT_EMAIL};<br/> Go to Dashboard<br/> Click on “Sign master buy agreement”<br/>${
        isTradecred
          ? `<br/> Through mobile application:<br/> Login to the mobile application;<br/> Go to Profile;<br/> Press on Sign button besides Master Buy Agreement under the Documents section.<br/>`
          : ``
      } `,
    },
    {
      key: 6,
      query: `How do I check my transaction history?`,
      answer:
        'To check your transactions and their current status, log into to your account, go to `Order History`. There you can find the status for the following:-<br/> a) Ongoing Deals<br/> b) Deals requested for liquidation<br/> c) Liquidated deals<br/> d) Completed deals<br/>',
    },
    {
      key: 7,
      query: `What is the duration of a deal? Is there a lock-in period for the deals? Can they be withdrawn anytime?`,
      answer: `The duration of the deal is varies from 30 days to 90 days. The Buyer’s monies are locked-in for such duration. However on certain deals Buyers have the option to withdraw their monies by liquidating their deals (selling to other Buyers on ${COMPANY_NAME}).<br/>`,
    },
    {
      key: 8,
      query: `When does the dashboard get updated after purchasing a deal?`,
      answer: `Dashboard gets updated in maximum 24 working hours after a deal is purchased.<br/>`,
    },
  ]

  const WalletQueries = [
    {
      key: 9,
      query: `How to transfer monies to a Buyer's Escrow Account? How much time does it take to reflect the monies transferred to Buyer's Escrow Account?`,
      answer: `For adding the money to your wallet, Buyer has to add the escrow account (mentioned in the welcome mail) as a beneficiary in their bank accounts. The same shall be in following format:<br/><br/> Bank Account : 10051800xxxx<br/> Bank Account Holder Name: (Your Name)<br/> Bank Name: ${BANK_NAME} Bank<br/> IFSC Code: ${IFSC_CODE}<br/> Branch: ${BRANCH_NAME}<br/><br/> While adding as a beneficiary, kindly note:<br/> *Add the escrow account as 'Other Bank Beneficiary' (Even if the Buyer's bank account is with ${BANK_NAME} bank, add the escrow account as 'Other Bank Beneficiary' only)<br/><br/> *The account type shall be 'Current Account'<br/><br/> *Please do not use IMPS.<br/><br/> It takes upto 24 working hours to reflect the monies transferred in the Buyer's Escrow Account.<br/> `,
    },
    {
      key: 10,
      query: `How to withdraw monies from a Buyer's Escrow Account? How much time does it to reflect the monies withdrawn to Buyer's bank account?`,
      answer: `Buyer can withdraw the monies by pressing the 'Withdraw' button in the 'Overview' section in the mobile application or in the 'Dashboard' section in the web. In case you have not added your bank account details, you need to add the same first.<br/> (It may take upto 24 working hours to reflect the monies withdrawn from the Buyer's Escrow Account in the Buyer's bank account.)<br/> *Second Saturday/Fourth Saturday/Sunday being bank holidays, monies withdrawn shall hit your bank account on Monday and in case of any other Bank holiday, the next working day.<br/>`,
    },
    {
      key: 11,
      query: `Can monies be transferred to the Buyer Escrow Account (wallet) from any bank account other than registered bank account?`,
      answer: `There are no restrictions on the bank account used to transfer monies into the Buyer Escrow Account (wallet).<br/>`,
    },
    {
      key: 12,
      query: `Can the monies be withdrawn to any bank account other than registered bank account?`,
      answer: `No. Monies on account of wallet withdrawal shall be transferred to registered bank account only. Also, if the bank details updated on the platform do not belong to the buyer, the system shall fail to process the same.<br/>`,
    },
  ]

  const DealQueries = [
    {
      key: 13,
      query: `How to purchase a deal?`,
      answer: `To purchase a deal, please follow the following steps:-<br/> Through website:<br/> a) Login to ${BUYER_LINK}<br/> b) Go to “Current Deals”.<br/> c) Available deals shall be visible on this page. Choose a deal, enter the amount and click on “Buy Deal” tab.<br/> d) Input the OTP sent to the registered email id in the transaction window and click on “Proceed to Sign”;<br/> e) The draft Confirmation of Purchase (CoP) shall be generated. Click on “Proceed” after perusing the draft CoP;<br/> f) Input the Aadhaar number of the Buyer (Authorised User) on the NSDL E-Sign page and click on “Send OTP”;<br/> g) An OTP shall be sent to your Aadhaar registered mobile number. Input the OTP and click on “Verify OTP”. The deal shall be purchased.<br/><br/> ${
        isTradecred
          ? `Through Mobile App:<br/> a) Login to ${COMPANY_NAME} App;<br/> b) Go to “Deals”;<br/> c) Available deals shall be visible on this page. Choose a deal, enter the amount and click on “Buy Now” tab;<br/> d) Input the OTP sent on your Aadhaar registered mobile number. The deal shall be purchased.<br/>`
          : ``
      }`,
    },
    {
      key: 14,
      query: `How are the earnings calculated?`,
      answer: `For calculations, please use this formula :-<br/> Fv = Pv(1+r)^n<br/> where,<br/> Fv = Future Value<br/> Pv = Present Value<br/> r = Net IRR per annum (as per the mail received on deal purchase)<br/> n = tenure (tenure is Number of days/365)<br/> `,
    },
    {
      key: 15,
      query: `What is an Effective Date/ Deal Date?`,
      answer: `An Effective Date/ Deal Date is an actual deal purchase date from which the earnings meter of the Buyer starts. This date changes every day after 5:00 p.m.<br/> Any deal purchased after 5:00 p.m. on Saturday shall have the deal date of coming Monday.<br/> E.g.: Any deal purchased after 5:00 p.m. on T shall have T+1 as the deal date.<br/> `,
    },
    {
      key: 16,
      query: `Will the Customer repay the monies directly to the Seller Escrow Account or will it be received by Seller who shall then make the repayment?`,
      answer: `The Customer will repay directly to the Seller Escrow Account from where the amount deals shall be repaid and funds shall be transferred to Buyer Escrow Account.<br/>`,
    },
    {
      key: 17,
      query: `What happens if any Buyer fails to contact ${COMPANY_NAME} on the due date?`,
      answer: `When a deal matures, ${COMPANY_NAME} sends system generated email to the respective Buyers regarding the same. There is no need for the Buyer to contact ${COMPANY_NAME}.<br/>`,
    },
    {
      key: 18,
      query: `What is the range of earnings that can be earned by the Buyer?`,
      answer: `The Buyer can earn earnings ranging between 10% to 15% on a particular deal.<br/>`,
    },
  ]

  const LiquidationQueries = [
    {
      key: 19,
      query: `What is Liquidation, and how does it benefit investor?`,
      answer: `Liquidation is a facility provided to the buyer/investor to sell/liquidate a deal bought on ${COMPANY_NAME} platform before the maturity date of the deal to other buyers/investors on ${COMPANY_NAME} platform. Thus, providing liquidity to investment for investors on ${COMPANY_NAME} platform.<br/> `,
    },
    {
      key: 20,
      query: `How does liquidation work?`,
      answer: `Once a deal liquidation request is placed by the existing investor, the deal is put for sell on ${COMPANY_NAME} platform to be purchased by another investor. `,
    },
    {
      key: 21,
      query: `Who can liquidate the deal?`,
      answer: `Any investor who holds a valid deal on ${COMPANY_NAME} platform can liquidate a deal held by them (except Leasing deals).`,
    },
    {
      key: 22,
      query: `Which deals can be liquidated and when can it be liquidated?`,
      answer: `Currently, Invoice Discounting deals and NCD deals can be liquidated (Leasing deals cannot be liquidated). Deals can be liquidated only after 7 days from Deal Date.<br/>`,
    },
    {
      key: 23,
      query: `Is there any cost for liquidation?`,
      answer: `Yes, deals other than AR deals attract liquidation cost, which is determined by system depending on market conditions. AR deals does not attract any liquidation costs.<br/>`,
    },
    {
      key: 25,
      query: `Is liquidation Guaranteed?`,
      answer: `No.<br/>`,
    },
  ]

  const NonConvertibleDebenturesQueries = [
    {
      key: 26,
      query: `What is the product all about?`,
      answer: `Debentures are long term financial instruments issued by a company for specified tenure with a promise to pay fixed returns to the investor. NCDs cannot be converted into equities or shares. Their rates are decided by the company issuing it.`,
    },
    {
      key: 27,
      query: `Why companies issue NCD?`,
      answer: `The companies issue NCD to raise capital from public issues for a specified tenure.`,
    },
    {
      key: 28,
      query: `Who can invest in NCD?`,
      answer: `It can be held by individuals, banking companies, primary dealers, or other corporate bodies registered or incorporated in India, unincorporated bodies, Non Resident of India (NRIs), Foreign Institutional Investors (FIIs).`,
    },
    {
      key: 29,
      query: `Are these secured?`,
      answer: `Yes, the NCDs are highly secured. The issue of debentures shall be secured by the creation of charge, on the property or assets, or receivables of the company having value which is sufficient for the due repayment of the amount in relation to the debentures and interest.`,
    },
    {
      key: 30,
      query: `How to liquidate?`,
      answer: `As these are not market linked debentures (MLD), these will be liquidated on ${COMPANY_NAME} only. Liquidation will be available after a period of 3-4 months as specified & may take upto 2-3 working days.`,
    },
    {
      key: 31,
      query: `What is the tenure?`,
      answer: `The tenure can vary from 2 years to 20 years. Although, it can be liquidated after the time provided by the issuing company.`,
    },
    {
      key: 32,
      query: `What is the Tax treatment?`,
      answer: `10% TDS will be deducted, and it will be reflected in Form 26 AS. You shall be able to claim a refund by filing the tax returns.`,
    },
    {
      key: 33,
      query: `Are you paying more taxes?`,
      answer: `No, if you are in the tax slab of 20% or 30%, you are anyway paying tax at the same rate.The TDS will be paid from the Obligor instead of you paying it upfront.`,
    },
    {
      key: 34,
      query: `Are there any guarantees offered by ${COMPANY_NAME}?`,
      answer: `As a technology platform, ${COMPANY_NAME} does not offer any guarantee, whatsoever.`,
    },
  ]

  const RiskQueries = [
    {
      key: 35,
      query: `What is the fee structure? Are there any charges while investing on the platform?`,
      answer: `There are no fees. The net IRR percentage shown on the screen while you transact is after deduction of all costs.<br/>`,
    },
    {
      key: 36,
      query: `What happens if there is any delay in repayments? Do we get the earnings till the due date only?`,
      answer: `In case of delay in repayments, the Buyer shall receive the earnings as per the net IRR of the deal till the actual date of repayment and not only till the due date.<br/>`,
    },
    {
      key: 37,
      query: `Which Entity is liable for making repayments?`,
      answer: `The Seller (Vendor) is liable to make the repayments in case it's Customer does not make the repayment. In cases where the Customer is liable to repay, the Offer for Sale shall also be signed by the Customer.<br/>`,
    },
    {
      key: 38,
      query: `Does ${COMPANY_NAME} hold any post-dated cheques (PDCs) which in case of default be used?`,
      answer: `${COMPANY_NAME} holds post-dated cheques (PDCs) of the Entity who is liable to make the repayments.<br/>`,
    },
    {
      key: 39,
      query: `When is the Entity liable to repay shall be considered to have defaulted in repaying a deal?`,
      answer: `If the Entity liable to repay the deal proceeds wilfully does not repay them within seven working days of the settlement date plus grace days mentioned in the Confirmation of Purchase or any incident which endangers the repayment capacity of the Entity liable to repay then a default is committed. ${COMPANY_NAME} shall start the recovery measures as soon as it senses a default.<br/>`,
    },
    {
      key: 40,
      query: `What are the measures adopted by ${COMPANY_NAME} for recovery in case of default?`,
      answer: `When a default is committed, ${COMPANY_NAME} shall take following recovery measures:<br/><br/>1. Stopping of pass-through of funds received from Seller's (Vendor) Customer to the Seller (Vendor);<br/>2. Encashing the post-dated cheques (PDCs);<br/>3. Sending demand notice under section 8 of the Insolvency and Bankruptcy Code, 2016.<br/>4. Other recovery measures which ${COMPANY_NAME} shall consider expedient.<br/>`,
    },
    {
      key: 41,
      query: `What measures are taken by ${COMPANY_NAME} to assess possible bankruptcy/failure to make payment by a seller?`,
      answer: `We have very strong risk mitigation measures. We rely on invoice and escrow confirmations by Large Corporates and not SMEs. We also do multiple financial health checks depending on factors, market situations & Product. As of now, we are a Zero default company.<br/>`,
    },
  ]

  const ReferrersQueries = [
    {
      key: 51,
      query: `When will I get my referral bonus?`,
      answer: `Referral bonus shall be credited in the TradeCred wallet at the end of each calendar quarter, only if all the Terms & Conditions are satisfied.<br/>`,
    },
    {
      key: 52,
      query: `What is the timeline for referral bonus?`,
      answer: `It shall be given on average investment for the first 365 days of each referral.<br/>`,
    },
    {
      key: 53,
      query: `How is the referral bonus calculated?`,
      answer: `The referral bonus calculation on average investments done by your referral. For example, in a quarter, a referral purchased a deal worth INR 5,00,000 for 60 days, on 5 April, 2022. So the maturity date will be 4 June, 2022.<br/>Average investment for the quarter shall be INR (5,00,000*60)/91 = INR 3,29,670.<br/>Referral Bonus for the quarter shall be INR 329670 *0.50%*(91/365) = INR 411.<br/>`,
    },
    {
      key: 54,
      query: `What is a Bonus Referral Incentive? How and when will I get it?
                `,
      answer: `Bonus Referral Incentive is an additional incentive given to you for showing valuable trust in TradeCred and is equal to Referral Incentive earned during the Financial Year.<br/>Bonus Referral Incentive shall be given only if the Referral Incentive earned throughout the F.Y. exceeds INR 25,000. The additional amount shall be credited in the wallet at the end of F.Y. end.<br/>Currently, Bonus Referral Incentive is applicable for FY 2022-23 (ending Mar 23). So, hurry and refer.<br/>`,
    },
    {
      key: 55,
      query: `How many friends/relatives can be referred?`,
      answer: `There is no limit. So, keep referring.<br/>`,
    },
    {
      key: 56,
      query: `Can I withdraw the Referral Incentive in my bank account?`,
      answer: `Yes, Referral Incentive can be withdrawn into the personal bank account as it will be credited in the TradeCred Wallet.<br/>`,
    },
    {
      key: 57,
      query: `Do I need to pay tax on this Referral Incentive?`,
      answer: `Yes.<br/>`,
    },
    {
      key: 58,
      query: `Is TDS applicable on Referral Incentive?`,
      answer: `Yes. TDS of 5% shall be deducted on total Referral Incentive, if total Referral Incentive exceeds INR 20,000/-.<br/>`,
    },
    {
      key: 59,
      query: `Is there any capping on the number of investments done by the referrals for bonus calculations?`,
      answer: `There is no capping on investments.<br/>`,
    },
  ]

  const ReferredQueries = [
    {
      key: 51,
      query: `What is the benefit of joining via referral?`,
      answer: `Any user getting onboarded using a referral will get 1.0% extra IRR over the prevailing IRR for first 6 deals within the first 6 months, which will be credited upon maturity/repayment/ liquidation of the deal.<br/>`,
    },
    {
      key: 52,
      query: `What is the timeline for referral benefits?`,
      answer: `The deals should be purchased within the first 6 months of getting onboarded.<br/>`,
    },
    {
      key: 53,
      query: `Is there any maximum number of investments on which referral benefit will be provided?`,
      answer: `Yes, first 6 investments within the first 6 months of getting onboarded.<br/>`,
    },
    {
      key: 54,
      query: `Is there any maximum investment amount that is eligible for referral benefits?`,
      answer: `No. There is no capping on amount.<br/>`,
    },
    {
      key: 55,
      query: `What is the minimum investment amount?`,
      answer: `The minimum investment amount will depend upon the minimum ticket size mentioned in the deal.<br/>`,
    },
    {
      key: 56,
      query: `I have purchased a deal with a tenure of 1 year. Will I get extra IRR for the first 6 months of onboarding or for the whole tenure?`,
      answer: `You will get extra IRR for the whole tenure.<br/>`,
    },
    {
      key: 57,
      query: `How can I best use the program to take maximum advantage?`,
      answer: `You should invest a larger amount in longer deals to take maximum advantage of the referral program.<br/>`,
    },
  ]

  const queryTitles = [
    'General FAQs',
    'Wallet FAQs',
    'Deal FAQs',
    'Liquidation FAQs',
    'Non Convertible FAQs',
    'Risks FAQs',
    'Referrers FAQs',
    'Referred FAQs',
  ]

  const queries = [
    GeneralQueries,
    WalletQueries,
    DealQueries,
    LiquidationQueries,
    NonConvertibleDebenturesQueries,
    RiskQueries,
    ReferrersQueries,
    ReferredQueries,
  ]

  const navigate = useNavigate()
  const handleBackIconPress = () => navigate(ROUTES.FINANCIER)

  return (
    <div className={styles.faq}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Button handleClick={handleBackIconPress} type='icon' className={styles.backButton}>
            <ion-icon name={'arrow-back'} />
          </Button>
          <Text size='1.3' bold>
            Frequently Asked Questions
          </Text>
        </div>
        <Text size='0.88'>
          For any queries, please email
          <a href={`mailto:${TRADECRED_SUPPORT_EMAIL}`}> {TRADECRED_SUPPORT_EMAIL}</a>.
        </Text>
      </div>

      {queryTitles.map((title, index) => {
        return (
          <div className={styles.queryClusters} key={title}>
            <Text size='1' bold className={styles.titleText}>
              {title}
            </Text>
            <Collapse accordion defaultActiveKey={['1']} style={{ backgroundColor: '#F8FAFD' }}>
              {queries[index].map(query => (
                <Panel key={query.key} header={<Text size='0.92'>{query.query}</Text>}>
                  <Text size='0.88' style={{ backgroundColor: '#EAECEE' }}>
                    <p dangerouslySetInnerHTML={{ __html: query.answer }} />
                  </Text>
                </Panel>
              ))}
            </Collapse>
          </div>
        )
      })}
    </div>
  )
}
