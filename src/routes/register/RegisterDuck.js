import { REGISTER_DUCK, REGISTRATION_STATUS, REQUEST_STATUS } from '../../core/actions'
import { REGISTER_BACKEND_URL } from '../../core/constants'

export const uploadDocumentAction = (file, type, fileType, userPAN) => (publicAxios, dispatch) => {
  dispatch({ type: REGISTER_DUCK.UPLOADING_DOCS })
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', fileType)
  formData.append('owner_id', userPAN)
  formData.append('document_source', 'REGISTER')
  console.log('Uploading document', type)

  publicAxios(REGISTER_BACKEND_URL)
    .post('/api/v1/documents', formData)
    .then(({ data }) => {
      dispatch({
        type: REGISTER_DUCK.FILE_UPLOAD,
        payload: { documents: { [type]: { id: data?.id, size: file.size } } },
      })
    })
    .catch(error => {
      console.log('Document upload error', error)
      dispatch({
        type: REGISTER_DUCK.FILE_UPLOAD,
        payload: { documentsUploadStatus: REQUEST_STATUS.FAILURE },
      })
    })
}

export const registerAction = data => (publicAxios, dispatch) => {
  dispatch({ type: REGISTER_DUCK.REGISTER_PENDING })
  publicAxios(REGISTER_BACKEND_URL)
    .post('/api/v1/financiers', { financier: data })
    .then(() => {
      dispatch({ type: REGISTER_DUCK.REGISTER_SUCCESS })
    })
    .catch(error => {
      dispatch({
        type: REGISTER_DUCK.REGISTER_FAILURE,
        payload: {
          reason: error ? (Object.values(error)[0][0] ? Object.values(error)[0][0] : error) : 'Recheck all details',
        },
      })
    })
}

export const RegisterInitialState = {
  // { name: 'RAAJESH', email: 'adsf@sdf.co' }
  values: {},
  // {size: '', }
  documents: {},
  reason: '',
  documentsUploadStatus: REQUEST_STATUS.IDLE,
  // {name: {status: SUCCESS/FAILURE, value: ''}}
  message: {},
  accountType: '',
  registrationStatus: REGISTRATION_STATUS.IDLE,
}

export const RegisterReducer = (state, { type, payload }) => {
  switch (type) {
    case REGISTER_DUCK.VALUES_CHANGE:
      return { ...state, values: { ...state.values, ...payload.values } }
    case REGISTER_DUCK.DOC_CHANGE:
      return {
        ...state,
        documents: { ...state.documents, ...payload.documents },
        message: { ...state.message, ...payload.message },
      }
    case REGISTER_DUCK.MESSAGE_CHANGE:
      return { ...state, message: { ...state.message, ...payload.message } }
    case REGISTER_DUCK.FILE_UPLOAD:
      return {
        ...state,
        documents: { ...state.documents, ...payload.documents },
        documentsUploadStatus: payload.documentsUploadStatus,
      }
    case REGISTER_DUCK.UPLOADING_DOCS:
      return { ...state, registrationStatus: REGISTRATION_STATUS.UPLOADING_DOCUMENTS }
    case REGISTER_DUCK.ACCOUNT_TYPE:
      return { ...state, accountType: payload.accountType }
    case REGISTER_DUCK.REGISTER_PENDING:
      return { ...state, registrationStatus: REGISTRATION_STATUS.PENDING }
    case REGISTER_DUCK.REGISTER_FAILURE:
      return { ...state, reason: payload.reason, registrationStatus: REGISTRATION_STATUS.REGISTRATION_FAILURE }
    case REGISTER_DUCK.REGISTER_SUCCESS:
      return { ...RegisterInitialState, registrationStatus: REGISTRATION_STATUS.REGISTRATION_SUCCESS }
    default:
      return state
  }
}
