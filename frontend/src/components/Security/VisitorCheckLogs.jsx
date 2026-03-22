import { useFetch } from "../../hooks/useFetch";
import { CommonDataTable } from "../Common/CommonDataTable";
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
  const csvHeaders = [
    { label: "Visitor Name", key: "passId.appointmentId.visitorId.name" },
    { label: "Check-in Time", key: "checkInTime" },
    { label: "Check-out Time", key: "checkOutTime" },
  ];
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Visitor Check Logs</h2>
      <CommonDataTable
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
            selector: (row) => (
              row.checkOutTime ? formatUTCTimeToLocal(row.checkOutTime) : "N/A"
            )
          }
        ]}
        data={visitCheckLogs.checkLogs}
        showExportButton={true}
        csvData={visitCheckLogs.checkLogs}
        csvHeaders={csvHeaders}
        csvFilename="visitCheckLogs.csv"
      />
    </div>
  )
}