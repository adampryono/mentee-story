import { useState, useEffect } from 'react'
import { getAllMentors, getAllMentees, getAllTopics, getAllReports } from '../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    mentors: 0,
    mentees: 0,
    topics: 0,
    reports: 0
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchStats()
  }, [])
  
  const fetchStats = async () => {
    try {
      const [mentorsRes, menteesRes, topicsRes, reportsRes] = await Promise.all([
        getAllMentors(),
        getAllMentees(),
        getAllTopics(),
        getAllReports()
      ])
      
      // Debug logs
      console.log('Mentors response:', mentorsRes)
      console.log('Mentees response:', menteesRes)
      console.log('Topics response:', topicsRes)
      console.log('Reports response:', reportsRes)
      
      // Handle different response structures
      const mentorsData = Array.isArray(mentorsRes.data) ? mentorsRes.data : (mentorsRes.data?.data || [])
      const menteesData = Array.isArray(menteesRes.data) ? menteesRes.data : (menteesRes.data?.data || [])
      const topicsData = Array.isArray(topicsRes.data) ? topicsRes.data : (topicsRes.data?.data || topicsRes.data?.topics || [])
      const reportsData = Array.isArray(reportsRes.data) ? reportsRes.data : (reportsRes.data?.data || [])
      
      setStats({
        mentors: mentorsData.length || 0,
        mentees: menteesData.length || 0,
        topics: topicsData.length || 0,
        reports: reportsData.length || 0
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat dashboard...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
        <p className="text-blue-100">Kelola sistem dan pantau statistik platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Mentor</h3>
          <p className="text-3xl font-bold text-primary">{stats.mentors}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Mentee</h3>
          <p className="text-3xl font-bold text-primary">{stats.mentees}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Topik</h3>
          <p className="text-3xl font-bold text-primary">{stats.topics}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Report</h3>
          <p className="text-3xl font-bold text-primary">{stats.reports}</p>
        </div>
      </div>
    </div>
  )
}
