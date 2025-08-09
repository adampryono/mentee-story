import { useState, useEffect } from 'react'
import { getMentorReports } from '../services/api'
import Table from '../components/Table'

export default function ReportHistory() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)
  
  useEffect(() => {
    fetchReports()
  }, [])
  
  const fetchReports = async () => {
    try {
      const response = await getMentorReports()
      console.log('Full response:', response) // Debug log
      console.log('Response data:', response.data) // Debug log
      console.log('Response data type:', typeof response.data) // Debug log
      console.log('Is array?', Array.isArray(response.data)) // Debug log
      
      // Handle different response structures
      let reportsData = [];
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          reportsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          reportsData = response.data.data;
        } else if (response.data.reports && Array.isArray(response.data.reports)) {
          reportsData = response.data.reports;
        }
      }
      
      console.log('Final reports data:', reportsData) // Debug log
      setReports(reportsData)
    } catch (error) {
      console.error('Failed to fetch reports:', error)
      console.error('Error details:', error.response?.data) // More detailed error log
      setReports([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }
  
  const columns = [
    { key: 'week', label: 'Minggu' },
    { key: 'mentee', label: 'Mentee', render: (mentee) => mentee?.name || 'Unknown' },
    { key: 'status', label: 'Status Report', render: (status) => (
      <span className={`px-2 py-1 rounded text-xs ${
        status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {status === 'submitted' ? 'Submitted' : 'Draft'}
      </span>
    )},
    { 
      key: 'report_details', 
      label: 'Progress Status', 
      render: (report_details) => {
        if (!Array.isArray(report_details) || report_details.length === 0) {
          return <span className="text-gray-500">No data</span>;
        }
        const detail = report_details[0]; // Ambil detail pertama
        let statusLabel = 'On Track';
        let statusClass = 'bg-green-100 text-green-800';
        
        if (detail.progress_status === 'need_attention') {
          statusLabel = 'Butuh Perhatian';
          statusClass = 'bg-yellow-100 text-yellow-800';
        } else if (detail.progress_status === 'behind') {
          statusLabel = 'Tertinggal';
          statusClass = 'bg-red-100 text-red-800';
        }
        
        return (
          <span className={`px-2 py-1 rounded text-xs ${statusClass}`}>
            {statusLabel}
          </span>
        );
      }
    },
    { key: 'created_at', label: 'Tanggal', render: (date) => {
      try {
        return new Date(date).toLocaleDateString('id-ID')
      } catch (e) {
        return 'Invalid Date'
      }
    }}
  ]
  
  const actions = (row) => (
    <button
      onClick={() => setSelectedReport(row)}
      className="text-primary hover:underline px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium text-sm"
    >
      Detail
    </button>
  )
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat riwayat report...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Riwayat Report</h1>
        <p className="text-blue-100">Lihat dan kelola riwayat laporan mentee</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Belum Ada Report</h3>
            <p className="text-gray-500">Mulai buat report untuk mentee Anda</p>
          </div>
        ) : (
          <Table columns={columns} data={reports} actions={actions} />
        )}
      </div>
      
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Detail Report</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Mentee</p>
                  <p className="font-medium">{selectedReport.mentee?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Minggu ke-</p>
                  <p className="font-medium">{selectedReport.week}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status Report</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    selectedReport.status === 'submitted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedReport.status === 'submitted' ? 'Submitted' : 'Draft'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Dibuat</p>
                  <p className="font-medium">
                    {new Date(selectedReport.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Detail Pembelajaran</h3>
              <div className="space-y-4">
                {selectedReport.report_details && selectedReport.report_details.map((detail, index) => (
                  <div key={detail.id || index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Topik</p>
                      <p className="font-medium">{detail.topic?.title || 'Topic tidak ditemukan'}</p>
                   
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Kendala Belajar</p>
                      <p className="text-gray-800">{detail.challenge || 'Tidak ada kendala'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status Progress</p>
                      <span className={`inline-block px-3 py-1 rounded text-sm ${
                        detail.progress_status === 'on_track' 
                          ? 'bg-green-100 text-green-800' 
                          : detail.progress_status === 'need_attention' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : detail.progress_status === 'behind' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {detail.progress_status === 'on_track' ? '✓ On Track' :
                         detail.progress_status === 'need_attention' ? '⚠ Butuh Perhatian' :
                         detail.progress_status === 'behind' ? '⚠ Tertinggal' :
                         'Tidak ada status'}
                      </span>
                    </div>
                  </div>
                ))}
                
                {(!selectedReport.report_details || selectedReport.report_details.length === 0) && (
                  <p className="text-gray-500 text-center py-4">Tidak ada detail pembelajaran</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedReport(null)}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 px-6 py-3 text-base min-w-[120px]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
