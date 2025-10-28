import axios from 'axios'

// 🚀 Se a variável de ambiente não estiver definida, assume o localhost
const baseURL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

const api = axios.create({ baseURL })

// 🔐 Interceptor: adiciona o token Basic em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Basic ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
