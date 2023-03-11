import React from 'react'
import Input from '../input'
import Text from '../text'

export const ChangeBankAccountAttribute = ({ title, placeholder, value, setValue, editable = true, message }) => {
  return (
    <div>
      <Text bold color='#808B96' size='0.82'>
        {title.toUpperCase()}
      </Text>
      <Input name={title} placeholder={placeholder} value={value} editable={editable} onChange={val => setValue(val)} />
      <Text size='0.8' color='#d62650'>
        {message}
      </Text>
    </div>
  )
}
