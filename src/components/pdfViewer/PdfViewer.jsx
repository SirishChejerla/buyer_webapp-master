import React, { useEffect } from 'react'
import Text from '../text'
import * as styles from './PdfViewer.css'

// TODO Currently just opens the pdf.. Might consider using react-pdf-viewer in the future
export const PdfViewer = ({ reportUrl, title, closeModal }) => {
  useEffect(() => {
    window.open(reportUrl, '_blank', 'noopener,noreferrer')
    closeModal()
  }, [])

  return (
    <div>
      <Text>Open</Text>
      <a href={reportUrl} rel='noopener noreferrer' target='_blank'>
        <Text color='#1365d1' className={styles.titleText}>
          {title}
        </Text>
      </a>
    </div>
  )
}
