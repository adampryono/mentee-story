import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login as apiLogin } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await apiLogin({ email, password })
      login(response.data.token, response.data.user)
      toast.success('Login berhasil!')
    } catch (error) {
      toast.error('Email atau password salah')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          {/* Logo Ruangguru */}
          <div className="mb-6 flex justify-center">
            <img 
              src="/src/assets/images/Ruangguru_logo.svg" 
              alt="Ruangguru Logo" 
              className="h-12 w-auto"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-primary mb-2">Mentee Story</h1>
          <p className="text-gray-600">by Ruangguru</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="mentor@mentee.com"
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          
          <Button 
            type="submit" 
            className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memuat...
              </div>
            ) : (
              'Masuk'
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-sm text-gray-600">
          <p>Akun demo:</p>
          <p>Admin: admin@mentee.com / password123</p>
          <p>Mentor: mentor1@mentee.com / password123</p>
        </div>
      </div>
    </div>
  )
}
