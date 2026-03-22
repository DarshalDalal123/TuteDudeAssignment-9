import { useFetch } from '../../hooks/useFetch';
import { CommonDataTable } from "../Common/CommonDataTable";
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
  const csvHeaders = [
    { label: "Name", key: "passId.appointmentId.visitorId.name" },
    { label: "Email", key: "passId.appointmentId.visitorId.email" },
    { label: "Phone", key: "passId.appointmentId.visitorId.phone" },
    { label: "Check In Time", key: "checkInTime" },
  ];
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Active Visitors Inside</h1>
      <CommonDataTable
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
        showExportButton={true}
        csvData={visitorsInsideData?.visitorsInside}
        csvHeaders={csvHeaders}
        csvFilename="activeVisitorsInside.csv"
        data={visitorsInsideData?.visitorsInside || []}
      />
    </div>
  )
}