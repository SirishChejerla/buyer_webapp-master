import React, { useEffect, useState } from 'react'
import { REGISTER_DUCK, VALIDATION_STATUS } from '../../core/actions'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import { validateRegisterAttributes } from '../../utils/validations'
import Input from '../input'
import Text from '../text'
import * as styles from './RegisterAttribute.css'

export const RegisterAttribute = ({ attr }) => {
  const [inputVal, setInputVal] = useState('')
  const {
    registerState: { values, message, accountType },
  } = useGlobal()
  const { registerDispatch } = useGlobalDispatch()

  // Obtains value from global state and populates input with it.
  // Used when account types are switched but still preserves entered value
  useEffect(() => {
    if (!inputVal && values[attr.type]) {
      setInputVal(values[attr.type])
    } else if (!values[attr.type]) {
      setInputVal('')
    }
  }, [values, attr.type])

  const autoCorrectValues = val => {
    if (attr?.type === 'pan' || attr?.type === 'entityPan' || attr?.type === 'fullName') {
      return val ? val.toUpperCase() : val
    }

    return val
  }

  // TODO Handle Validations in input change beased on attr type
  const handleInputChange = val => {
    const correctedVal = autoCorrectValues(val)
    setInputVal(correctedVal)
    registerDispatch({ type: REGISTER_DUCK.VALUES_CHANGE, payload: { values: { [attr?.type]: correctedVal } } })
    validateRegisterAttributes(attr?.type, correctedVal)({ values, message, accountType }, registerDispatch)
  }

  return (
    <div className={styles.registerAttribute}>
      <Text bold color='#566573' size='0.95'>
        {attr?.title}
      </Text>
      <Input
        className={styles.input}
        value={inputVal}
        type={attr?.input}
        name={attr?.type}
        onChange={handleInputChange}
        placeholder={attr?.placeholder}></Input>
      <Text size='0.8' color='#808B96'>
        {attr?.description}
      </Text>
      {message[attr?.type]?.status === VALIDATION_STATUS.SUCCESS ? (
        <Text size='0.8' color='#35A37E'>
          {message[attr?.type]?.value}
        </Text>
      ) : (
        <Text size='0.8' color='#d62650'>
          {message[attr?.type]?.value}
        </Text>
      )}
    </div>
  )
}
