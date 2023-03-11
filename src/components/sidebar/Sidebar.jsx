import React from 'react'
import { useNavigate } from 'react-router-dom'
import Text from '../text'
import * as styles from './Sidebar.css'

export const Sidebar = ({ selectedNav, setSelectedNav, authenticatedRoutes }) => {
  const navigate = useNavigate()
  const navButtons = [
    { name: 'Discover', icon: 'book-outline' },
    { name: 'Overview', icon: 'bar-chart-outline' },
    { name: 'Portfolio', icon: 'briefcase-outline' },
    { name: 'Profile', icon: 'person-outline' },
  ]
  const user="Sirish C";
  const handleNavClick = (e, index) => {
    // Using href just to preview link. prevent default to stop rendering sidebar on each click
    e.preventDefault()
    setSelectedNav(index)
    navigate(authenticatedRoutes[index])
  }
  return (      
      <div className={styles.sidebarWrapper}>      
        {navButtons.map((navButton, index) => (
          <a
            key={navButton.name}
            className={`${selectedNav === index && styles.selectedbtn} ${styles.navButton}`}
            href={authenticatedRoutes[index]}
            onClick={e => handleNavClick(e, index)}>
            <ion-icon name={navButton.icon} color={selectedNav === index ? 'placeholder' : null}></ion-icon>                     
            <Text
              size='0.95'
              bold={selectedNav === index}
              className={styles.navText}
              color={selectedNav === index ? 'var(--navbar-selected-button-text-color)' : 'white'}>
              {navButton.name}
            </Text>
          </a>
        ))}
      </div> 
  )
}
