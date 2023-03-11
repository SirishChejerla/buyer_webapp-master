import keymirror from 'keymirror'

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DEALS: '/discover',
  OVERVIEW: '/overview',
  DEPOSIT: '/overview/deposit',
  WITHDRAW: '/overview/withdraw',
  PORTFOLIO: '/portfolio',
  LIQUIDATE: '/portfolio/liquidate',
  FINANCIER: '/profile',
  FAQ: '/profile/faq',
  REPORTS: '/profile/reports',
}

export const LOGIN_DUCK = keymirror({
  EOL: null,
  LOGIN_INIT: null,
  LOGIN_FAILED: null,
  LOGIN_SUCCESS: null,
  REQUEST_OTP: null,
  RESEND_OTP: null,
  LOGIN_OTP: null,
})

export const REGISTER_DUCK = keymirror({
  ACCOUNT_TYPE: null,
  VALUES_CHANGE: null,
  DOC_CHANGE: null,
  UPLOADING_DOCS: null,
  FILE_UPLOAD: null,
  MESSAGE_CHANGE: null,
  REGISTER_SUCCESS: null,
  REGISTER_FAILURE: null,
})

export const DEALS_DUCK = keymirror({
  SEARCH: null,
})

export const PROFILE_DUCK = keymirror({
  FETCH_FINANCIER: null,
  FETCH_FINANCIER_SUCCESS: null,
  FETCH_FINANCIER_FAILURE: null,
  NOMINEE_DETAILS: null,
  REFERRAL_DETAILS: null,
  MIS: null,
  EARNINGS_REPORT: null,
  OUTSTANDING_REPORT: null,
})

export const PORTFOLIO_DUCK = keymirror({
  FETCH_PORTFOLIO: null,
  FETCH_PORTFOLIO_SUCCESS: null,
  FETCH_PORTFOLIO_FAILURE: null,
  TAB_CHANGE: null,
  REPAID_TABLE: null,
})

export const OVERVIEW_DUCK = keymirror({
  FETCH_PORTFOLIO_TRACKERS: null,
  FETCH_PORTFOLIO_TRACKERS_SUCCESS: null,
  FETCH_PORTFOLIO_TRACKERS_FAILURE: null,
  CASHFREE_DEPOSIT: null,
  CASHFREE_WITHDRAW: null,
  CASHFREE_EOL: null,
})

export const REQUEST_STATUS = keymirror({
  IDLE: null,
  PENDING: null,
  SUCCESS: null,
  FAILURE: null,
})

export const VALIDATION_STATUS = keymirror({
  IDLE: null,
  WARNING: null,
  SUCCESS: null,
  FAILURE: null,
})

export const REGISTRATION_STATUS = keymirror({
  UPLOADING_DOCUMENTS: null,
  REGISTRATION_IDLE: null,
  REGISTRATION_PENDING: null,
  REGISTRATION_SUCCESS: null,
  REGISTRATION_FAILURE: null,
})

export const COS_DUCK = keymirror({
  EOL: null,
  CREATE_DEAL_TRANSACTION: null,
  FETCH_SIGN_URL: null,
  VERIFY_DEAL_PURCHASE: null,
  REPAYMENTS_TABLE: null,
})

export const LIQUIDATION_DUCK = keymirror({
  EOL: null,
  CREATE_LIQUIDATION: null,
  SEND_OTP: null,
  RESEND_OTP: null,
  VERIFY_OTP: null,
})
