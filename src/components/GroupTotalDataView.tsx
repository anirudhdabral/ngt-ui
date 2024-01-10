import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
type Props = {
  recordList: any;
  sumData: any;
  recordName: string;
};
export const GroupTotalDataView = (props: Props) => {
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  useEffect(() => {
    if (props.recordList) {
      const data = props.recordList[0];
      let columns: GridColDef[] = [];
      columns.push({
        field: "content",
        headerName: "",
        headerClassName: "fs-6 text-decoration-underline",
        width: 150,
      });
      for (const item of data.values) {
        columns.push({
          field: item.element,
          headerName: item.element,
          headerClassName: "fs-6 text-decoration-underline",
        });
      }
      setColumns(columns);
    }
  }, [props.recordList]);

  useEffect(() => {
    if (props.sumData) {
      let rows = [];
      let id = 0;
      const obj = props.sumData.groupedTotalByTimeframe[props.recordName];
      for (const item of Object.keys(obj)) {
        let row: any = {};
        row["id"] = id;
        row["content"] = item+ " Total";
        for (const timeframe of Object.keys(obj[item])) {
          row[timeframe] = obj[item][timeframe].toFixed(2);
        }
        rows.push(row);
        id += 1;
      }
      const newObj = props.sumData.recordNameTotalByTimeframe[props.recordName];

      let row: any = {};
        row["id"] = id+1;
        row["content"] = props.recordName+" Total";
        for (const timeframe of Object.keys(newObj)) {
          row[timeframe] = newObj[timeframe].toFixed(2);
        }
        rows.push(row);
      setRows(rows);
    }
  }, [props.sumData]);
  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        checkboxSelection
      />
    </>
  );
};
