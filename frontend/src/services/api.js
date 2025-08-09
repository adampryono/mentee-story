import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const login = (credentials) => api.post('/login', credentials)
export const getCurrentUser = () => api.get('/me')

// Mentor
export const getMentorMentees = () => api.get('/mentor/mentees')
export const createReport = (data) => api.post('/mentor/reports', data)
export const getMentorReports = () => api.get('/mentor/reports')
export const getReportDetail = (id) => api.get(`/mentor/reports/${id}`)

// Admin
export const getAllMentors = () => api.get('/admin/mentors')
export const createMentor = (data) => api.post('/admin/mentors', data)
export const getAllMentees = () => api.get('/admin/mentees')
export const createMentee = (data) => api.post('/admin/mentees', data)
export const getAllTopics = () => api.get('/topics')
export const createTopic = (data) => api.post('/admin/topics', data)
export const updateTopic = (id, data) => api.put(`/admin/topics/${id}`, data)
export const deleteTopic = (id) => api.delete(`/admin/topics/${id}`)
export const getAllReports = () => api.get('/admin/reports')

export default api
