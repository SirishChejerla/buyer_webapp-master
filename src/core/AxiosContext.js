import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import React, { createContext, useContext } from 'react'
import { loadJWT } from '../utils/loadJWT'
import { AuthContext } from './AuthContext'
import { ACCESS_TOKEN_KEY, BASE_URLS, REFRESH_TOKEN_KEY } from './constants'

const AxiosContext = createContext(null)

const AxiosProvider = ({ children }) => {
  const authContext = useContext(AuthContext)
  const headers = {
    'Content-Type': 'application/json',
    'X-WWW-CUSTOM-REQUESTER': 'financier',
  }
  const baseUrl = authContext.getBaseUrl()

  /**
   * Authenticated Instance - Axios Instance with Bearer token
   * Token gets attached via request interceptor below
   * Should be used post login for all authenticated API calls
   */
  const authAxios = axios.create({
    baseURL: baseUrl,
    headers: headers,
  })

  /**
   * Non authenticated Instance - Axios Instance without Bearer token
   * and with custom base URL
   * Primarily used for login workflows
   */
  const publicAxios = (customBase = baseUrl) => {
    return axios.create({
      baseURL: customBase,
      headers: headers,
    })
  }

  authAxios.interceptors.request.use(
    async config => {
      if (!BASE_URLS.includes(baseUrl) || !authContext.getAccessToken()) {
        console.log(`[AXIOS][PENDING] MISSING - Base Url ${baseUrl}, Access Token ${authContext.getAccessToken()}`)
        await loadJWT(authContext.setAuthState)
      }
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`
      }
      if (!config.baseURL) {
        config.baseURL = authContext.getBaseUrl()
      }

      return config
    },
    error => {
      console.error(`Error in Axios Request ${error}`)
      return Promise.reject(error)
    }
  )

  /**
   * Custom Refresh Authentication token logic
   * To be coupled only with createAuthRefreshInterceptor
   */
  const refreshAuth = async failedRequest => {
    const data = {
      refresh_token: authContext.authState.refreshToken,
      grant_type: 'refresh_token',
    }

    const options = {
      method: 'POST',
      data,
      url: `${baseUrl}/api/v1/oauth/token`,
    }

    return axios(options)
      .then(async tokenRefreshResponse => {
        console.log('[AXIOS][SUCCESS] Refresh Token', tokenRefreshResponse.data)
        failedRequest.response.config.headers.Authorization = 'Bearer ' + tokenRefreshResponse.data.access_token

        authContext.setAuthState({
          ...authContext.authState,
          accessToken: tokenRefreshResponse.data.access_token,
          refreshToken: tokenRefreshResponse.data.refresh_token,
        })

        localStorage.setItem(ACCESS_TOKEN_KEY, tokenRefreshResponse.data.access_token)
        localStorage.setItem(REFRESH_TOKEN_KEY, tokenRefreshResponse.data.refresh_token)

        return Promise.resolve()
      })
      .catch(error => {
        console.error('[AXIOS][FAILURE] Refresh Token', error)
        // Do a complete logout if refreshing token failed
        authContext.logout()
      })
  }

  /**
   * An axios interceptor that queues all API calls that gets triggered after a 401 or 403
   * Triggers a custom refresh Authentication logic
   * Post successful refresh, re-triggers all queued API calls in order
   * On failed refresh, triggers logout
   */
  createAuthRefreshInterceptor(authAxios, refreshAuth, { statusCodes: [401, 403] })

  return (
    <AxiosContext.Provider
      value={{
        authAxios,
        publicAxios,
      }}>
      {children}
    </AxiosContext.Provider>
  )
}

const useAxios = () => {
  return useContext(AxiosContext)
}

export { AxiosContext, AxiosProvider, useAxios }
