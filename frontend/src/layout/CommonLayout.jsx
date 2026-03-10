import { Navbar } from '../components/Common/Navbar'
import { Link, Outlet } from 'react-router-dom'

export const CommonLayout = () => {
  return (
    <>
      <Navbar />
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-6">
          <Outlet />
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 min-h-full p-4 w-50 gap-3">
            <li className={`${window.location.pathname === '/admin/dashboard' ? 'bg-gray-300' : ''} rounded-lg`}><Link to="/admin/dashboard" className='py-3'>Dashboard</Link></li>
            <li className={`${window.location.pathname.startsWith('/admin/employees') ? 'bg-gray-300' : ''} rounded-lg`}><Link to="/admin/employees" className='py-3'>Employees</Link></li>
            <li className={`${window.location.pathname.startsWith('/admin/visitors') ? 'bg-gray-300' : ''} rounded-lg`}><Link to="/admin/visitors" className='py-3'>Visitors</Link></li>
          </ul>
        </div>
      </div>
    </>
  )
}