import { LOGIN_DUCK, REQUEST_STATUS } from '../../core/actions'
import { ACCESS_TOKEN_KEY, BASE_URLS, BASE_URL_KEY, DEVICE_DETAILS, REFRESH_TOKEN_KEY } from '../../core/constants'
import { multiBackendApiCall } from '../../utils/multiBackendApiUtils'

/**
 * Call each backend - determine if the user exists in any backend.
 * once the backend is determined - save corresponding backend_api_url to async_storage
 * if user doesn't belong to any backend, throw the error from last api call.
 * Login DOES NOT use publicAxios like others, since we do not want retry logic messing up with finding base url
 */
export const loginAction =
  ({ username: email, password, otp_verification_id }) =>
  (publicAxios, dispatch, setAuthState) => {
    dispatch({ type: LOGIN_DUCK.LOGIN_INIT })

    const login_axios_instances = BASE_URLS.map(backend_api_url =>
      publicAxios(backend_api_url).post('/api/v1/oauth/token', {
        email,
        password,
        grant_type: 'password',
        otp_verification_id,
        referer: DEVICE_DETAILS,
      })
    )

    multiBackendApiCall(login_axios_instances)
      .then(responses => {
        let found_creds = false

        responses.forEach(({ base_url, state, response }) => {
          if (state === 'success') {
            found_creds = true

            // Store it in state, only other place it is stored is when fetching from cache
            setAuthState({
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
              baseUrl: base_url,
              authenticated: true,
            })

            localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token)
            localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token)
            localStorage.setItem(BASE_URL_KEY, base_url)
          }
        })

        if (found_creds) {
          dispatch({ type: LOGIN_DUCK.LOGIN_SUCCESS })
        } else {
          console.error(`[LOGIN][FAILURE] on all ${BASE_URLS}`)
          dispatch({
            type: LOGIN_DUCK.LOGIN_FAILED,
            payload: responses[0]?.response?.data?.error
              ? { error: responses[0]?.response?.data?.error }
              : { error: 'Invalid PAN! Try again in a while' },
          })
        }
      })
      .catch(error => {
        console.error(`[LOGIN][FAILURE] ${error}`)
        dispatch({
          type: LOGIN_DUCK.LOGIN_FAILED,
          payload: error ? error : { error: 'Network issue! Unable to reach our servers' },
        })
      })
  }

export const loginOTPAction =
  ({ username: email, password, baseUrl, otp_verification_id }) =>
  (publicAxios, dispatch, setAuthState) => {
    dispatch({ type: LOGIN_DUCK.LOGIN_OTP, payload: { status: REQUEST_STATUS.PENDING } })

    multiBackendApiCall([
      publicAxios(baseUrl).post('/api/v1/oauth/token', {
        email,
        password,
        grant_type: 'password',
        otp_verification_id,
        referer: DEVICE_DETAILS,
      }),
    ])
      .then(responses => {
        const { base_url, state, response } = responses[0]

        if (state === 'success') {
          dispatch({ type: LOGIN_DUCK.LOGIN_OTP, payload: { status: REQUEST_STATUS.SUCCESS } })
          // Store it in state, only other place it is stored is when fetching from cache
          setAuthState({
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            baseUrl: base_url,
            authenticated: true,
          })
          localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token)
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token)
          localStorage.setItem(BASE_URL_KEY, base_url)
        } else {
          dispatch({
            type: LOGIN_DUCK.LOGIN_OTP,
            payload: {
              otpMessage: response?.data?.error ? response?.data?.error : 'Invalid PAN! Try again in a while',
              status: REQUEST_STATUS.FAILURE,
            },
          })
        }
      })
      .catch(error => {
        dispatch({
          type: LOGIN_DUCK.LOGIN_FAILED,
          payload: error ? error : { error: 'Network issue! Unable to reach our servers' },
        })
      })
  }

export const requestOTPAction =
  ({ username: email }) =>
  (publicAxios, dispatch) => {
    dispatch({ type: LOGIN_DUCK.REQUEST_OTP, payload: { otpStatus: REQUEST_STATUS.PENDING } })

    const loginAxiosInstances = BASE_URLS.map(backend_api_url =>
      publicAxios(backend_api_url).post('/api/v1/password/request_login_otp', {
        email,
        referer: DEVICE_DETAILS,
      })
    )

    multiBackendApiCall(loginAxiosInstances)
      .then(responses => {
        let otp_sent = false

        responses.forEach(({ base_url, state, response }) => {
          if (state === 'success') {
            otp_sent = true
            dispatch({
              type: LOGIN_DUCK.REQUEST_OTP,
              payload: {
                otpStatus: REQUEST_STATUS.SUCCESS,
                otpVerificationId: response?.data?.otp_verification_id,
                otpMessage: response?.data?.message?.join('. '),
                otpBaseUrl: base_url,
              },
            })
          }
        })
        if (!otp_sent) {
          console.error(`[OTP][FAILURE] on all`)

          dispatch({
            type: LOGIN_DUCK.REQUEST_OTP,
            payload: {
              otpStatus: REQUEST_STATUS.FAILURE,
              // TODO Change index along with REGISTER_BACKEND_URL
              otpMessage: responses[2]?.response?.data?.error || `PAN not found. Register with us before logging in.`,
            },
          })
        }
      })
      .catch(({ response }) => {
        console.error(`[OTP][FAILURE] ${response}`)
        dispatch({
          type: LOGIN_DUCK.REQUEST_OTP,
          payload: { otpStatus: REQUEST_STATUS.FAILURE, otpMessage: response?.data },
        })
      })
  }

export const resendOTPAction =
  ({ username: email, baseUrl, otp_verification_id }) =>
  (publicAxios, dispatch) => {
    dispatch({ type: LOGIN_DUCK.RESEND_OTP, payload: { otpStatus: REQUEST_STATUS.PENDING } })
    publicAxios(baseUrl)
      .put('/api/v1/password/retry_login_otp', { email, otp_verification_id, referer: DEVICE_DETAILS })
      .then(({ data }) => {
        dispatch({
          type: LOGIN_DUCK.RESEND_OTP,
          payload: {
            otpStatus: REQUEST_STATUS.SUCCESS,
            otpMessage: data?.message?.join('. '),
          },
        })
      })
      .catch(({ response }) => {
        dispatch({
          type: LOGIN_DUCK.RESEND_OTP,
          payload: { otpStatus: REQUEST_STATUS.FAILURE, otpMessage: response?.data },
        })
      })
  }

export const LoginInitialState = {
  message: null,
  status: REQUEST_STATUS.IDLE,
  otpBaseUrl: null,
  otpState: null,
  otpResendCount: 0,
  otpStatus: REQUEST_STATUS.IDLE,
  otpMessage: null,
  otpVerificationId: null,
}

export const LoginReducer = (state, { type, payload }) => {
  let count = state.otpResendCount
  // Counting every time a login token request is tried with, resets in component with dispatch of EOL
  if (state.status === REQUEST_STATUS.PENDING && type === LOGIN_DUCK.LOGIN_OTP) {
    count += 1
  }

  switch (type) {
    case LOGIN_DUCK.LOGIN_INIT:
      return { ...state, status: REQUEST_STATUS.PENDING, message: null }
    case LOGIN_DUCK.LOGIN_SUCCESS:
      return { ...state, status: REQUEST_STATUS.SUCCESS, message: null }
    case LOGIN_DUCK.LOGIN_FAILED:
      return { ...state, status: REQUEST_STATUS.FAILURE, message: payload.error }
    case LOGIN_DUCK.LOGIN_OTP:
      return { ...state, ...payload, otpResendCount: count }
    case LOGIN_DUCK.REQUEST_OTP:
      return { ...state, otpState: LOGIN_DUCK.REQUEST_OTP, ...payload }
    case LOGIN_DUCK.RESEND_OTP:
      return { ...state, otpState: LOGIN_DUCK.RESEND_OTP, ...payload }
    case LOGIN_DUCK.EOL:
      return { ...LoginInitialState }
    default:
      return state
  }
}
