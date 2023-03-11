import { message as Toast } from 'antd'
import { useAxios } from '../core/AxiosContext'
import { TRADECRED_ASSET_LOGO } from '../core/constants'
import { useGlobalDispatch } from '../core/GlobalContext'
import { fetchFinancierAction, fetchMBASignUrlAction } from '../routes/financier/FinancierDuck'

const useMBASign = () => {
  const { authAxios } = useAxios()
  const { financierDispatch } = useGlobalDispatch()

  const leegalitySign = mbaSignUrl => {
    const leegalityObj = {
      logoUrl: TRADECRED_ASSET_LOGO,
      callback: resp => {
        if ('error' in resp) {
          Toast.error(`MBA Signing Error — ${resp['error'] || 'Unknown'}`)
        } else {
          Toast.success(`Your MBA Signing is successful! You can start purchasing deals in few minutes.`)
          setTimeout(() => {
            fetchFinancierAction()(authAxios, financierDispatch)
          }, 5000)
        }
      },
    }

    const leegality = new window.Leegality(leegalityObj)
    leegality.init()
    leegality.esign(mbaSignUrl)
  }

  const mbaSign = () => {
    fetchMBASignUrlAction(authAxios)(leegalitySign)
  }

  return { mbaSign }
}

export default useMBASign
