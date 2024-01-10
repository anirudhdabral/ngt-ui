import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

type Props = {
  sumData: any;
};
export const GrandTotalDataView = (props: Props) => {
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  useEffect(() => {
    if (props.sumData) {
      const grandTotal = props.sumData.grandTotalByTimeframe;
      let columns = [];
      for (const item of Object.keys(grandTotal)) {
        columns.push({
          field: item,
          headerName: item,
          headerClassName: "fs-6 text-decoration-underline",
        });
      }
      let rows = [];
      let row: any = {};
      row["id"] = 0;
      for (const item of Object.keys(grandTotal)) {
        row[item] = grandTotal[item].toFixed(2);
      }
      rows.push(row);
      setColumns(columns);
      setRows(rows);
    }
  }, [props.sumData]);
  return (
    <>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 1 },
          },
        }}
        checkboxSelection
      />
    </>
  );
};
