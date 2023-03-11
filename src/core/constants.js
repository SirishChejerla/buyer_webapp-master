import keymirror from 'keymirror'

export const DEVICE_DETAILS = 'beta-buy.tradecred.com'
export const ICICI_BACKEND_API_URL = 'https://api.tradecred.com'
export const IDFC_BACKEND_API_URL = 'https://idfcapi.tradecred.com'
export const DBS_BACKEND_API_URL = 'https://dbsapi.tradecred.com'
const DEV_BACKEND_API_URL = 'https://staging-backend.tradecred.com/'

export const isPROD = process.env.REACT_APP_PRODUCTION

export const BASE_URLS = isPROD
  ? [ICICI_BACKEND_API_URL, IDFC_BACKEND_API_URL, DBS_BACKEND_API_URL]
  : [DEV_BACKEND_API_URL]

export const REGISTER_BACKEND_URL = isPROD ? DBS_BACKEND_API_URL : DEV_BACKEND_API_URL

export const BASE_URL_KEY = '@baseUrl'
export const ACCESS_TOKEN_KEY = '@accessToken'
export const REFRESH_TOKEN_KEY = '@refreshToken'
export const WITHDRAWAL_REASONS_KEY = '@withdrawalReasons'
export const WITHDRAWAL_REASON_DAY_KEY = '@withdrawalReasonDay'

export const INR = '₹'

export const DEAL = keymirror({
  STANDARD: null,
  DEBT: null,
  LEASE: null,
  STANDARD_SECONDARY: null,
  DEBT_SECONDARY: null,
  LEASE_SECONDARY: null,
})

export const PORTFOLIO = keymirror({
  STANDARD: null,
  DEBT: null,
  LEASE: null,
  STANDARD_SECONDARY: null,
  DEBT_SECONDARY: null,
  LEASE_SECONDARY: null,
})

export const PORTFOLIO_FILTERS = [
  { title: 'Ongoing deal', state: 'completed' },
  { title: 'Liquidation requested', state: 'liquidation_request_placed' },
  { title: 'Liquidated deal', state: 'liquidated' },
  { title: 'Pending for approval', state: 'subscriber_sign_requested' },
  { title: 'Completed deal', state: 'settled' },
]

export const TRADECRED_ASSET_LOGO = '/assets/images/TradeCredLogo.png'
export const TRADECRED_SUPPORT_EMAIL = 'support@tradecred.com'
export const TRADECRED_SUPPORT_PHONE = '1800-120-9870'
export const BUYER_LINK = 'beta-buy.tradecred.com'
export const COMPANY_NAME = 'TradeCred'
export const isTradecred = true

export const IFSC_FORMAT = /^[A-Za-z]{4}[0][A-Za-z0-9]{6}$/
