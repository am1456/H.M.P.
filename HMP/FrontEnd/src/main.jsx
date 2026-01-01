import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import App from './App.jsx'


import AuthLayout from './AuthLayout.jsx'

import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import StaffDashboard from './pages/staff/StaffDashboard.jsx'
import WardenDashboard from './pages/warden/WardenDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ForgotPassword from './pages/ForgotPassword'
import AdminHomeStats from './pages/admin/AdminHomeStats'
import AddStudentForm from './pages/admin/AddStudent'

import { Provider } from 'react-redux'
import { store } from './store/store.js'
import AddWarden from './pages/admin/AddWarden'
import AddHostel from './pages/admin/AddHostel'
import AddRooms from './pages/admin/AddRooms'
import SearchUsers from './pages/admin/SearchUsers'
import InviteAdmin from './pages/admin/InviteAdmin'
import UpdateAccount from './pages/admin/UpdateAccount'
import UserDetails from './pages/admin/UserDetails.jsx'
import ChangePassword from './pages/ChangePassword'



const ADMIN_ROLES = ["admin", "superAdmin"];
const SUPER_ONLY = ["superAdmin"]

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<LandingPage />} />

      {/* Login Routes */}
      <Route path='login/student' element={<Login role="student" />} />
      <Route path='login/staff' element={<Login role="staff" />} />
      <Route path='login/warden' element={<Login role="warden" />} />
      <Route path='login/admin' element={<Login role="admin" />} />
      <Route path='forgot-password' element={<ForgotPassword />} />

      {/* Other Dashboard Routes */}
      <Route path='student/dashboard' element={<StudentDashboard />} />
      <Route path='staff/dashboard' element={<StaffDashboard />} />
      <Route path='warden/dashboard' element={<WardenDashboard />} />

      {/* Admin Dashboard with NESTED Routes */}
      <Route
        path="admin/dashboard"
        element={
          <AuthLayout authentication={true} allowedRoles={ADMIN_ROLES}>
            <AdminDashboard />
          </AuthLayout>
        }
      >
        <Route index element={<AdminHomeStats />} />
        <Route path="update-account" element={<UpdateAccount />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="add-student" element={<AddStudentForm />} />
        <Route path="add-warden" element={<AddWarden />} />
        <Route path="add-hostel" element={<AddHostel />} />
        <Route path="add-rooms" element={<AddRooms />} />
        <Route
          path="invite-admin"
          element={
            <AuthLayout authentication={true} allowedRoles={SUPER_ONLY}>
              <InviteAdmin />
            </AuthLayout>

          } />
        <Route path="search-user" element={<SearchUsers />} />
        <Route path="users/:userId" element={<UserDetails />}/>

      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)