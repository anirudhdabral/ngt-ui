import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
type Props = {
  data: any;
  callback: any;
};

export const DataView = (props: Props) => {
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);

  useEffect(() => {
    if (props.data?.recordList) {
      const data = props.data.recordList[0];
      let columns: GridColDef[] = [];
      for (const item of data.fields) {
        columns.push({
          field: item.element,
          headerName: item.element,
          headerClassName: "fs-6 text-decoration-underline",
          width: 150
        });
      }
      for (const item of data.values) {
        columns.push({
          field: item.element,
          headerName: item.element,
          headerClassName: "fs-6 text-decoration-underline",
        });
      }

      let rows = [];
      let id = 1;
      for (const record of props.data.recordList) {
        let row: any = {};
        row["id"] = record.id;
        for (const item of record.fields) {
          row[item.element] = item.value;
        }
        for (const item of record.values) {
          row[item.element] = item.value.toFixed(2);
        }
        rows.push(row);
        id += 1;
      }
      setColumns(columns);
      setRows(rows);
    }
  }, [props.data]);

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    props.callback(Number(params.row.id));
  };

  return (
    <div className="w-100 mb-3">
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        onRowClick={handleRowClick}
        checkboxSelection
      />
    </div>
  );
};
