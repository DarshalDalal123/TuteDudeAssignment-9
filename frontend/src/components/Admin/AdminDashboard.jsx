import { LayoutDashboard, Users, Calendar, Shield, User } from "lucide-react";
import { useFetch } from '../../hooks/useFetch';

export const AdminDashboard = () => {
  const { data: dashboardStats, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard-stats`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!dashboardStats) {
    return <div>No data available</div>;
  }
  return (
    <>
      <div>
        <h1 className='text-3xl font-bold mb-4'>Admin Dashboard</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          <div className='bg-white shadow rounded-lg p-4'>
            <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'><Users/>Total Visitors</h2>
            <p className='text-2xl font-bold'>{dashboardStats.stats.totalVisitors}</p>
          </div>
          <div className='bg-white shadow rounded-lg p-4'>
            <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'><User/>Total Employees</h2>
            <p className='text-2xl font-bold'>{dashboardStats.stats.totalEmployees}</p>
          </div>
          <div className='bg-white shadow rounded-lg p-4'>
            <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'><Shield/>Total Security Guards</h2>
            <p className='text-2xl font-bold'>{dashboardStats.stats.totalSecurityGuards}</p>
          </div>
          <div className='bg-white shadow rounded-lg p-4'>
            <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'><Calendar/>Total Appointments</h2>
            <p className='text-2xl font-bold'>{dashboardStats.stats.totalAppointments}</p>
          </div>
        </div>
      </div>
    </>
  )
}