import { REGISTER_DUCK, VALIDATION_STATUS } from '../core/actions'

export const PAN_FORMAT = /^[A-Z]{3}([C,H,F,A,T,B,L,J,G,P])[A-Z]{1}[0-9]{4}([A-Z])$/
export const PHONE_FORMAT = /^[0-9]{10}$/
export const EMAIL_FORMAT =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// returns {status: SUCCESS/FAILURE, message: String}
export const validateRegisterAttributes = (type, value) => (state, dispatch) => {
  const SUCCESS = VALIDATION_STATUS.SUCCESS
  const FAILURE = VALIDATION_STATUS.FAILURE
  const errorMessage = {}

  if (value === '' || value === undefined || value === null) {
    errorMessage[type] = { status: FAILURE, value: 'Field cannot be empty' }
  } else {
    errorMessage[type] = { status: SUCCESS, value: '' }
  }

  switch (type) {
    case 'pan':
      if (PAN_FORMAT.test(value)) {
        if (
          state.values?.fullName &&
          RegExp(`^[A-Z]{3}([C,H,F,A,T,B,L,J,G,P])(?:(?<=P)${state.values?.fullName[0]})[0-9]{4}[A-Z]{1}$`).test(value)
        ) {
          errorMessage[type] = { status: SUCCESS, value: 'Your PAN is valid!' }
        } else {
          errorMessage[type] = { status: FAILURE, value: 'Your PAN belongs to another individual. Enter your PAN' }
        }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'Your PAN is Invalid!' }
      }
      break

    case 'entityPan':
      if (PAN_FORMAT.test(value)) {
        if (
          state.values?.entityName &&
          RegExp(`^[A-Z]{3}([C,H,F,A,T,B,L,J,G,P])(?:(?<!P)${state.values?.entityName[0]})[0-9]{4}[A-Z]{1}$`).test(
            value
          )
        ) {
          errorMessage[type] = { status: SUCCESS, value: 'Your PAN is valid!' }
        } else {
          errorMessage[type] = { status: FAILURE, value: 'Your PAN belongs to another entity. Enter your PAN' }
        }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'Your PAN is Invalid!' }
      }
      break

    case 'aadhaar':
      if (/^[0-9]{12}$/.test(value)) {
        errorMessage[type] = { status: SUCCESS, value: 'Your Aadhaar is valid!' }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'Your Aadhaar is Invalid!' }
      }
      break

    case 'gstn':
      if (/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
        if (value.substring(2, 12) === state.values?.pan) {
          errorMessage[type] = { status: SUCCESS, value: 'Your GSTN is valid!' }
        } else {
          errorMessage[type] = { status: FAILURE, value: 'GSTN must include your PAN' }
        }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'GSTN must be of the format 22AAAAA0000A1Z5' }
      }
      break

    case 'mobile':
      if (PHONE_FORMAT.test(value)) {
        errorMessage[type] = { status: SUCCESS, value: 'Valid number, will be used for OTPs!' }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'Invalid mobile number' }
      }
      break

    case 'countryCode':
      if (value.includes('91')) {
        errorMessage[type] = { status: FAILURE, value: 'NRIs need to provide non Indian Mobile Number' }
      } else if (/^\+\d{1,3}$/.test(value)) {
        errorMessage[type] = { status: SUCCESS, value: 'Valid Country Code' }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'Invalid Country Code' }
      }
      break

    case 'email':
      if (EMAIL_FORMAT.test(value)) {
        errorMessage[type] = {
          status: SUCCESS,
          value: 'Valid! Email will be used to communicate deal completions and wallet balance updates',
        }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'Invalid Email Id' }
      }
      break

    case 'aadhaarPassword':
      if (/^[A-Z]{4}[0-9]{4}$/.test(value)) {
        errorMessage[type] = { status: SUCCESS, value: 'Follows E-Aadhaar Password format' }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'Invalid E-Aadhaar Password, check FAQ on aadhaar website' }
      }
      break

    case 'dob':
      if (new Date(value) <= new Date()) {
        errorMessage[type] = { status: SUCCESS, value: '' }
      } else {
        errorMessage[type] = { status: FAILURE, value: "Indian Govt. doesn't issue PAN cards for unborn child" }
      }
      break

    case 'address':
      if (value.length <= 100) {
        errorMessage[type] = { status: SUCCESS, value: '' }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'Address too big. Max length is 100 characters' }
      }
      break

    case 'location':
      if (value.length <= 50) {
        errorMessage[type] = { status: SUCCESS, value: '' }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'Location too big. Max length is 50 characters' }
      }
      break

    case 'pincode':
      if (/^[0-9]{6}$/.test(value)) {
        errorMessage[type] = { status: SUCCESS, value: 'Pin Code Valid' }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'Invalid Pin Code' }
      }
      break

    case 'termsAndConditions':
      if (value) {
        errorMessage[type] = { status: SUCCESS, value: '' }
      } else {
        errorMessage[type] = { status: FAILURE, value: 'Kindly accept our T&C' }
      }
      break

    default:
      break
  }

  dispatch({ type: REGISTER_DUCK.MESSAGE_CHANGE, payload: { message: errorMessage } })
}

export const validateRegisterDocuments = (title, type, value) => dispatch => {
  const SUCCESS = VALIDATION_STATUS.SUCCESS
  const FAILURE = VALIDATION_STATUS.FAILURE
  const errorMessage = {}

  // console.log(type, value, value?.size)
  if (value?.size > 0) {
    errorMessage[type] = { status: SUCCESS, value: '' }

    if (value.size > 5242880) {
      errorMessage[type] = {
        status: FAILURE,
        value: `File size exceeds 5 MiB. Use an online image/file compression tool to reduce size`,
      }
    }
  } else {
    errorMessage[type] = { status: FAILURE, value: `Upload ${title}` }
  }

  dispatch({
    type: REGISTER_DUCK.DOC_CHANGE,
    payload: { message: errorMessage, documents: { [type]: { size: value?.size } } },
  })
}
