import React, { useEffect, useState } from 'react'
import Text from '../text'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import * as styles from './UploadDocument.css'
import { REGISTER_DUCK, VALIDATION_STATUS } from '../../core/actions'
import { validateRegisterDocuments } from '../../utils/validations'

// Convert bytes from File Object to readable size
const bytesToHumanReadableSize = numberOfBytes => {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  const exponent = Math.min(Math.floor(Math.log(numberOfBytes) / Math.log(1024)), units.length - 1)
  const approx = numberOfBytes / 1024 ** exponent

  return exponent === 0 ? `${numberOfBytes} bytes` : `${approx.toFixed(2)} ${units[exponent]}`
}

export const UploadDocument = ({ title, type }) => {
  const [fileDetails, setFileDetails] = useState()
  const {
    registerState: { message },
  } = useGlobal()
  const { registerDispatch } = useGlobalDispatch()

  useEffect(() => {
    const uploadInput = document.getElementById(type).files[0]
    setFileDetails(uploadInput)
  }, [type])

  const handleUpload = () => {
    const uploadInput = document.getElementById(type).files[0]
    setFileDetails(uploadInput)
  }

  useEffect(() => {
    registerDispatch({
      type: REGISTER_DUCK.DOC_CHANGE,
      payload: { documents: { [type]: { size: fileDetails?.size } } },
    })

    validateRegisterDocuments(title, type, document.getElementById(type).files[0])(registerDispatch)
  }, [fileDetails])

  return (
    <div>
      <div className={styles.inputWrapper}>
        <label className={styles.label} htmlFor={type}>
          <Text color='#1a73e8'>Upload document</Text>
          <ion-icon name='cloud-upload-outline'></ion-icon>
        </label>
        <input
          type='file'
          id={type}
          name={type}
          onChange={handleUpload}
          accept='image/png, image/jpg, image/jpeg, application/pdf'
          className={styles.uploadInput}
        />
      </div>
      {fileDetails?.name && (
        <div className={styles.fileDetails}>
          <Text size='0.9' color='#35A37E'>
            {fileDetails?.name}
          </Text>
          <Text size='0.8' color='#838e9f'>
            {bytesToHumanReadableSize(fileDetails?.size)} — {fileDetails?.lastModifiedDate.toDateString()}{' '}
            {fileDetails?.lastModifiedDate.toLocaleTimeString()}
          </Text>
        </div>
      )}
      {message[type]?.status === VALIDATION_STATUS.SUCCESS ? (
        <Text size='0.8' color='#35A37E'>
          {message[type]?.value}
        </Text>
      ) : (
        <Text size='0.8' color='#d62650'>
          {message[type]?.value}
        </Text>
      )}
    </div>
  )
}
