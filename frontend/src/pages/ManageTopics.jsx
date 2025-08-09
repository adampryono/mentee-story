import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getAllTopics, createTopic, updateTopic, deleteTopic } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import Table from '../components/Table'

export default function ManageTopics() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  
  useEffect(() => {
    fetchTopics()
  }, [])
  
  const fetchTopics = async () => {
    try {
      setLoading(true)
      const response = await getAllTopics()
      console.log('Full response:', response) // Debug log
      console.log('Response data:', response.data) // Debug log
      console.log('Response data type:', typeof response.data) // Debug log
      
      // Handle different response structures
      let topicsData = [];
      
      // Axios wraps response in data property
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          topicsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Handle case where backend returns { data: [...] }
          topicsData = response.data.data;
        } else if (response.data.topics && Array.isArray(response.data.topics)) {
          // Handle case where backend returns { topics: [...] }
          topicsData = response.data.topics;
        } else {
          console.error('Unexpected data structure:', response.data);
        }
      }
      
      console.log('Final topics data:', topicsData); // Debug log
      setTopics(topicsData);
    } catch (error) {
      console.error('Error fetching topics:', error)
      toast.error(`Gagal memuat data topik: ${error.message || 'Unknown error'}`)
      setTopics([])
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateTopic(editingId, formData)
        toast.success('Topik berhasil diperbarui')
      } else {
        await createTopic(formData)
        toast.success('Topik berhasil ditambahkan')
      }
      resetForm()
      fetchTopics()
    } catch (error) {
      toast.error('Gagal menyimpan topik')
    }
  }
  
  const handleEdit = (topic) => {
    setFormData({ title: topic.title, description: topic.description })
    setEditingId(topic.id)
    setShowForm(true)
  }
  
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus topik ini?')) {
      try {
        await deleteTopic(id)
        toast.success('Topik berhasil dihapus')
        fetchTopics()
      } catch (error) {
        toast.error('Gagal menghapus topik')
      }
    }
  }
  
  const resetForm = () => {
    setFormData({ title: '', description: '' })
    setEditingId(null)
    setShowForm(false)
  }
  
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Judul' },
    { key: 'description', label: 'Deskripsi' }
  ]
  
  const actions = (row) => (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => handleEdit(row)}>Edit</Button>
      <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>Hapus</Button>
    </div>
  )
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat data topik...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Kelola Topik</h1>
        <p className="text-blue-100">Tambah dan kelola topik pembelajaran</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="bg-blue-100 text-primary px-4 py-2 rounded-lg text-sm font-medium">
          Total: {topics.length} Topik
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 px-6 py-3 text-base"
        >
          {showForm ? 'Batal' : '+ Tambah Topik'}
        </Button>
      </div>
      
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {editingId ? 'Edit Topik' : 'Tambah Topik Baru'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Judul"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Masukkan deskripsi topik..."
              />
            </div>
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 px-8 py-3 text-base min-w-[120px]"
              >
                {editingId ? 'Perbarui' : 'Simpan'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200 px-8 py-3 text-base min-w-[120px]"
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Belum Ada Topik</h3>
            <p className="text-gray-500">Tambahkan topik pembelajaran untuk memulai</p>
          </div>
        ) : (
          <Table columns={columns} data={topics} actions={actions} />
        )}
      </div>
    </div>
  )
}
