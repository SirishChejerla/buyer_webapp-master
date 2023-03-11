import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import TradeCredLogo from '../assets/images/TCMiniGhostWhite.png'
import Footer from '../components/footer'
import IconWithLink from '../components/iconWithLink'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'
import Text from '../components/text'
import { ROUTES } from '../core/actions'
import { useAuth } from '../core/AuthContext'
import { loadJWT } from '../utils/loadJWT'
import * as styles from './root.css'

export default function Root() {
  const {
    logout,
    setAuthState,
    authState: { authenticated },
  } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedNav, setSelectedNav] = useState()
  const [pathName, setPathName] = useState(location.pathname)

  const [promotion, setPromotion] = useState({
    title:
      'This is a beta website of buy.tradecred.com. We aim to be more stable than current one and this will be made the official portal soon™️ ',
  })

  const authenticatedRoutes = ['/discover', '/overview', '/portfolio', '/profile']

  useEffect(() => {
    loadJWT(setAuthState)
  }, [])

  useEffect(() => {
    // Auth True, Redirect to saved Pathname
    // Auth True, Redirect to /discover if pathName doesn't include authenticated routes
    // Auth False, save current pathName to be checked after verification of login
    // Auth False, Redirect to login for any pathname except if pathname includes /register
    if (authenticated) {
      if (authenticatedRoutes.some(route => pathName?.includes(route))) {
        setSelectedNav(authenticatedRoutes.findIndex(route => pathName.includes(route)))
        navigate(pathName)
      } else {
        setSelectedNav(0)
        navigate(authenticatedRoutes[0])
      }
    } else {
      setPathName(location.pathname)
      if (location.pathname?.includes('/register')) {
        const pathSplits = location.pathname.split('/')
        const referralCode = pathSplits.find(split => split?.includes('TC'))
        navigate('/register', { state: { referralCode: referralCode } })
      } else {
        navigate('/login')
      }
    }
  }, [authenticated])

  return (
    <div className={authenticated ? (promotion?.title ? styles.layoutPromotion : styles.layout) : undefined}>
      {authenticated && promotion?.title && (
        <div className={styles.promoNavBar}>
          <Text size='0.85' bold>
            {promotion.title}
          </Text>
        </div>
      )}
      {authenticated && (
        <div className={styles.nav}>
          <Navbar className={styles.nav} selectedNav={selectedNav} setSelectedNav={setSelectedNav} />
        </div>
      )}
      {authenticated ? (
        <div className={styles.sidebarBig}>
          <img src={TradeCredLogo} className={styles.logo} alt='TradeCred Logo' /> 
          <div className={styles.welcome}>
            <Text
              size='1.5'
              color={'white'} 
            >
            Welcome back , <span className={styles.name}>Sirish</span>
            </Text>
          </div>
          <Sidebar
            selectedNav={selectedNav}
            setSelectedNav={setSelectedNav}
            authenticatedRoutes={authenticatedRoutes}
          />
          <div className={styles.additionalNavLinks}>
            <IconWithLink icon='information-outline' text='FAQ' href={ROUTES.FAQ} setSelectedNav={setSelectedNav} />
            <IconWithLink
              icon='arrow-down-circle-outline'
              text='Reports'
              href={ROUTES.REPORTS}
              setSelectedNav={setSelectedNav}
            />
            <IconWithLink icon='log-out-outline' text='Log Out' onClick={() => logout()} />
          </div>
        </div>
      ) : (
        <div className={styles.loginTopBar}>
          <img src={TradeCredLogo} className={styles.loginLogo} alt='TradeCred Logo' />
        </div>
      )}
      <div className={authenticated ? styles.main : undefined}>
        <div className={styles.content}>
          <Outlet />
        </div>
        <Footer />
      </div>
      {/* For Mobile View */}
      {authenticated && (
        <div className={styles.sidebarSmall}>
          <Sidebar
            selectedNav={selectedNav}
            setSelectedNav={setSelectedNav}
            authenticatedRoutes={authenticatedRoutes}
          />
        </div>
      )}
    </div>
  )
}
