import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import App from './App.jsx'

// Import pages
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import StaffDashboard from './pages/staff/StaffDashboard.jsx'
import WardenDashboard from './pages/warden/WardenDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

// Create router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      {/* Landing Page */}
      <Route path='' element={<LandingPage />} />
      
      {/* Login Routes */}
      <Route path='login/student' element={<Login role="student" />} />
      <Route path='login/staff' element={<Login role="staff" />} />
      <Route path='login/warden' element={<Login role="warden" />} />
      <Route path='login/admin' element={<Login role="admin" />} />
      
      {/* Dashboard Routes */}
      <Route path='student/dashboard' element={<StudentDashboard />} />
      <Route path='staff/dashboard' element={<StaffDashboard />} />
      <Route path='warden/dashboard' element={<WardenDashboard />} />
      <Route path='admin/dashboard' element={<AdminDashboard />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)