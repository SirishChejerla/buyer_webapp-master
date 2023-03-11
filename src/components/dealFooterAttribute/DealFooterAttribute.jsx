import React from 'react'
import Button from '../button'
import Text from '../text'
import * as styles from './DealFooterAttribute.css'

// Type constants similar to type attribute defined in footer parser
const SUMMARY = 'summary'
const BUYDEAL = 'BUY DEAL'

export const DealFooterAttribute = ({ type, title, val, showSummary, setModalType, setShowSummary }) => {
  const onPress = () => {
    switch (type) {
      case SUMMARY:
        setShowSummary(!showSummary)
        break
      default:
        setModalType({ type, title, val })
        break
    }
  }

  return (
    <div className={styles.attrWrapper}>
      <Button type='skeleton' handleClick={onPress} className={styles.touchable}>
        <Text bold size='0.8' color={showSummary && type === SUMMARY ? '#1a73e8' : 'var(--default-footer-attribute-color)'}>
          {showSummary && type === SUMMARY ? BUYDEAL : title.toUpperCase()}
        </Text>
      </Button>
    </div>
  )
}
