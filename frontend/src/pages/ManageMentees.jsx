import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getAllMentees, createMentee, getAllMentors } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Table from '../components/Table'

export default function ManageMentees() {
  const [mentees, setMentees] = useState([])
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    mentor_id: ''
  })
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = async () => {
    try {
      const [menteesRes, mentorsRes] = await Promise.all([
        getAllMentees(),
        getAllMentors()
      ])
      
      console.log('Mentees response:', menteesRes) // Debug log
      console.log('Mentors response:', mentorsRes) // Debug log
      
      // Handle different response structures for mentees
      let menteesData = [];
      if (menteesRes && menteesRes.data) {
        if (Array.isArray(menteesRes.data)) {
          menteesData = menteesRes.data;
        } else if (menteesRes.data.data && Array.isArray(menteesRes.data.data)) {
          menteesData = menteesRes.data.data;
        } else if (menteesRes.data.mentees && Array.isArray(menteesRes.data.mentees)) {
          menteesData = menteesRes.data.mentees;
        }
      }
      
      // Handle different response structures for mentors
      let mentorsData = [];
      if (mentorsRes && mentorsRes.data) {
        if (Array.isArray(mentorsRes.data)) {
          mentorsData = mentorsRes.data;
        } else if (mentorsRes.data.data && Array.isArray(mentorsRes.data.data)) {
          mentorsData = mentorsRes.data.data;
        } else if (mentorsRes.data.mentors && Array.isArray(mentorsRes.data.mentors)) {
          mentorsData = mentorsRes.data.mentors;
        }
      }
      
      console.log('Final mentees data:', menteesData) // Debug log
      console.log('Final mentors data:', mentorsData) // Debug log
      
      setMentees(menteesData)
      setMentors(mentorsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createMentee({
        name: formData.name,
        mentor_id: parseInt(formData.mentor_id)
      })
      toast.success('Mentee berhasil ditambahkan')
      setFormData({ name: '', mentor_id: '' })
      setShowForm(false)
      fetchData()
    } catch (error) {
      toast.error('Gagal menambahkan mentee')
    }
  }
  
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nama' },
    { key: 'mentor', label: 'Mentor', render: (mentor) => mentor?.name || '-' },
    { key: 'created_at', label: 'Tanggal Dibuat', render: (date) => new Date(date).toLocaleDateString('id-ID') }
  ]
  
  const mentorOptions = [
    { value: '', label: 'Pilih Mentor' },
    ...mentors.map(m => ({ value: m.id.toString(), label: m.name }))
  ]
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat data mentee...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Kelola Mentee</h1>
        <p className="text-blue-100">Tambah dan kelola data mentee dalam sistem</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="bg-blue-100 text-primary px-4 py-2 rounded-lg text-sm font-medium">
          Total: {mentees.length} Mentee
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 px-6 py-3 text-base"
        >
          {showForm ? 'Batal' : '+ Tambah Mentee'}
        </Button>
      </div>
      
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Tambah Mentee Baru</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Select
              label="Mentor"
              value={formData.mentor_id}
              onChange={(e) => setFormData({...formData, mentor_id: e.target.value})}
              options={mentorOptions}
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
        {mentees.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Belum Ada Mentee</h3>
            <p className="text-gray-500">Tambahkan mentee baru untuk memulai</p>
          </div>
        ) : (
          <Table columns={columns} data={mentees} />
        )}
      </div>
    </div>
  )
}
