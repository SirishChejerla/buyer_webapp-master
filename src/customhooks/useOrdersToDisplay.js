import { useEffect, useState } from 'react'
import { useAxios } from '../core/AxiosContext'
import { useGlobal, useGlobalDispatch } from '../core/GlobalContext'
import { fetchFinancierAction } from '../routes/financier/FinancierDuck'
import { fetchPortfolioAction } from '../routes/portfolio/PortfolioDuck'
import jsonParse from '../utils/jsonapi'
import { portfolioParser } from '../utils/portfolio/portfolioParsers'

const useOrdersToDisplay = (pageNumber, portfolioType) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [orders, setOrders] = useState([])
  const [hasMore, setHasMore] = useState(false)

  const { authAxios } = useAxios()
  const {
    financierState: { financier },
  } = useGlobal()
  const { financierDispatch } = useGlobalDispatch()

  // Custom IndexOf function similar to ==
  const myIndexOf = (arr, o) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].dealTransactionCode == o.dealTransactionCode) {
        return i
      }
    }
    return -1
  }

  useEffect(() => {
    setOrders([])
    setHasMore(false)
    setLoading(true)
  }, [portfolioType])

  const fetchOrdersToDisplay = (controller, pageNumber) => {
    const params = {
      // Logic of resetting and incrementing nextPage is done in Duck
      page: pageNumber,
      financier_id: financier?.financierPAN,
      state: portfolioType,
      search: '',
      order_by: 'created_at',
    }
    fetchPortfolioAction(params, controller)(authAxios)(res => {
      const apiResponse = jsonParse(res).data
      const meta = res.meta
      const parsedData = apiResponse?.map(portfolio => portfolioParser(portfolio))
      setOrders(prevItems => prevItems.concat(parsedData.filter(item => myIndexOf(prevItems, item) < 0)))
      setHasMore(Boolean(meta?.next))

      setLoading(false)
    }, setError(true))
  }

  useEffect(() => {
    // Fetch Financier Data, Initially
    fetchFinancierAction()(authAxios, financierDispatch)
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(false)
    const controller = new AbortController()
    fetchOrdersToDisplay(controller, pageNumber)

    return () => {
      controller.abort()
    }
  }, [financier, pageNumber, portfolioType])

  return { orders, hasMore, loading, error }
}

export default useOrdersToDisplay
