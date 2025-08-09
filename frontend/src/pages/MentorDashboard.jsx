import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMentorMentees } from '../services/api'
import Button from '../components/Button'

export default function MentorDashboard() {
  const [mentees, setMentees] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchMentees()
  }, [])
  
  const fetchMentees = async () => {
    try {
      const response = await getMentorMentees()
      console.log('Mentees response:', response) // Debug log
      
      // Handle different response structures
      let menteesData = [];
      if (response && response.data) {
        if (response.data.data && Array.isArray(response.data.data)) {
          menteesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          menteesData = response.data;
        } else if (response.data.mentees && Array.isArray(response.data.mentees)) {
          menteesData = response.data.mentees;
        }
      }
      
      console.log('Final mentees data:', menteesData) // Debug log
      setMentees(menteesData)
    } catch (error) {
      console.error('Failed to fetch mentees:', error)
      setMentees([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat daftar mentee...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Dashboard Asisten Mentor</h1>
        <p className="text-blue-100">Kelola dan buat laporan untuk mentee Anda</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Daftar Mentee</h2>
          <div className="bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {mentees.length} Mentee
          </div>
        </div>
        
        {(!mentees || mentees.length === 0) ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Belum Ada Mentee</h3>
            <p className="text-gray-500">Belum ada mentee yang ditugaskan kepada Anda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(mentees) && mentees.map((mentee) => (
              <div key={mentee.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    {mentee.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg text-gray-800">{mentee.name}</h3>
                    <p className="text-sm text-gray-500">ID: {mentee.id}</p>
                  </div>
                </div>
                <Link to={`/create-report/${mentee.id}`}>
                  <Button className="w-full py-3 px-6 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px] text-base">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Buat Report
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
