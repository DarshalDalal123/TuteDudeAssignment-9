import './App.css'
import { Routes, Route, useLocation } from "react-router-dom"
import { CommonLayout } from './layout/CommonLayout'
import { Home } from './components/Common/Home'
import { AdminDashboard } from './components/Admin/AdminDashboard'
import { Login } from './components/Auth/Login'
import { VisitorPreRegistration } from './components/Visitor/VisitorPreRegistration'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from './hooks/useUserContext'
import { EmployeeList } from './components/Admin/EmployeeList'
import { AddEmployeeForm } from './components/Admin/AddEmployeeForm'
import { VisitorList } from './components/Admin/VisitorList'

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useUserContext();

  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem('token');
    if (!token) {
      if (location.pathname !== '/login' && location.pathname !== '/' && location.pathname !== '/visitor/pre-registration') {
        navigate('/login');
      }
      return;
    }
    
    if (user?.role === 'admin' && (location.pathname === '/' || location.pathname === '/login')) {
      navigate('/admin/dashboard');
    }
  }, [loading, user, location.pathname, navigate]);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/visitor/pre-registration' element={<VisitorPreRegistration />} />
      <Route element={<CommonLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<EmployeeList />} />
        <Route path="/admin/employees/add" element={<AddEmployeeForm />} />
        <Route path="/admin/visitors" element={<VisitorList />} />
      </Route>
    </Routes>
  )
}

export default App