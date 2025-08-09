import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getAllMentors, createMentor } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import Table from '../components/Table'

export default function ManageMentors() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  
  useEffect(() => {
    fetchMentors()
  }, [])
  
  const fetchMentors = async () => {
    try {
      const response = await getAllMentors()
      setMentors(response.data)
    } catch (error) {
      toast.error('Gagal memuat data mentor')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createMentor(formData)
      toast.success('Mentor berhasil ditambahkan')
      setFormData({ name: '', email: '', password: '' })
      setShowForm(false)
      fetchMentors()
    } catch (error) {
      toast.error('Gagal menambahkan mentor')
    }
  }
  
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'created_at', label: 'Tanggal Dibuat', render: (date) => new Date(date).toLocaleDateString('id-ID') }
  ]
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat data mentor...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Kelola Mentor</h1>
        <p className="text-blue-100">Tambah dan kelola data mentor dalam sistem</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="bg-blue-100 text-primary px-4 py-2 rounded-lg text-sm font-medium">
          Total: {mentors.length} Mentor
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 px-6 py-3 text-base"
        >
          {showForm ? 'Batal' : '+ Tambah Mentor'}
        </Button>
      </div>
      
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Tambah Mentor Baru</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 px-8 py-3 text-base min-w-[120px]"
              >
                Simpan
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200 px-8 py-3 text-base min-w-[120px]"
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {mentors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Belum Ada Mentor</h3>
            <p className="text-gray-500">Tambahkan mentor baru untuk memulai</p>
          </div>
        ) : (
          <Table columns={columns} data={mentors} />
        )}
      </div>
    </div>
  )
}
