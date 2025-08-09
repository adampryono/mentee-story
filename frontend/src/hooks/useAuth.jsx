import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getCurrentUser()
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token')
          navigate('/login')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [navigate])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    setUser(userData)
    
    // Navigate based on user role with small delay to ensure state is updated
    setTimeout(() => {
      if (userData.role === 'admin') {
        navigate('/admin')
      } else if (userData.role === 'mentor') {
        navigate('/mentor-dashboard')
      } else {
        navigate('/dashboard')
      }
    }, 100)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
