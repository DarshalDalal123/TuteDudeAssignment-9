import { useFetch } from "../../hooks/useFetch";
import DataTableComponent from "react-data-table-component";
import { formatUTCTimeToLocal } from "../../utils/time";

export const VisitorCheckLogs = () => {
  const { data: visitCheckLogs, loading, error } = useFetch(`${import.meta.env.VITE_API_URL}/api/security/visitCheckLog`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Visitor Check Logs</h2>
      <DataTableComponent
        columns={[
          {
            name: "Visitor Name",
            selector: (row) => row.passId?.appointmentId?.visitorId?.name || "N/A",
            sortable: true
          },
          {
            name: "Check-in Time",
            selector: (row) => formatUTCTimeToLocal(row.checkInTime)
          },
          {
            name: "Check-out Time",
            selector: (row) => formatUTCTimeToLocal(row.checkOutTime)
          }
        ]}
        data={visitCheckLogs.checkLogs}
      />
    </div>
  )
}