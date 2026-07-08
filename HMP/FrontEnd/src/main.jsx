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
import StudentHomeStats from './pages/student/StudentHomeStats'
import StudentProfile from './pages/student/StudentProfile'
import StudentComplaints from './pages/student/StudentComplaints'
import FileComplaint from './pages/student/FileComplaint'
import WardenHomeStats from './pages/warden/WardenHomeStats'
import StudentList from './pages/warden/StudentList'
import StudentDetail from './pages/warden/StudentDetail'
import StaffList from './pages/warden/StaffList'
import RegisterStaff from './pages/warden/RegisterStaff'
import WardenComplaints from './pages/warden/WardenComplaints'
import WardenProfile from './pages/warden/WardenProfile'
import StudentNotices from './pages/student/StudentNotices';
import WardenNotices from './pages/warden/WardenNotices';
import CreateNotice from './pages/warden/CreateNotice';
import WardenGraphs from './pages/warden/WardenGraphs.jsx';

const ADMIN_ROLES = ["admin", "superAdmin"];
const SUPER_ONLY = ["superAdmin"];

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<LandingPage />} />

      {/* Single Dynamic Login Route - supports all roles */}
      <Route path='login/:role' element={<Login />} />
      <Route path='forgot-password' element={<ForgotPassword />} />

      <Route
        path='staff/dashboard'
        element={
          <AuthLayout authentication={true} allowedRoles={["staff"]}>
            <StaffDashboard />
          </AuthLayout>
        }
      />
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
        <Route path="users/:userId" element={<UserDetails />} />
      </Route>
      <Route
        path="warden/dashboard"
        element={
          <AuthLayout authentication={true} allowedRoles={["warden"]}>
            <WardenDashboard />
          </AuthLayout>
        }
      >
        <Route index element={<WardenHomeStats />} />
        <Route path="students" element={<StudentList />} />
        <Route path="students/:studentId" element={<StudentDetail />} />
        <Route path="staff" element={<StaffList />} />
        <Route path="create-staff" element={<RegisterStaff />} />
        <Route path="complaints" element={<WardenComplaints />} />
        <Route path="notices" element={<WardenNotices />} />
        <Route path="notices/create" element={<CreateNotice />} />
        <Route path="profile" element={<WardenProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="graphs" element={<WardenGraphs />} />
      </Route>


      <Route
        path="student/dashboard"
        element={
          <AuthLayout authentication={true} allowedRoles={["student"]}>
            <StudentDashboard />
          </AuthLayout>
        }
      >
        <Route index element={<StudentHomeStats />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="notices" element={<StudentNotices />} />
        <Route path="complaints/file-complaint" element={<FileComplaint />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);