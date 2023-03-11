import { PROFILE_DUCK, REQUEST_STATUS } from '../../core/actions'
import { financierParser } from '../../utils/financier/financierParsers'
import jsonParse from '../../utils/jsonapi'

export const fetchFinancierAction = () => (authAxios, dispatch) => {
  dispatch({ type: PROFILE_DUCK.FETCH_FINANCIER })
  authAxios
    .get('/api/v1/financiers/current')
    .then(({ data }) => {
      dispatch({ type: PROFILE_DUCK.FETCH_FINANCIER_SUCCESS, payload: financierParser(jsonParse(data).data) })
    })
    .catch(error => {
      console.log(`[FETCH][ERROR] Financier data ${error?.message}`)
      dispatch({ type: PROFILE_DUCK.FETCH_FINANCIER_FAILURE })
    })
}

export const updateFinancierBankAccountAction = data => authAxios => (onSuccess, onFailure) => {
  authAxios
    .put(`/api/v1/financiers/${data.financier_code}/financier_bank_account/${data.bank_account_code}`, {
      financier_bank_account: data,
    })
    .then(({ data }) => onSuccess(data))
    .catch(error => onFailure(error))
}

export const createFinancierBankAccountAction = data => authAxios => (onSuccess, onFailure) => {
  authAxios
    .post(`/api/v1/financiers/${data.financier_code}/financier_bank_account`, { financier_bank_account: data })
    .then(({ data }) => onSuccess(data))
    .catch(error => onFailure(error))
}

export const referralDetailsAction = financierPAN => (authAxios, dispatch) => {
  authAxios.get(`/api/v1/financiers/${financierPAN}/referral_dashboard`).then(({ data }) => {
    dispatch({
      type: PROFILE_DUCK.REFERRAL_DETAILS,
      payload: { referrals: data },
    })
  })
}

export const getNomineeDetailsAction = financierPAN => (authAxios, dispatch) => {
  const data = {
    page: 1,
  }
  authAxios
    .get(`/api/v1/financiers/${financierPAN}/nominees`, data)
    .then(({ data }) => {
      data.data.forEach(user => {
        let email
        let name
        let phone
        let pan
        let relation = user.attributes.designation
        data.included.forEach(entry => {
          if (entry.id === user.relationships.user.data.id) {
            email = entry.attributes.email
            name = entry.attributes.full_name
            phone = entry.attributes.phone
          }
          if (entry.id === user.relationships.person_kyc.data.id) {
            pan = entry.attributes.permanent_account_number
          }
        })
        // TODO Check for multiple nominees and clear nominees at the end
        dispatch({
          type: PROFILE_DUCK.NOMINEE_DETAILS,
          payload: { nominees: { email: email, name: name, phone: phone, pan: pan, relation: relation } },
        })
      })
    })
    .catch(error => {
      console.error(error)
    })
}

export const addNomineeDetailsAction = data => authAxios => (onSuccess, onFailure) => {
  authAxios
    .post(`/api/v1/financiers/${data.financier_id}/nominees`, { nominees: data })
    .then(({ data }) => {
      onSuccess(data)
    })
    .catch(error => {
      onFailure(error)
    })
}

export const fetchMisReportUrlAction = financierPAN => (authAxios, dispatch) => onSuccess => {
  dispatch({ type: PROFILE_DUCK.MIS, payload: { misReportStatus: REQUEST_STATUS.PENDING } })
  authAxios
    .post(`/api/v1/financiers/${financierPAN}/refresh_mis`)
    .then(({ data }) => {
      onSuccess(jsonParse(data)?.data?.document_buyer_mis_reports[0]?.service_url)
      dispatch({ type: PROFILE_DUCK.MIS, payload: { misReportStatus: REQUEST_STATUS.SUCCESS } })
    })
    .catch(() => {
      dispatch({ type: PROFILE_DUCK.MIS, payload: { misReportStatus: REQUEST_STATUS.FAILURE } })
    })
}

export const fetchEarningsReportUrlAction = financierPAN => (authAxios, dispatch) => onSuccess => {
  dispatch({ type: PROFILE_DUCK.EARNINGS_REPORT, payload: { earningsReportStatus: REQUEST_STATUS.PENDING } })
  authAxios
    .post(`/api/v1/financiers/${financierPAN}/refresh_earning_mis`)
    .then(({ data }) => {
      onSuccess(jsonParse(data)?.data?.document_buyer_earning_mis_reports[0]?.service_url)
      dispatch({ type: PROFILE_DUCK.EARNINGS_REPORT, payload: { earningsReportStatus: REQUEST_STATUS.SUCCESS } })
    })
    .catch(() => {
      dispatch({ type: PROFILE_DUCK.EARNINGS_REPORT, payload: { earningsReportStatus: REQUEST_STATUS.FAILURE } })
    })
}

export const fetchOutstandingsReportUrlAction = (financierPAN, date) => (authAxios, dispatch) => onSuccess => {
  dispatch({ type: PROFILE_DUCK.OUTSTANDING_REPORT, payload: { outstandingsReportStatus: REQUEST_STATUS.PENDING } })
  authAxios
    .post(`/api/v1/financiers/${financierPAN}/generate_outstanding_report`, { id: financierPAN, date })
    .then(({ data }) => {
      onSuccess(jsonParse(data)?.data?.service_url)
      dispatch({ type: PROFILE_DUCK.OUTSTANDING_REPORT, payload: { outstandingsReportStatus: REQUEST_STATUS.SUCCESS } })
    })
    .catch(() => {
      dispatch({ type: PROFILE_DUCK.OUTSTANDING_REPORT, payload: { outstandingsReportStatus: REQUEST_STATUS.FAILURE } })
    })
}

export const fetchMBASignUrlAction = authAxios => onSuccess => {
  authAxios
    .get('/api/v1/financiers/get_agreement_signing_url')
    .then(({ data }) => {
      onSuccess(data?.data?.invitees?.filter(item => item.active === true)[0]?.signUrl)
    })
    .catch(e => {
      console.log('MBA Sign Url fetch failure', e)
    })
}

export const FinancierInitialState = {
  status: REQUEST_STATUS.IDLE,
  financier: null,
  nominees: [],
  referrals: [],
  misReportStatus: REQUEST_STATUS.IDLE,
  earningsReportStatus: REQUEST_STATUS.IDLE,
  outstandingsReportStatus: REQUEST_STATUS.IDLE,
}

export const FinancierReducer = (state, { type, payload }) => {
  switch (type) {
    case PROFILE_DUCK.FETCH_FINANCIER:
      return { ...state, status: REQUEST_STATUS.PENDING }
    case PROFILE_DUCK.FETCH_FINANCIER_SUCCESS:
      return { ...state, status: REQUEST_STATUS.SUCCESS, financier: payload }
    case PROFILE_DUCK.FETCH_FINANCIER_FAILURE:
      return { ...state, status: REQUEST_STATUS.FAILURE }
    case PROFILE_DUCK.NOMINEE_DETAILS:
      return {
        ...state,
        nominees: [...new Map([...state.nominees, payload.nominees].map(item => [item['pan'], item])).values()],
      }
    case PROFILE_DUCK.REFERRAL_DETAILS:
      return { ...state, referrals: payload.referrals }
    case PROFILE_DUCK.MIS:
      return { ...state, misReportStatus: payload.misReportStatus }
    case PROFILE_DUCK.EARNINGS_REPORT:
      return { ...state, earningsReportStatus: payload.earningsReportStatus }
    case PROFILE_DUCK.OUTSTANDING_REPORT:
      return { ...state, outstandingsReportStatus: payload.outstandingsReportStatus }
    default:
      return state
  }
}
