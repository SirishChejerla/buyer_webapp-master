import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/button'
import Input from '../../components/input'
import Text from '../../components/text'
import { LOGIN_DUCK, REQUEST_STATUS, ROUTES } from '../../core/actions'
import { useAuth } from '../../core/AuthContext'
import { AxiosContext } from '../../core/AxiosContext'
import { useGlobal, useGlobalDispatch } from '../../core/GlobalContext'
import * as styles from './Login.css'
import { loginAction, loginOTPAction, requestOTPAction, resendOTPAction } from './LoginDuck'

export const Login = () => {
  const { setAuthState } = useAuth()
  const { publicAxios } = useContext(AxiosContext)
  const { loginDispatch } = useGlobalDispatch()
  const navigate = useNavigate()

  const {
    loginState: { status, message, otpMessage, otpBaseUrl, otpVerificationId, otpResendCount, otpStatus, otpState },
  } = useGlobal()

  const [pan, setPan] = useState('')
  const [isOTP, setIsOTP] = useState(true)
  const [password, setPassword] = useState('')

  useEffect(() => {
    setPassword('')
  }, [isOTP])

  useEffect(() => {
    // Allow no more than 3 tries.
    // LOGIN -> ENTER OTP -> REENTER OTP -> RESEND OTP -> RIGHT/WRONG -> END
    if (otpResendCount >= 3) {
      loginDispatch({ type: LOGIN_DUCK.EOL })
      setPan('')
      setIsOTP(true)
    }
    // Clear input right after resending otp is clicked
    if (otpState === LOGIN_DUCK.RESEND_OTP) {
      setPassword('')
    }
  }, [otpResendCount, otpState, loginDispatch])

  // Reset State after Login success
  useEffect(() => {
    if (status === REQUEST_STATUS.SUCCESS) {
      loginDispatch({ type: LOGIN_DUCK.EOL })
    }
  }, [status, loginDispatch])

  const handlePANChange = val => setPan(val.toUpperCase().trim())
  const handlePasswordChange = val => setPassword(val)
  const handleisOTPChange = () => setIsOTP(isOTP => !isOTP)
  const handleRegisterClick = () => navigate(ROUTES.REGISTER)
  const loginOTPActionLocal = () =>
    loginOTPAction({
      username: pan,
      password: password,
      otp_verification_id: otpVerificationId,
      baseUrl: otpBaseUrl,
    })(publicAxios, loginDispatch, setAuthState)

  // Similar to the logic of Text in Login Button below
  const handleLogin = () => {
    isOTP
      ? otpVerificationId
        ? // When 1st time OTP is generated and allow user to enter and re-enter OTP
          otpResendCount == 2
          ? // When Resend OTP is successful, allow login action. Else show Resend OTP Action
            otpState === LOGIN_DUCK.RESEND_OTP && otpStatus === REQUEST_STATUS.SUCCESS
            ? loginOTPActionLocal()
            : resendOTPAction({
                username: pan,
                otp_verification_id: otpVerificationId,
                baseUrl: otpBaseUrl,
              })(publicAxios, loginDispatch)
          : loginOTPActionLocal()
        : requestOTPAction({ username: pan })(publicAxios, loginDispatch, setAuthState)
      : // When OTP is not selected do Login action with password
        loginAction({
          username: pan,
          password: password,
          otp_verification_id: otpVerificationId,
        })(publicAxios, loginDispatch, setAuthState)
  }

  return (
 
    <div className={styles.cardWrapper}>     

      <div className={styles.card}>
        <Text size='1.6' value='Login' bold></Text>
        <Text className={styles.welcomeText} value='Welcome back, Investor!' />
        <div className={styles.inputs}>
          <Input className={styles.input} placeholder='Enter your PAN' value={pan} onChange={handlePANChange} />
          {isOTP ? (
            otpVerificationId ? (
              otpResendCount == 2 ? (
                otpState === LOGIN_DUCK.RESEND_OTP && otpStatus === REQUEST_STATUS.SUCCESS ? (
                  <Input
                    className={styles.input}
                    placeholder='Enter received OTP'
                    value={password}
                    onChange={handlePasswordChange}
                  />
                ) : null
              ) : (
                <Input
                  className={styles.input}
                  placeholder='Enter received OTP'
                  value={password}
                  onChange={handlePasswordChange}
                />
              )
            ) : null
          ) : (
            <Input
              className={styles.input}
              placeholder='Enter your password'
              value={password}
              onChange={handlePasswordChange}
              type='password'
            />
          )}
          <Button
            label={isOTP ? 'Login using password' : 'Login using OTP'}
            type='text'
            handleClick={handleisOTPChange}
          />
        </div>

        <div className={styles.errorMessage}>
          <Text size='0.85' color='#d62650' bold>
            {otpMessage}
          </Text>
          <Text size='0.85' color='#d62650' bold>
            {message}
          </Text>
        </div>

        <div className={styles.buttonsWrapper}>
          <Button
            className={styles.registerButton}
            label='Create a new account'
            type='skeleton'
            handleClick={handleRegisterClick}
          />
          <Button
            label={
              isOTP
                ? otpVerificationId
                  ? otpResendCount === 2
                    ? otpState === LOGIN_DUCK.RESEND_OTP && otpStatus === REQUEST_STATUS.SUCCESS
                      ? 'Login'
                      : 'Resend OTP'
                    : 'Login'
                  : 'Send OTP'
                : 'Login'
            }
            disabled={status === REQUEST_STATUS.PENDING}
            handleClick={handleLogin}
          />
        </div>
      </div>
    </div>
  )
}
