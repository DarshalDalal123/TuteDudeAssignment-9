import { useFetch } from "../../hooks/useFetch";

export const EmployeeDashboard = () => {
  const { data: dashboardStats, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/employee/dashboard-stats`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <h1 className='text-3xl font-bold mb-4'>Your Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <div className='bg-white shadow rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'>Cancelled Approvals</h2>
          <p className='text-2xl font-bold'>{dashboardStats.stats.cancelledAppointments}</p>
        </div>
        <div className='bg-white shadow rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'>Pending Approvals</h2>
          <p className='text-2xl font-bold'>{dashboardStats.stats.pendingApprovals}</p>
        </div>
        <div className='bg-white shadow rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'>Approved Appointments</h2>
          <p className='text-2xl font-bold'>{dashboardStats.stats.approvedAppointments}</p>
        </div>
        <div className='bg-white shadow rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'>Today's Scheduled Appointments</h2>
          <p className='text-2xl font-bold'>{dashboardStats.stats.todayApprovedAppointments}</p>
        </div>
        <div className='bg-white shadow rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'>Completed Appointments</h2>
          <p className='text-2xl font-bold'>{dashboardStats.stats.completedAppointments}</p>
        </div>
      </div>
    </div>
  )
}