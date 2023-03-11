import { PORTFOLIO_DUCK, REQUEST_STATUS } from '../../core/actions'

export const fetchPortfolioAction = (params, controller) => authAxios => (onSuccess, onFailure) => {
  authAxios
    .get(`/api/v1/financiers/${params.financier_id}/orders`, { params: params, signal: controller?.signal })
    .then(({ data }) => {
      onSuccess(data)
    })
    .catch(e => {
      if (e.message === 'canceled') return
      onFailure
      console.error(`Fetching ${params.state} orders failed with`, e)
    })
}

export const fetchRepaidTableAction = (dealCode, page) => (authAxios, dispatch) => onSuccess => {
  dispatch({ type: PORTFOLIO_DUCK.REPAID_TABLE, payload: { repaidTableStatus: REQUEST_STATUS.PENDING } })
  authAxios
    .get(`api/v1/deal_transactions/${dealCode}/lease_rental_tranches`, {
      params: { page: page },
    })
    .then(({ data }) => {
      dispatch({ type: PORTFOLIO_DUCK.REPAID_TABLE, payload: { repaidTableStatus: REQUEST_STATUS.SUCCESS } })
      onSuccess(data)
    })
    .catch(error => {
      dispatch({ type: PORTFOLIO_DUCK.REPAID_TABLE, payload: { repaidTableStatus: REQUEST_STATUS.FAILURE } })
      console.error(error)
    })
}

export const PortfolioInitialState = {
  repaidTableStatus: REQUEST_STATUS.IDLE,
}

export const PortfolioReducer = (state, { type, payload }) => {
  switch (type) {
    case PORTFOLIO_DUCK.REPAID_TABLE:
      return { ...state, repaidTableStatus: payload.repaidTableStatus }
    default:
      return state
  }
}
