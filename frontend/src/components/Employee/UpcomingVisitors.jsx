import { useFetch } from '../../hooks/useFetch';
import DataTable from "react-data-table-component"
import { formatVisitTime } from '../../utils/time';

export const UpcomingVisitors = () => {
  const { data: upcomingVisitorsData, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/employee/upcoming-visitors`, {
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
  const columns = [
    {
      name: "Name",
      selector: row => row.visitorId.name,
      sortable: true
    },
    {
      name: "Email",
      selector: row => row.visitorId.email,
    },
    {
      name: "Phone",
      selector: row => row.visitorId.phone,
    },
    {
      name: "Visit Date",
      selector: row => new Date(row.visitDate).toLocaleString().split(',')[0],
      sortable: true
    },
    {
      name: "Visit Time",
      selector: row => {
        return formatVisitTime(row.visitTime);
      },
    },
    {
      name: "Purpose",
      selector: row => row.purpose,
    },
    {
      name: "Status",
      selector: row => row.status.charAt(0).toUpperCase() + row.status.slice(1),
    }
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upcoming Visitors</h2>
      <div>
        <DataTable columns={columns} data={upcomingVisitorsData.upcomingAppointments} />
      </div>
    </div>
  )
}