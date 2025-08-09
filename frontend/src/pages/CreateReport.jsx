import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getAllTopics, createReport, getMentorMentees } from '../services/api'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'

export default function CreateReport() {
  const { menteeId } = useParams()
  const navigate = useNavigate()
  const [mentee, setMentee] = useState(null)
  const [topics, setTopics] = useState([])
  const [week, setWeek] = useState('')
  const [selectedTopicId, setSelectedTopicId] = useState('')
  const [challenge, setChallenge] = useState('')
  const [progressStatus, setProgressStatus] = useState('on_track')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = async () => {
    try {
      const [topicsRes, menteesRes] = await Promise.all([
        getAllTopics(),
        getMentorMentees()
      ])
      
      console.log('Topics response:', topicsRes) // Debug log
      console.log('Mentees response:', menteesRes) // Debug log
      
      // Handle different response structures for topics
      let topicsData = [];
      if (topicsRes && topicsRes.data) {
        if (Array.isArray(topicsRes.data)) {
          topicsData = topicsRes.data;
        } else if (topicsRes.data.data && Array.isArray(topicsRes.data.data)) {
          topicsData = topicsRes.data.data;
        } else if (topicsRes.data.topics && Array.isArray(topicsRes.data.topics)) {
          topicsData = topicsRes.data.topics;
        }
      }
      
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
      
      console.log('Final topics data:', topicsData) // Debug log
      console.log('Final mentees data:', menteesData) // Debug log
      
      setTopics(topicsData)
      const currentMentee = menteesData.find(m => m.id === parseInt(menteeId))
      setMentee(currentMentee)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Gagal memuat data')
    }
  }
  
  const handleSubmit = async (isDraft = false) => {
    if (!week) {
      toast.error('Minggu ke-berapa harus diisi')
      return
    }
    
    if (!selectedTopicId) {
      toast.error('Pilih topik terlebih dahulu')
      return
    }
    
    setLoading(true)
    try {
      const reportData = {
        mentee_id: parseInt(menteeId),
        week: parseInt(week),
        is_draft: isDraft,
        status: isDraft ? 'draft' : 'submitted', // Tambahkan juga status untuk kompatibilitas
        report_details: [{
          topic_id: parseInt(selectedTopicId),
          challenge: challenge || '',
          progress_status: progressStatus
        }]
      }
      
      console.log('Sending report data:', reportData)
      console.log('Progress status being sent:', progressStatus)
      console.log('Is draft?:', isDraft)
      console.log('Expected status:', isDraft ? 'draft' : 'submitted')
      
      const response = await createReport(reportData)
      console.log('Create report response:', response)
      
      // Cek apakah response mengembalikan data yang benar
      if (response && response.data) {
        console.log('Created report data:', response.data)
      }
      
      toast.success(isDraft ? 'Draft berhasil disimpan' : 'Report berhasil dikirim')
      navigate('/reports')
    } catch (error) {
      console.error('Error submitting report:', error)
      console.error('Error response:', error.response)
      toast.error(`Gagal menyimpan report: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  const topicOptions = [
    { value: '', label: 'Pilih Topik' },
    ...topics.map(t => ({ value: t.id.toString(), label: t.title }))
  ]
  
  const statusOptions = [
    { value: 'on_track', label: 'On Track' },
    { value: 'need_attention', label: 'Butuh Perhatian' },
    { value: 'behind', label: 'Tertinggal' }
  ]
  
  if (!mentee) return <div>Loading...</div>
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Buat Report Mingguan</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Mentee: {mentee.name}</h2>
        </div>
        
        <Input
          label="Minggu ke-"
          type="number"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          placeholder="1"
          min="1"
        />
        
        <Select
          label="Topik"
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          options={topicOptions}
          required
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kendala Belajar
          </label>
          <textarea
            className="input-field"
            rows="3"
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="Deskripsikan kendala yang dihadapi mentee..."
          />
        </div>
        
        <Select
          label="Status Progress"
          value={progressStatus}
          onChange={(e) => setProgressStatus(e.target.value)}
          options={statusOptions}
        />
        
        <div className="flex gap-4 mt-6 pt-2">
          <Button
            onClick={() => handleSubmit(true)}
            variant="secondary"
            disabled={loading}
            className="px-6 py-3 text-base min-w-[140px] bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
          >
            Simpan Draft
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="px-6 py-3 text-base min-w-[140px] bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            Submit Report
          </Button>
        </div>
      </div>
    </div>
  )
}
