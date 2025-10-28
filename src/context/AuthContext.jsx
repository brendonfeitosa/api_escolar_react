import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Carrega usuário do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('username')
    const savedToken = localStorage.getItem('authToken')

    if (savedUser && savedToken) {
      api.defaults.headers.Authorization = `Basic ${savedToken}`
      setUser({ username: savedUser })
    }
  }, [])

  // Faz login e salva o token base64
  async function login(username, password) {
    try {
      const token = btoa(`${username}:${password}`)
      localStorage.setItem('authToken', token)
      localStorage.setItem('username', username)

      //api.defaults.headers.Authorization = `Basic ${token}`
      setUser({ username })

      navigate('/')
    } catch (err) {
      alert('Erro ao tentar logar. Verifique usuário e senha.')
    }
  }

  function logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
