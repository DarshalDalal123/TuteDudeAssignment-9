import { useFetch } from '../../hooks/useFetch';
import DataTable from "react-data-table-component"
import { ChangeStatusModal } from './ChangeStatusModal';
import { formatVisitTime } from '../../utils/time';
import { useState } from 'react';

export const VisitorRequestList = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: visitorRequestsData, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/employee/getAllVisitors?refresh=${refreshKey}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  const handleStatusChange = () => {
    // Trigger a refetch by incrementing the refresh key
    setRefreshKey(prev => prev + 1);
  };

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
    },
    {
      name: "Actions",
      cell: row => (
        row.status === 'pending' ? (
          <ChangeStatusModal
            appointmentId={row._id}
            visitorName={row.visitorId.name}
            visitorEmail={row.visitorId.email}
            visitDate={row.visitDate}
            visitTime={row.visitTime}
            currentStatus={row.status}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <span className="text-gray-500">No actions available</span>
        )
      ),
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