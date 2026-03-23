import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { CommonDataTable } from "../Common/CommonDataTable";
import { NameEmailFilter } from "../Common/NameEmailFilter";

export const VisitorList = () => {
  const [filters, setFilters] = useState({ name: '', email: '', fromDate: null, toDate: null });
  
  const query = new URLSearchParams({
      ...(filters.name && { name: filters.name }),
      ...(filters.email && { email: filters.email }),
      ...(filters.fromDate && filters.toDate && { fromDate: filters.fromDate.toISOString(), toDate: filters.toDate.toISOString() })
    }).toString()

  const endpoint = `${import.meta.env.VITE_API_URL}/api/admin/getAllVisitors${query ? `?${query}` : ''}`

  const { data: visitorData, loading, error } = useFetch(endpoint, {
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
      selector: row => row.name,
      sortable: true
    },
    {
      name: "Email",
      selector: row => row.email,
    },
    {
      name: "Phone",
      selector: row => row.phone,
    },
    {
      name: "Photo",
      selector: row => row.photo ? <img src={row.photo} alt={row.name} className="h-14 w-14 object-cover rounded-full" /> : "No Photo",
      center: true
    }
  ]
  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Photo", key: "photo" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Visitor List</h2>
      <div className="flex justify-end mb-4">
        <NameEmailFilter getFilterValues={setFilters} />
      </div>
      <div>
        <CommonDataTable
          columns={columns}
          data={visitorData.visitors}
          showExportButton={true}
          csvData={visitorData.visitors}
          csvHeaders={csvHeaders}
          csvFilename="visitors.csv"
        />
      </div>
    </div>
  )
}