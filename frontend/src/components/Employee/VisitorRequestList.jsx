import { useFetch } from '../../hooks/useFetch';
import { CommonDataTable } from "../Common/CommonDataTable";
import { ChangeStatusModal } from './ChangeStatusModal';
import { formatVisitTime } from '../../utils/time';
import { useState } from 'react';
import { NameEmailFilter } from '../Common/NameEmailFilter';

export const VisitorRequestList = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState({ name: '', email: '' })
  const query = new URLSearchParams({
    ...(filters.name && { name: filters.name }),
    ...(filters.email && { email: filters.email })
  }).toString();

  const endpoint = `${import.meta.env.VITE_API_URL}/api/employee/getAllVisitors${query ? `?${query}&` : '?'}refresh=${refreshKey}`;
  const { data: visitorRequestsData, loading, error } = useFetch(endpoint, {
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
            visitorPhoto={row.visitorId.photo}
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
  const csvHeaders = [
    { label: "Name", key: "visitorId.name" },
    { label: "Email", key: "visitorId.email" },
    { label: "Phone", key: "visitorId.phone" },
    { label: "Visit Date", key: "visitDate" },
    { label: "Visit Time", key: "visitTime" },
    { label: "Purpose", key: "purpose" },
    { label: "Status", key: "status" }
  ]
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Visitor Requests</h2>
      <div className="mb-4 flex justify-end">
        <NameEmailFilter getFilterValues={setFilters} />
      </div>
      <div>
        <CommonDataTable
          columns={columns}
          data={visitorRequestsData.appointments}
          showExportButton={true}
          csvData={visitorRequestsData.appointments}
          csvHeaders={csvHeaders}
          csvFilename="visitors.csv"
        />
      </div>
    </div>
  )
}