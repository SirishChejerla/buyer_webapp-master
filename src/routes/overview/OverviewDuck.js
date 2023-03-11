import { OVERVIEW_DUCK, REQUEST_STATUS } from '../../core/actions'
import jsonParse from '../../utils/jsonapi'
import { currencyParser } from '../../utils/misc'
import { portfolioTrackersParser } from '../../utils/overview/OverviewParsers'

export const refreshPortfolioGraphsAction = financierPAN => authAxios => {
  authAxios.post(`/api/v1/financiers/${financierPAN}/refresh_portfolio_graphs`)
}

export const refreshPortfolioTrackerAction = () => (authAxios, dispatch) => {
  dispatch({ type: OVERVIEW_DUCK.FETCH_PORTFOLIO_TRACKERS })
  authAxios
    .get('/api/v1/portfolio_trackers')
    .then(({ data }) => {
      dispatch({
        type: OVERVIEW_DUCK.FETCH_PORTFOLIO_TRACKERS_SUCCESS,
        payload: portfolioTrackersParser(jsonParse(data).data[0]),
      })
    })
    .catch(() => {
      dispatch({ type: OVERVIEW_DUCK.FETCH_PORTFOLIO_TRACKERS_FAILURE })
    })
}

export const depositWalletAction = (financierPAN, amount) => (authAxios, dispatch) => {
  dispatch({ type: OVERVIEW_DUCK.CASHFREE_DEPOSIT, payload: { cashfreeStatus: REQUEST_STATUS.PENDING } })
  const data = {
    cashfree_order: {
      order_amount: amount,
    },
  }
  authAxios
    .post(`/api/v1/financiers/${financierPAN}/cashfree_orders`, data)
    .then(({ data }) => {
      const parsedData = jsonParse(data)?.data
      console.log('Response for deposit wallet', parsedData, parsedData?.payment_sessionid)
      dispatch({
        type: OVERVIEW_DUCK.CASHFREE_DEPOSIT,
        payload: { cashfreeStatus: REQUEST_STATUS.SUCCESS, cashfreePaymentSessionId: parsedData?.payment_sessionid },
      })
    })
    .catch(error => {
      dispatch({ type: OVERVIEW_DUCK.CASHFREE_DEPOSIT, payload: { cashfreeStatus: REQUEST_STATUS.FAILURE } })
      console.error(error)
    })
}

export const withdrawWalletAction = (walletId, withdrawalReason, amount) => (authAxios, dispatch) => {
  dispatch({ type: OVERVIEW_DUCK.CASHFREE_WITHDRAW, payload: { cashfreeStatus: REQUEST_STATUS.PENDING } })
  const data = {
    transaction_amount: amount,
    meta: 'Debit wallet by user',
    comment: withdrawalReason,
    type: 'DEBIT',
    wallet_id: walletId,
  }
  authAxios
    .post(`/api/v1/wallets/${walletId}/wallet_transactions`, data)
    .then(({ data }) => {
      dispatch({
        type: OVERVIEW_DUCK.CASHFREE_WITHDRAW,
        payload: {
          cashfreeStatus: REQUEST_STATUS.SUCCESS,
          cashfreeMessage: `Withdraw successful. Updated balance is ${currencyParser(data?.wallet_balance)}`,
        },
      })
    })
    .catch(error => {
      dispatch({
        type: OVERVIEW_DUCK.CASHFREE_WITHDRAW,
        payload: { cashfreeStatus: REQUEST_STATUS.FAILURE, cashfreeMessage: error?.message },
      })
      console.error(error)
    })
}

export const OverviewInitialState = {
  portfolioTracker: [],
  portfolioTrackerStatus: REQUEST_STATUS.IDLE,
  cashfreeStatus: REQUEST_STATUS.IDLE,
  cashfreeMessage: '',
  cashfreePaymentSessionId: '',
  cashfreeType: '',
}

export const OverviewReducer = (state, { type, payload }) => {
  switch (type) {
    case OVERVIEW_DUCK.FETCH_PORTFOLIO_TRACKERS:
      return { ...state, portfolioTrackerStatus: REQUEST_STATUS.PENDING }
    case OVERVIEW_DUCK.FETCH_PORTFOLIO_TRACKERS_SUCCESS:
      return { ...state, portfolioTrackerStatus: REQUEST_STATUS.SUCCESS, portfolioTracker: payload }
    case OVERVIEW_DUCK.FETCH_PORTFOLIO_TRACKERS_FAILURE:
      return { ...state, portfolioTrackerStatus: REQUEST_STATUS.FAILURE }
    case OVERVIEW_DUCK.CASHFREE_DEPOSIT:
      return { ...state, cashfreeType: 'DEPOSIT', ...payload }
    case OVERVIEW_DUCK.CASHFREE_WITHDRAW:
      return { ...state, cashfreeType: 'WITHDRAW', ...payload }
    case OVERVIEW_DUCK.CASHFREE_EOL:
      return {
        ...state,
        cashfreeStatus: REQUEST_STATUS.IDLE,
        cashfreePaymentSessionId: '',
        cashfreeType: '',
        cashfreeMessage: '',
      }
    default:
      return state
  }
}
