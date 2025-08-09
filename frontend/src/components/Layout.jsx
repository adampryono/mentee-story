import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
// Import your logo image
import ruangguruLogo from '../assets/images/Ruangguru_logo.svg'

// Icon components (using simple SVGs)
const DashboardIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z" />
  </svg>
)

const ReportsIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const TopicsIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
)

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const BellIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

const LogoutIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  
  const isActive = (path) => location.pathname.startsWith(path)
  
  const mentorNavItems = [
    { path: '/mentor-dashboard', label: 'Dashboard', icon: DashboardIcon },
    { path: '/reports', label: 'Riwayat Report', icon: ReportsIcon }
  ]
  
  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: DashboardIcon },
    { path: '/admin/mentors', label: 'Kelola Mentor', icon: UsersIcon },
    { path: '/admin/mentees', label: 'Kelola Mentee', icon: UsersIcon },
    { path: '/admin/topics', label: 'Kelola Topik', icon: TopicsIcon },
    { path: '/admin/reports', label: 'Semua Report', icon: ReportsIcon }
  ]
  
  const navItems = user?.role === 'mentor' ? mentorNavItems : adminNavItems
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="w-full pl-4 pr-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and title - positioned at far left */}
            <div className="flex items-center">
              {/* Logo Image */}
              <div className="w-20 h-20 mr-5 flex items-center justify-center">
                <img 
                  src={ruangguruLogo} 
                  alt="Ruangguru Logo" 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent leading-tight">
                  Mentee Story
                </h1>
                <span className="text-sm text-gray-500 font-medium -mt-1">by Ruangguru</span>
              </div>
            </div>
            
       
            <div className="flex items-center space-x-4">
             
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-800">Halo, {user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <LogoutIcon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Keluar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <nav className="w-72 bg-white/60 backdrop-blur-sm shadow-xl border-r border-white/20 min-h-screen">
          <div className="p-6">
            <div className="mb-8">
              <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-xl p-4 border border-primary/20">
                <h3 className="font-semibold text-gray-800 mb-1">Selamat datang kembali!</h3>
                <p className="text-sm text-gray-600">Siap mengelola perjalanan mentoring Anda?</p>
              </div>
            </div>
            
            <ul className="space-y-3">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const active = item.path === '/admin' 
                  ? (isActive('/admin') && location.pathname === '/admin')
                  : isActive(item.path)
                
                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                        active 
                          ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg scale-105' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary/10 hover:to-blue-600/10 hover:text-primary hover:scale-102'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mr-3 ${active ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} />
                      <span className="font-medium">{item.label}</span>
                      {active && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 min-h-[calc(100vh-12rem)] p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
