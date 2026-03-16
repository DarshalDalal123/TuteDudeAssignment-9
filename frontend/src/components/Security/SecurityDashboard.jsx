import { useFetch } from "../../hooks/useFetch";
import { Ticket } from "lucide-react";

export const SecurityDashboard = () => {
  const { data: dashboardValues, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/security/dashboard`, {
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
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Security Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <div className='bg-white shadow rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'><Ticket/>Total Active Passes</h2>
          <p className='text-2xl font-bold'>{dashboardValues.stats.activePasses}</p>
        </div>
        <div className='bg-white shadow rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'><Ticket/>Currently Checked-in Visitors</h2>
          <p className='text-2xl font-bold'>{dashboardValues.stats.currentyCheckedInVisitors}</p>
        </div>
        <div className='bg-white shadow rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'><Ticket/>Total Check-ins Today</h2>
          <p className='text-2xl font-bold'>{dashboardValues.stats.totalCheckInsToday}</p>
        </div>
        <div className='bg-white shadow rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-2 flex flex-col lg:flex-row lg:items-center gap-2'><Ticket/>Total Check-outs Today</h2>
          <p className='text-2xl font-bold'>{dashboardValues.stats.totalCheckOutsToday}</p>
        </div>
      </div>
    </div>
  )
}