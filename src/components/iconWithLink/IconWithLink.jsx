import React from 'react'
import { useNavigate } from 'react-router-dom'
import Text from '../text'
import * as styles from './IconWithLink.css'

export const IconWithLink = ({ icon, text, setSelectedNav, onClick, href, blank = false, textColor = 'white' }) => {
  const navigate = useNavigate()

  const handleClick = e => {
    if (onClick) {
      onClick()
    } else {
      e.preventDefault()
      // Set Selected Nav as Profile, since faq and reports belong to profile
      setSelectedNav(3)
      navigate(href)
    }
  }

  return (
    <a
      className={styles.iconWithLink}
      href={href}
      onClick={e => handleClick(e)}
      target={blank ? '_blank' : undefined}
      rel={blank ? 'noreferrer' : undefined}>
      <ion-icon name={icon}></ion-icon>
      <Text className={styles.text} size='0.9' color={textColor}>
        {text}
      </Text>
    </a>
  )
}
