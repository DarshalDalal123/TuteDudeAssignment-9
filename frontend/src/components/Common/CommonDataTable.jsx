import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";

const defaultCustomStyles = {
  headCells: {
    style: {
      paddingTop: "8px",
      paddingBottom: "8px",
    },
  },
  cells: {
    style: {
      paddingTop: "8px",
      paddingBottom: "8px",
    },
  },
};

export const CommonDataTable = ({
  columns,
  data,
  customStyles = defaultCustomStyles,
  showExportButton = false,
  csvData = [],
  csvHeaders,
  csvFilename = "data.csv",
}) => {
  return (
    <div>
      {showExportButton && (
        <div className="mb-4 flex justify-end">
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={csvFilename}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Export CSV
          </CSVLink>
        </div>
      )}
      <DataTable columns={columns} data={data} customStyles={customStyles} />
    </div>
  );
};
