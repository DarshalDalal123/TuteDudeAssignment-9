import { useFetch } from '../../hooks/useFetch';
import { CommonDataTable } from "../Common/CommonDataTable";
import { formatVisitTime } from '../../utils/time';
import { NameEmailFilter } from '../Common/NameEmailFilter';
import { useState } from 'react';

export const UpcomingVisitors = () => {
  const endpoint = `${import.meta.env.VITE_API_URL}/api/employee/upcoming-visitors`;
  const { data: upcomingVisitorsData, loading, error } = useFetch(endpoint, {
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

  const csvHeaders = [
    { label: "Name", key: "visitorId.name" },
    { label: "Email", key: "visitorId.email" },
    { label: "Phone", key: "visitorId.phone" },
    { label: "Visit Date", key: "visitDate" },
    { label: "Visit Time", key: "visitTime" },
    { label: "Purpose", key: "purpose" },
    { label: "Status", key: "status" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upcoming Visitors</h2>
      <div>
        <CommonDataTable
          columns={columns}
          data={upcomingVisitorsData.upcomingAppointments}
          showExportButton={true}
          csvData={upcomingVisitorsData.upcomingAppointments}
          csvHeaders={csvHeaders}
          csvFilename="upcoming-visitors.csv"
        />
      </div>
    </div>
  )
}