import { useEffect, useState } from 'react'
import { useAxios } from '../core/AxiosContext'
import { fetchDealsToDisplayAction } from '../routes/deals/DealsDuck'
import jsonParse from '../utils/jsonapi'

const useDealsToDisplay = (query, pageNumber, dealFetchType) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [deals, setDeals] = useState([])
  const [hasMore, setHasMore] = useState(false)

  const { authAxios } = useAxios()

  // Custom IndexOf function similar to ==
  const myIndexOf = (arr, o) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == o.id) {
        return i
      }
    }
    return -1
  }

  const fetchDealsToDisplay = (controller, pageNumber, query) =>
    fetchDealsToDisplayAction(dealFetchType, { page: pageNumber, search: query }, controller)(authAxios)(res => {
      const apiResponse = jsonParse(res).data
      const meta = res.meta
      setDeals(prevItems => prevItems.concat(apiResponse.filter(item => myIndexOf(prevItems, item) < 0)))
      setHasMore(Boolean(meta?.next))

      setLoading(false)
    }, setError(true))

  useEffect(() => {
    setDeals([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    const controller = new AbortController()
    fetchDealsToDisplay(controller, pageNumber, query)

    return () => {
      controller.abort()
    }
  }, [pageNumber, dealFetchType, query])

  return { deals, hasMore, loading, error }
}

export default useDealsToDisplay
