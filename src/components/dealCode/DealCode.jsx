import { message as Toast } from 'antd'
import React from 'react'
import Button from '../button'
import Text from '../text'
import * as styles from './DealCode.css'

export const DealCode = ({ code }) => {
  const handleCodeCopy = () => {
    console.log('Copied', code, ' to clipboard')
    Toast.info(`Copied ${code} to clipboard`)
    navigator.clipboard.writeText(code)
  }


  const tagColor = code ?.slice(0, 1) === 'D' ? styles.debt
                                              : styles.std
                                                                            
  return (
    // <div className={`${styles.outer} ${code?.slice(0, 1) === 'D' ? styles.debt : styles.std}`}> -- old... 
    <div className={styles.outer}> 
      <Button className={`${styles.button+" "+tagColor}`} type='text' handleClick={handleCodeCopy}>
        <Text size='0.8' color={'#2E8473'} value={code} number />
      </Button>
    </div>
  )
}
