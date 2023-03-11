import React, { createContext, useContext, useState } from 'react'
import { ACCESS_TOKEN_KEY, BASE_URL_KEY, REFRESH_TOKEN_KEY } from './constants'

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    refreshToken: null,
    baseUrl: null,
    authenticated: null,
  })

  const logout = async () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(BASE_URL_KEY)
    setAuthState({
      accessToken: null,
      refreshToken: null,
      baseUrl: null,
      authenticated: false,
    })
  }

  const getAccessToken = () => authState.accessToken
  const getBaseUrl = () => authState.baseUrl

  return (
    <AuthContext.Provider
      value={{
        authState,
        getAccessToken,
        getBaseUrl,
        setAuthState,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  )
}
const useAuth = () => {
  return useContext(AuthContext)
}

export { AuthContext, AuthProvider, useAuth }
