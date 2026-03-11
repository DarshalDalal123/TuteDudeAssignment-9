import { useFetch } from '../../hooks/useFetch';
import DataTable from "react-data-table-component"

export const VisitorRequestList = () => {
  const { data: visitorRequestsData, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/employee/getAllVisitors`, {
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
        const [hours, minutes] = row.visitTime.split(":");
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      },
    },
    {
      name: "Purpose",
      selector: row => row.purpose,
    },
    {
      name: "Status",
      selector: row => row.status.charAt(0).toUpperCase() + row.status.slice(1),
    },
    {
      name: "Actions",
      cell: row => (
        <div>
          <button className="bg-green-500 text-white py-1 px-3 rounded-lg mr-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer">
            Change Status
          </button>
        </div>
      ),
      center: true,
      ignoreRowClick: true,
      button: true
    }
  ]
  const customStyles = {
    headCells: {
      style: {
        paddingTop: '8px',
        paddingBottom: '8px',
      },
    },
    cells: {
      style: {
        paddingTop: '8px',
        paddingBottom: '8px',
      },
    },
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Visitor Requests</h2>
      <div>
        <DataTable columns={columns} data={visitorRequestsData.appointments} customStyles={customStyles} />
      </div>
    </div>
  )
}