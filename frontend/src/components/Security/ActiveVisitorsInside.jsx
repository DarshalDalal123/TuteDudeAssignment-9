import { useFetch } from '../../hooks/useFetch';
import DataTable from "react-data-table-component"
import { formatUTCTimeToLocal } from '../../utils/time';

export const ActiveVisitorsInside = () => {
  const { data: visitorsInsideData, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/security/getAllVisitorsInside`, {
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
      <h1 className='text-2xl font-bold mb-4'>Active Visitors Inside</h1>
      <DataTable
        columns={[
          {
            name: 'Name',
            selector: row => row.passId.appointmentId.visitorId.name,
            sortable: true
          },
          {
            name: 'Email',
            selector: row => row.passId.appointmentId.visitorId.email
          },
          {
            name: 'Phone',
            selector: row => row.passId.appointmentId.visitorId.phone
          },
          {
            name: 'Check In Time',
            selector: row => formatUTCTimeToLocal(row.checkInTime),
            sortable: true
          }
        ]}
        data={visitorsInsideData?.visitorsInside || []}
      />
    </div>
  )
}