import { useState, useEffect } from 'react'
import api from '../api/api'

export function useFetch(endpoint) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(endpoint)
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [endpoint])

  return { data, loading, error }
}
