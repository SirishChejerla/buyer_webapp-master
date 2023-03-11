import { COS_DUCK, REQUEST_STATUS } from '../../core/actions'
import { DEAL } from '../../core/constants'
import jsonParse from '../../utils/jsonapi'

const dealPathModifier = type =>
  type === DEAL.STANDARD || type === DEAL.STANDARD_SECONDARY || type === DEAL.LEASE
    ? ''
    : type === DEAL.DEBT || type === DEAL.DEBT_SECONDARY
    ? 'debt_'
    : ''

export const fetchRepaymentTableAction = (dealCode, page, purchaseAmount) => (authAxios, dispatch) => onSuccess => {
  dispatch({ type: COS_DUCK.REPAYMENTS_TABLE, payload: { loadingRepayments: REQUEST_STATUS.PENDING } })
  authAxios
    .get(`api/v1/debt_deals/${dealCode}/expected_debt_repayments`, {
      params: { page: page, purchase_amount: purchaseAmount },
    })
    .then(({ data }) => {
      dispatch({ type: COS_DUCK.REPAYMENTS_TABLE, payload: { loadingRepayments: REQUEST_STATUS.SUCCESS } })
      onSuccess(data)
    })
    .catch(error => {
      dispatch({ type: COS_DUCK.REPAYMENTS_TABLE, payload: { loadingRepayments: REQUEST_STATUS.FAILURE } })
      console.error(error)
    })
}

/**
 * name: CREATE_DEAL_TRANSACTION | FETCH_SIGN_URL | VERIFY_DEAL_PURCHASE | EOL
 * status: IDLE | PENDING | SUCCESS | FAILURE
 * message: String
 */

export const createDealTransactionAction =
  ({ dealCode, financierId, purchaseAmount, dealLiquidationId, type }) =>
  (authAxios, dispatch) => {
    dispatch({ type: COS_DUCK.CREATE_DEAL_TRANSACTION, payload: { status: REQUEST_STATUS.PENDING } })

    const payload = {
      deal_code: dealCode,
      financier_id: financierId,
      amount_offered: purchaseAmount,
      deal_transaction_liquidation_id: dealLiquidationId,
    }

    if (type === DEAL.LEASE) {
      payload.type = 'LeaseDealTransaction'
    }

    const path = dealLiquidationId
      ? `api/v1/deal_transaction_liquidations/${dealLiquidationId}/secondary_${dealPathModifier(type)}deal_transactions`
      : `api/v1/${dealPathModifier(type)}deals/${dealCode}/${dealPathModifier(type)}deal_transactions`

    authAxios
      .post(path, payload)
      .then(({ data }) => {
        const dealTransaction = jsonParse(data).data
        console.log(`[FETCH][SUCCESS] Create Deal Transaction`, dealTransaction)
        const dealCode = payload.deal_code
        const dealTransactionCode = dealTransaction?.id

        dispatch({
          type: COS_DUCK.CREATE_DEAL_TRANSACTION,
          payload: {
            status: REQUEST_STATUS.SUCCESS,
            dealTransaction: dealTransaction,
            dealCode: dealCode,
            dealTransactionCode: dealTransactionCode,
          },
        })
      })
      .catch(error => {
        dispatch({
          type: COS_DUCK.CREATE_DEAL_TRANSACTION,
          payload: {
            status: REQUEST_STATUS.FAILURE,
            message: error?.response?.data?.amount_offered || error?.response?.data?.error,
          },
        })
      })
  }

export const fetchSignUrlAction = (dealCode, dealTransactionCode, type) => (authAxios, dispatch) => {
  dispatch({ type: COS_DUCK.FETCH_SIGN_URL, payload: { status: REQUEST_STATUS.PENDING } })

  if (type.includes('SECONDARY')) {
    dealCode = dealCode?.split('TXN')[0]
  }

  authAxios
    .get(
      `api/v1/${dealPathModifier(type)}deals/${dealCode}/${dealPathModifier(
        type
      )}deal_transactions/${dealTransactionCode}/generate_agreement_sign_url`
    )
    .then(({ data }) => {
      console.log('Fetching sign url success', data?.invitees?.filter(item => item.active === true)[0]?.signUrl, data)
      dispatch({
        type: COS_DUCK.FETCH_SIGN_URL,
        payload: {
          status: REQUEST_STATUS.SUCCESS,
          signUrl: data?.data?.invitees?.filter(item => item.active === true)[0]?.signUrl,
        },
      })
    })
    .catch(error => {
      console.log(error.data, error)
      dispatch({ type: COS_DUCK.FETCH_SIGN_URL, payload: { status: REQUEST_STATUS.FAILURE } })
    })
}

export const verifyDealPurchaseAction = (dealCode, dealTransactionCode, type) => (authAxios, dispatch) => {
  dispatch({ type: COS_DUCK.VERIFY_DEAL_PURCHASE, payload: { status: REQUEST_STATUS.PENDING } })

  if (type.includes('SECONDARY')) {
    dealCode = dealCode?.split('TXN')[0]
  }

  authAxios
    .get(
      `api/v1/${dealPathModifier(type)}deals/${dealCode}/${dealPathModifier(
        type
      )}deal_transactions/${dealTransactionCode}/verify_${dealPathModifier(type)}deal_purchase`
    )
    .then(({ data }) => {
      console.log('Verification data', data)
      dispatch({ type: COS_DUCK.VERIFY_DEAL_PURCHASE, payload: { status: REQUEST_STATUS.SUCCESS } })
    })
    .catch(({ response }) => {
      dispatch({
        type: COS_DUCK.VERIFY_DEAL_PURCHASE,
        payload: { status: REQUEST_STATUS.FAILURE, message: response?.status },
      })
    })
}

export const resetConfirmationOfSigningAction = dispatch => {
  // TODO - Server should expose a cancel endpoint so that other user doesn't have to wait
  dispatch({ type: COS_DUCK.EOL })
}

export const ConfirmationOfSigningInitialState = {
  dealCode: '',
  dealTransactionCode: '',
  dealTransaction: {},
  name: COS_DUCK.EOL,
  status: REQUEST_STATUS.IDLE,
  message: '',
  signUrl: '',
  loadingRepayments: REQUEST_STATUS.IDLE,
  count: 0,
}

export const ConfirmationOfSigningReducer = (state, { type, payload }) => {
  let count = state.count

  if (payload?.status === REQUEST_STATUS.PENDING) {
    count += 1
  } else if (payload?.status === REQUEST_STATUS.SUCCESS) {
    count = 0
  }

  switch (type) {
    case COS_DUCK.EOL:
      return { ...ConfirmationOfSigningInitialState }
    case COS_DUCK.CREATE_DEAL_TRANSACTION:
      return { ...state, name: type, ...payload, count: count }
    case COS_DUCK.FETCH_SIGN_URL:
      return { ...state, name: type, ...payload, count: count }
    case COS_DUCK.VERIFY_DEAL_PURCHASE:
      return { ...state, name: type, ...payload, count: count }
    // Not related State
    case COS_DUCK.REPAYMENTS_TABLE:
      return { ...state, ...payload, count: count }
    default:
      return state
  }
}
