import { DEALS_DUCK } from '../../core/actions'

export const fetchDealsToDisplayAction = (dealType, params, controller) => authAxios => (onSuccess, onFailure) => {
  authAxios
    .get(`/api/v1/${dealType === 'primary' ? 'deals' : 'deal_transaction_liquidations'}`, {
      params: { ...params, aasm_state: dealType === 'primary' ? null : 'requested' },
      signal: controller?.signal,
    })
    .then(({ data }) => {
      onSuccess(data)
    })
    .catch(e => {
      if (e.message === 'canceled') return
      onFailure
      console.error(`Fetching ${dealType} deals failed with`, e)
    })
}

export const DealsInitialState = {
  query: '',
}

export const DealsReducer = (state, { type, payload }) => {
  switch (type) {
    case DEALS_DUCK.SEARCH:
      return { ...state, query: payload.query }
    default:
      return state
  }
}
