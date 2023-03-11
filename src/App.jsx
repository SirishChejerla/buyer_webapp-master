import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import * as styles from './App.css'
import ErrorBoundary from './components/errorboundary'
import { ROUTES } from './core/actions'
import { AuthProvider } from './core/AuthContext'
import { AxiosProvider } from './core/AxiosContext'
import { isPROD } from './core/constants'
import { GlobalProvider } from './core/GlobalContext'
import Deals from './routes/deals'
import Financier from './routes/financier'
import Login from './routes/login'
import Overview from './routes/overview'
import Deposit from './routes/overview/deposit'
import Withdraw from './routes/overview/withdraw'
import Porfolio from './routes/portfolio'
import Faq from './routes/portfolio/faq'
import Liquidate from './routes/portfolio/liquidate'
import Reports from './routes/portfolio/reports'
import Register from './routes/register'
import Root from './routes/root'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: ROUTES.LOGIN, element: <Login /> },
      { path: ROUTES.REGISTER, element: <Register /> },
      { path: ROUTES.DEALS, element: <Deals /> },
      { path: ROUTES.OVERVIEW, element: <Overview /> },
      { path: ROUTES.DEPOSIT, element: <Deposit /> },
      { path: ROUTES.WITHDRAW, element: <Withdraw /> },
      { path: ROUTES.PORTFOLIO, element: <Porfolio /> },
      { path: ROUTES.LIQUIDATE, element: <Liquidate /> },
      { path: ROUTES.FINANCIER, element: <Financier /> },
      { path: ROUTES.FAQ, element: <Faq /> },
      { path: ROUTES.REPORTS, element: <Reports /> },
      { path: '*', element: <></> },
    ],
  },
])

// Disable console log on Production
if (isPROD) {
  console.log = function () {}
}

const App = () => {
  return (
    <div className={styles.app}>
      <ErrorBoundary>
        <AuthProvider>
          <AxiosProvider>
            <GlobalProvider>
              <RouterProvider router={router} />
            </GlobalProvider>
          </AxiosProvider>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  )
}

export default App
