import React from 'react'
import Button from '../button'
import Text from '../text'
import UploadDocument from '../uploadDocument'
import * as styles from './RegisterDocument.css'

export const RegisterDocument = ({ attr }) => {
  const handleExtraDescriptionClick = () => {
    window.open(attr?.extraDescription?.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={styles.registerDocument}>
      <Text bold color='#566573' size='0.95'>
        {attr?.title}
      </Text>
      <Text size='0.8' color='#808B96'>
        {attr?.description}
      </Text>
      {attr?.extraDescription && (
        <div>
          <Text size='0.8' color='#808B96'>
            {attr?.extraDescription?.title}
          </Text>
          <Button type='text' handleClick={handleExtraDescriptionClick}>
            <Text size='0.8' color='#1a73e8' value={attr?.extraDescription?.linkTitle} />
          </Button>
        </div>
      )}
      {attr?.type && <UploadDocument title={attr.title} type={attr.type} />}
    </div>
  )
}
