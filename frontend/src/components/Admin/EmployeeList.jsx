import { Link } from 'react-router-dom'
import { useState } from 'react'
import { CommonDataTable } from "../Common/CommonDataTable";
import { useFetch } from '../../hooks/useFetch';
import { NameEmailFilter } from '../Common/NameEmailFilter';

export const EmployeeList = () => {
  const [filters, setFilters] = useState({ name: '', email: '' })

  const query = new URLSearchParams({
    ...(filters.name && { name: filters.name }),
    ...(filters.email && { email: filters.email })
  }).toString()

  const endpoint = `${import.meta.env.VITE_API_URL}/api/users/allemployees${query ? `?${query}` : ''}`

  const { data: employeeData, error, loading } = useFetch(endpoint, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  const employees = employeeData?.employees || []

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
      name: "Department",
      selector: row => row.department,
    },
    {
      name: "Phone",
      selector: row => row.phone,
    }
  ];
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Department", key: "department" },
    { label: "Phone", key: "phone" }
  ]
  return (
    <div>
      <h1 className='font-bold text-3xl'>Employee List</h1>
      <div className='flex flex-row justify-end my-5'>
        <NameEmailFilter getFilterValues={setFilters} />
        <Link to='/admin/employees/add' className='bg-green-500 text-white py-2 px-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer rounded-xl'>
          Add Employee
        </Link>
      </div>
      <div>
        <CommonDataTable
          columns={columns}
          data={employees}
          showExportButton={true}
          csvData={employees}
          csvHeaders={csvHeaders}
          csvFilename="employees.csv"
        />
      </div>
    </div>
  )
}