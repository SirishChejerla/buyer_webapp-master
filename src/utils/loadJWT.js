import { ACCESS_TOKEN_KEY, BASE_URL_KEY, REFRESH_TOKEN_KEY } from '../core/constants'

export const loadJWT = async setAuthState => {
  try {
    console.log(`[CACHE][PENDING] ...`)
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    const baseUrl = localStorage.getItem(BASE_URL_KEY)
    console.log(`[CACHE][SUCCESS] ${accessToken}, ${baseUrl}`)

    setAuthState({
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
      baseUrl: baseUrl || null,
      authenticated: accessToken !== null,
    })
  } catch (error) {
    console.error(`[CACHE][ERROR] ${error.message}`)
    setAuthState({
      accessToken: null,
      refresh_token: null,
      baseUrl: null,
      authenticated: false,
    })
  }
}
