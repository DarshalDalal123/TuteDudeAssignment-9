import { useFetch } from "../../hooks/useFetch";
import DataTable from "react-data-table-component"

export const VisitorList = () => {
  const { data: visitorData, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/admin/getAllVisitors`, {
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
      <h2 className="text-2xl font-bold mb-4">Visitor List</h2>
      <div>
        <DataTable columns={columns} data={visitorData.visitors} customStyles={customStyles}/>
      </div>
    </div>
  )
}