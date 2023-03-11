import React from 'react'
import * as styles from './Text.css'
import '../../App.css'
export const Text = ({ className, value, bold = false, color, size, number = false, children }) => {
  //Old - #202124
  // Nice - '#3f3844'
  // '#121112'
  const textColor = color ? color : 'var(--default-text-color)'
  const fontSize = size ? size : '1'

  return (
    <span
      className={`${className ? className : ''} ${styles.text} ${number ? styles.number : ''}`}
      style={{ fontWeight: bold && '600', color: textColor, fontSize: `${fontSize}rem` }}>
      {children ? children : value}
    </span>
  )
}
