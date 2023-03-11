import React from 'react'
import * as styles from './Chip.css'

export const Chip = ({ className, handleClick, selected, label, children }) => {
  const classNames = selected ? styles.selected : styles.chip

  return (
    <button className={`${classNames} ${className ? className : ''}`} type='button' onClick={handleClick} name={label}>
      {children ? children : label}
    </button>
  )
}
