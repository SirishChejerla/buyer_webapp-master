import React from 'react'
import * as styles from './Button.css'
import '../../App.css';

/**
 * type: text, skeleton
 */
export const Button = ({ className, label, handleClick, type, children , color = "",disabled = false }) => {
  const classNames =
    type === 'skeleton'
      ? styles.buttonSkeleton
      : type === 'danger'
      ? styles.danger
      : type === 'text'
      ? styles.buttonText
      : type === 'icon'
      ? styles.buttonIcon
      : disabled
      ? styles.disabled
      : type === 'signin'
      ? styles.signin
      : styles.button

   const buttonStyles = type === 'button' ?
   {
    backgroundColor: color,
    border: '1px solid'+ color,
    color:'white'
   }
   :{
    color: color,
    border: '1px solid'+ color
   }

  return (
    <button
      className={`${classNames} ${className ? className : ''}`}
      type='button'
      style={color?buttonStyles:null}
      onClick={handleClick}
      name={label}
      disabled={disabled}>
      {children ? children : label}
    </button>
  )
}
