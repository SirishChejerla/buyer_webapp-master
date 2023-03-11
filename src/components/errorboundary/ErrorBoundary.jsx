import React from 'react'
import error_img from '../../assets/images/confusedTravolta.png'
import Button from '../button'
import * as styles from './ErrorBoundary.css'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log('React Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <img src={error_img} className={styles.logo} alt='404 error' />
          <h2>Something went wrong. Say what??</h2>
          <Button
            className={styles.button}
            handleClick={() => {
              console.log('Going back')
              // TODO Add going back using link
              // history.push("/dashboard/deals/");
            }}>
            Take me back
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
