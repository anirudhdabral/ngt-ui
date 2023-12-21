import { useState, useEffect } from "react";
import { Table, Offcanvas, Button, Modal, Accordion } from "react-bootstrap";
import { AddRecord } from "../components/AddRecord";
import { EditRecord } from "../components/EditRecord";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import axios from "axios";
import { BASE_URL } from "../env";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";

export const TableView = () => {
  const [data, setData] = useState<any>([]);
  const [sumData, setSumData] = useState<any>();

  const getAllRecordNames = async () => {
    await axios.get(BASE_URL + "/recordNames").then((response) => {
      for (const item of response.data) {
        getAllByRecordNames(item);
      }
    });
  };

  const getAllByRecordNames = async (recordName: string) => {
    await axios.get(BASE_URL + "/recordName/" + recordName).then((response) => {
      const recordData = { recordName: recordName, recordList: response.data };
      setData((prev: any) => [...prev, recordData]);
    });
  };

  const getSumData = async () => {
    await axios.get(BASE_URL + "/getForcastedResults").then((response) => {
      setSumData(response.data);
      console.log(response.data);
    });
  };

  useEffect(() => {
    getAllRecordNames();
    getSumData();
  }, []);

  const hasDuplicates = () => {
    const uniqueRecordNames = new Set();
    for (const item of data) {
      if (uniqueRecordNames.has(item.recordName)) {
        return true;
      }
      uniqueRecordNames.add(item.recordName);
    }
    return false;
  };

  useEffect(() => {
    if (hasDuplicates()) {
      const uniqueData = data.filter((item: any, index: any, array: any) => {
        return (
          array.findIndex((i: any) => i.recordName === item.recordName) ===
          index
        );
      });
      setData(uniqueData);
    }
  }, [data]);

  const [showCanvas, setShowCanvas] = useState<boolean>(false);
  const [canvasItem, setCanvasItem] = useState<"ADD" | "EDIT">("ADD");
  const handleAddClick = () => {
    setCanvasItem("ADD");
    setShowCanvas(true);
  };

  const handleEditClick = (id: number) => {
    setCanvasItem("EDIT");
    setShowCanvas(true);
  };

  const handleClose = () => {
    setShowCanvas(false);
  };
  useEffect(() => {
    // console.log(sumData.grandTotalByTimeframe);
  });

  return (
    <>
      <div className="d-flex justify-content-center m-3 p-3 mt-5 pt-5">
        <div className="w-100">
          <div className="d-flex justify-content-between mb-3">
            <h4>Table name</h4>
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleAddClick}
            >
              Add Record
            </button>
          </div>
          {data.map((record: any, index: number) => (
            <div key={index} className="record-details">
              <div>
                <TextField
                  label="Record Name"
                  id="outlined-size-small"
                  value={record.recordName}
                  size="small"
                  className="mb-2"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <button className="btn btn-primary mx-2">Add Timeframe</button>
              </div>
              <Table bordered hover>
                <thead className="table-dark">
                  <tr>
                    {record.recordList[0].fields?.map(
                      (field: any, index: number) => (
                        <th key={index}>{field.element}</th>
                      )
                    )}
                    {record.recordList[0].values?.map(
                      (field: any, index: number) => (
                        <th key={index}>{field.element}</th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {record.recordList?.map((row: any, index: number) => (
                    <tr
                      key={index}
                      onClick={(e) => handleEditClick(row.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {row.fields?.map((field: any, index: number) => (
                        <td key={index}>{field.value}</td>
                      ))}
                      {row.values?.map((field: any, index: number) => (
                        <td key={index}>{field.value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    Grouped Total by Timeframe
                  </Accordion.Header>
                  <Accordion.Body className="p-0">
                    <Table bordered className="mb-0">
                      <thead className="table-info ">
                        <tr>
                          <th>Group</th>
                          <th>Timeframe</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sumData &&
                          Object.keys(
                            sumData.groupedTotalByTimeframe[record.recordName]
                          ).map((group, index) => {
                            const ob =
                              sumData.groupedTotalByTimeframe[
                                record.recordName
                              ];
                            return Object.keys(ob[group]).map(
                              (timeframe, index) => (
                                <tr key={index}>
                                  <td>{group}</td>
                                  <td>{timeframe}</td>
                                  <td>{ob[group][timeframe]}</td>
                                </tr>
                              )
                            );
                          })}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Record Total by Timeframe</Accordion.Header>
                  <Accordion.Body className="p-0">
                    <Table bordered className="mb-0">
                      <thead className="table-info ">
                        <tr>
                          <th>Timeframe</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sumData &&
                          Object.keys(
                            sumData.recordNameTotalByTimeframe[
                              record.recordName
                            ]
                          ).map((timeframe, index) => {
                            const obj =
                              sumData.recordNameTotalByTimeframe[
                                record.recordName
                              ];
                            return (
                              <tr key={index}>
                                <td>{timeframe}</td>
                                <td>{obj[timeframe]}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          ))}
          <Table bordered>
            <thead className="table-success">
              <tr>
                <th colSpan={2} className="text-center">
                  Grand Total by Timeframe
                </th>
              </tr>
              <tr>
                <th>Timeframe</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {sumData &&
                Object.keys(sumData.grandTotalByTimeframe).map(
                  (year, index) => (
                    <tr key={index}>
                      <td>{year}</td>
                      <td>{sumData.grandTotalByTimeframe[year]}</td>
                    </tr>
                  )
                )}
            </tbody>
          </Table>
        </div>
      </div>
      <Offcanvas
        backdrop="static"
        show={showCanvas}
        onHide={handleClose}
        placement={canvasItem === "ADD" ? "end" : "start"}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {canvasItem === "ADD" ? "Add Record" : "Edit Record"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {canvasItem === "ADD" ? <AddRecord /> : <EditRecord />}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
