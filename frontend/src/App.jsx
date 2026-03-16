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
import { EmployeeDashboard } from './components/Employee/EmployeeDashboard'
import { VisitorRequestList } from './components/Employee/VisitorRequestList'
import { UpcomingVisitors } from './components/Employee/UpcomingVisitors'
import { SecurityDashboard } from './components/Security/SecurityDashboard'
import { SecurityList } from './components/Admin/SecurityList'
import { AddSecurityForm } from './components/Admin/AddSecurityForm'
import { SecurityScanVisitor } from './components/Security/SecurityScanVisitor'
import { ActiveVisitorsInside } from './components/Security/ActiveVisitorsInside'
import { VisitorCheckLogs } from './components/Security/VisitorCheckLogs'

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
    } else if (user?.role === 'employee' && (location.pathname === '/' || location.pathname === '/login')) {
      navigate('/employee/dashboard');
    } else if (user?.role === 'security' && (location.pathname === '/' || location.pathname === '/login')) {
      navigate('/security/dashboard');
    }
  }, [loading, user, location.pathname, navigate]);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/visitor/pre-registration' element={<VisitorPreRegistration />} />
      <Route element={<CommonLayout />}>
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<EmployeeList />} />
        <Route path="/admin/employees/add" element={<AddEmployeeForm />} />
        <Route path="/admin/visitors" element={<VisitorList />} />
        <Route path="/admin/security" element={<SecurityList />} />
        <Route path="/admin/security/add" element={<AddSecurityForm />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/requests" element={<VisitorRequestList />} />
        <Route path="/employee/upcoming-visitors" element={<UpcomingVisitors />} />

        {/* Security Routes */}        
        <Route path='/security/dashboard' element={<SecurityDashboard />} />
        <Route path='/security/scan' element={<SecurityScanVisitor />} />
        <Route path='/security/visitors-inside' element={<ActiveVisitorsInside />} />
        <Route path='/security/logs' element={<VisitorCheckLogs />} />

        {/* 404 */}
        <Route path="*" element={<div>404</div>} />
      </Route>
    </Routes>
  )
}

export default App