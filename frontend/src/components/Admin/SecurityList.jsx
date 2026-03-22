import { useFetch } from '../../hooks/useFetch';
import { Link } from 'react-router-dom'
import { CommonDataTable } from "../Common/CommonDataTable";

export const SecurityList = () => {
  const { data: securities, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/security/getAllSecurities`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
    }
  ]
  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
  ]
  return (
    <div>
      <h1 className='font-bold text-3xl'>Security List</h1>
      <div className='flex flex-row justify-end my-5'>
        <Link to='/admin/security/add' className='bg-green-500 text-white py-2 px-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer rounded-xl'>
          Add Security
        </Link>
      </div>
      <div>
        <CommonDataTable
          columns={columns}
          data={securities.securities}
          showExportButton={true}
          csvData={securities.securities}
          csvHeaders={csvHeaders}
          csvFilename="securities.csv"
        />
      </div>
    </div>
  )
}