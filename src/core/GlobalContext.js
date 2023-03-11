import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import {
  ConfirmationOfSigningInitialState,
  ConfirmationOfSigningReducer,
} from '../routes/deals/ConfirmationOfSigningDuck'
import { DealsInitialState, DealsReducer } from '../routes/deals/DealsDuck'
import { FinancierInitialState, FinancierReducer } from '../routes/financier/FinancierDuck'
import { LoginInitialState, LoginReducer } from '../routes/login/LoginDuck'
import { OverviewInitialState, OverviewReducer } from '../routes/overview/OverviewDuck'
import { LiquidationInitialState, LiquidationReducer } from '../routes/portfolio/LiquidationDuck'
import { PortfolioInitialState, PortfolioReducer } from '../routes/portfolio/PortfolioDuck'
import { RegisterInitialState, RegisterReducer } from '../routes/register/RegisterDuck'

export const GlobalContext = createContext({})
export const GlobalDispatchContext = createContext({})

const enchanceDispatchWithLogger = dispatch => {
  return function (action) {
    // console.groupCollapsed('Action Type:', action.type)
    return dispatch(action)
  }
}

const useReducerWithLogger = (...args) => {
  const [state, dispatch] = useReducer(...args)
  let prevState = useRef(args[1])

  const dispatchWithLogger = useMemo(() => {
    return enchanceDispatchWithLogger(dispatch)
  }, [dispatch])

  useEffect(() => {
    if (state !== prevState.current) {
      // console.log('Prev state: ', prevState.current)
      // console.log('Next state: ', state)
      // console.groupEnd()
    }
    prevState.current = state
  }, [state, args])

  return [state, dispatchWithLogger]
}

export const GlobalProvider = ({ children }) => {
  const [dealsState, dealsDispatch] = useReducerWithLogger(DealsReducer, DealsInitialState)
  const [loginState, loginDispatch] = useReducerWithLogger(LoginReducer, LoginInitialState)
  const [financierState, financierDispatch] = useReducerWithLogger(FinancierReducer, FinancierInitialState)
  const [portfolioState, portfolioDispatch] = useReducerWithLogger(PortfolioReducer, PortfolioInitialState)
  const [overviewState, overviewDispatch] = useReducerWithLogger(OverviewReducer, OverviewInitialState)
  const [confirmationOfSigningState, confirmationOfSigningDispatch] = useReducerWithLogger(
    ConfirmationOfSigningReducer,
    ConfirmationOfSigningInitialState
  )
  const [liquidationState, liquidationDispatch] = useReducerWithLogger(LiquidationReducer, LiquidationInitialState)
  const [registerState, registerDispatch] = useReducerWithLogger(RegisterReducer, RegisterInitialState)

  return (
    <GlobalContext.Provider
      value={{
        dealsState,
        loginState,
        financierState,
        portfolioState,
        overviewState,
        confirmationOfSigningState,
        liquidationState,
        registerState,
      }}>
      <GlobalDispatchContext.Provider
        value={{
          dealsDispatch,
          loginDispatch,
          financierDispatch,
          portfolioDispatch,
          overviewDispatch,
          confirmationOfSigningDispatch,
          liquidationDispatch,
          registerDispatch,
        }}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => {
  return useContext(GlobalContext)
}

export const useGlobalDispatch = () => {
  return useContext(GlobalDispatchContext)
}
