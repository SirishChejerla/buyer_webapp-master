import { LIQUIDATION_DUCK, REQUEST_STATUS } from '../../core/actions'
import jsonParse from '../../utils/jsonapi'
import { customTimeFormat } from '../../utils/misc'
import { liquidationParser } from '../../utils/portfolio/liquidationParser'

export const createLiquidationAction = (dealCode, dealTransactionCode) => (authAxios, dispatch) => {
  dispatch({
    type: LIQUIDATION_DUCK.CREATE_LIQUIDATION,
    payload: { status: REQUEST_STATUS.PENDING, dealCode: dealCode, dealTransactionCode: dealTransactionCode },
  })
  authAxios
    .post(`/api/v1/deals/${dealCode}/deal_transactions/${dealTransactionCode}/deal_transaction_liquidations`)
    .then(({ data }) => {
      const parsedLiquidationData = liquidationParser(jsonParse(data).data)
      dispatch({
        type: LIQUIDATION_DUCK.CREATE_LIQUIDATION,
        payload: { status: REQUEST_STATUS.SUCCESS, data: parsedLiquidationData },
      })
    })
    .catch(error => {
      dispatch({ type: LIQUIDATION_DUCK.CREATE_LIQUIDATION, payload: { status: REQUEST_STATUS.FAILURE } })
      console.error(error)
    })
}

export const createLiquidationSendOTPAction =
  (dealCode, dealTransactionCode, liquidationId) => (authAxios, dispatch) => {
    dispatch({ type: LIQUIDATION_DUCK.SEND_OTP, payload: { status: REQUEST_STATUS.PENDING } })
    authAxios
      .post(
        `/api/v1/deals/${dealCode}/deal_transactions/${dealTransactionCode}/deal_transaction_liquidations/${liquidationId}/send_otp`
      )
      .then(({ data }) => {
        const response = jsonParse(data).data?.otp_verification
        dispatch({
          type: LIQUIDATION_DUCK.SEND_OTP,
          payload: {
            status: REQUEST_STATUS.SUCCESS,
            message: `OTP sent to ${response.phone} at ${customTimeFormat(response.sent_at)}`,
          },
        })
        console.log(`OTP sent to ${response.phone} at ${customTimeFormat(response.sent_at)}`)
      })
      .catch(error => {
        dispatch({
          type: LIQUIDATION_DUCK.SEND_OTP,
          payload: {
            status: REQUEST_STATUS.FAILURE,
            message: `Initial attempt to send OTP failed. Resending to your registered mobile number`,
          },
        })
        console.error(error)
        createLiquidationReSendOTPAction(dealCode, dealTransactionCode, liquidationId)(authAxios, dispatch)
      })
  }

export const createLiquidationReSendOTPAction =
  (dealCode, dealTransactionCode, liquidationId) => (authAxios, dispatch) => {
    dispatch({ type: LIQUIDATION_DUCK.RESEND_OTP, payload: { status: REQUEST_STATUS.PENDING } })
    authAxios
      .put(
        `/api/v1/deals/${dealCode}/deal_transactions/${dealTransactionCode}/deal_transaction_liquidations/${liquidationId}/resend_otp`
      )
      .then(({ data }) => {
        dispatch({ type: LIQUIDATION_DUCK.RESEND_OTP, payload: { status: REQUEST_STATUS.SUCCESS } })
        console.log(data, jsonParse(data))
      })
      .catch(error => {
        dispatch({ type: LIQUIDATION_DUCK.RESEND_OTP, payload: { status: REQUEST_STATUS.FAILURE } })
        console.error(error)
      })
  }

export const createLiquidationVerifyOTPAction =
  (dealCode, dealTransactionCode, liquidationId, otp) => (authAxios, dispatch) => {
    dispatch({ type: LIQUIDATION_DUCK.VERIFY_OTP, payload: { status: REQUEST_STATUS.PENDING } })
    const data = { otp_verification_code: otp }
    authAxios
      .put(
        `/api/v1/deals/${dealCode}/deal_transactions/${dealTransactionCode}/deal_transaction_liquidations/${liquidationId}/verify_otp`,
        data
      )
      .then(({ data }) => {
        dispatch({ type: LIQUIDATION_DUCK.VERIFY_OTP, payload: { status: REQUEST_STATUS.SUCCESS } })
        console.log(data, jsonParse(data))
      })
      .catch(error => {
        dispatch({ type: LIQUIDATION_DUCK.VERIFY_OTP, payload: { status: REQUEST_STATUS.FAILURE } })
        console.error(error)
      })
  }

export const LiquidationInitialState = {
  dealCode: '',
  dealTransactionCode: '',
  status: REQUEST_STATUS.IDLE,
  name: LIQUIDATION_DUCK.EOL,
  message: '',
  data: {},
}

export const LiquidationReducer = (state, { type, payload }) => {
  switch (type) {
    case LIQUIDATION_DUCK.EOL:
      return { ...LiquidationInitialState }
    case LIQUIDATION_DUCK.CREATE_LIQUIDATION:
      return { ...state, name: type, ...payload }
    case LIQUIDATION_DUCK.SEND_OTP:
      return { ...state, name: type, ...payload }
    case LIQUIDATION_DUCK.RESEND_OTP:
      return { ...state, name: type, ...payload }
    case LIQUIDATION_DUCK.VERIFY_OTP:
      return { ...state, name: type, ...payload }
    default:
      return state
  }
}
