import React from 'react'
import { INR } from '../../core/constants'
import Text from '../text'
import * as styles from './Input.css'


export const Input = ({
  className,
  textStyle,
  placeholder,
  value,
  type,
  name,
  onChange,
  label = "",           // adding an new label props in Input 
  id,                     // id for the label.
  number = false,
  editable = true,
  showINR = false
  
}) => {
  const handleInputChange = event => {
    onChange(event.target.value)
  }

  const inputClassNames = [
    editable ? styles.input : styles.disabledInput,
    showINR ? styles.inrInput : '',
    textStyle ? textStyle : '',
    number ? styles.number : ''    

  ].join(' ')

  // input without label
  const input = (
    <input
      className={inputClassNames}   
      placeholder={placeholder}         
      value={value}
      type={type}
      name={name}
      id={id}
      aria-label={placeholder}
      disabled={!editable}
      onChange={handleInputChange}    
    />        
  )
  // input with label
  const inputLabel = (
    <input
      className={inputClassNames}   
      value={value}
      type={type}
      name={name}
      id={id}
      aria-label={placeholder}
      disabled={!editable}
      onChange={handleInputChange}
      onFocus={(element) => element.target.placeholder=placeholder}
      onBlur={(element) =>  element.target.placeholder=""}  
      required
    />        
  )

  const wrapperClassNames = [
    showINR && styles.wrapper,
    !editable && styles.disabledWrapper,
    className ? className : '',
  ].join(' ')

  const showINRInput = (
    <div className={wrapperClassNames}>
      {showINR ? (
        <Text size='1.2' className={styles.inrText} number>
          {INR}
        </Text>
      ) : null}
      {label?(
        <>               
          {inputLabel}
          <label className={styles.label} id = {id}>
            <span>{label}</span>         
          </label>   
        </>
        
      ):
      input
      }    


    </div>
  )

  return showINRInput

}