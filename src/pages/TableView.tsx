import { useState, useEffect } from "react";
import { Table, Offcanvas, Button, Modal } from "react-bootstrap";
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

  useEffect(() => {
    getAllRecordNames();
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
    console.log(data);
  }, [data]);

  const [showCanvas, setShowCanvas] = useState<boolean>(false);
  const [canvasItem, setCanvasItem] = useState<"ADD" | "EDIT">("ADD");
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleAddClick = () => {
    setCanvasItem("ADD");
    setShowCanvas(true);
    setShowModal(false);
  };

  const handleEditClick = (id: number) => {
    setCanvasItem("EDIT");
    setShowCanvas(true);
  };

  const handleClose = () => {
    setShowCanvas(false);
  };

  return (
    <>
      <div className="d-flex justify-content-center m-3 p-3 mt-5 pt-5">
        <div className="w-100">
          <div className="d-flex justify-content-between mb-3">
            <h4>Table name</h4>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => setShowModal(true)}
            >
              Add
            </button>
          </div>
          {data.map((record: any, index: number) => (
            <div key={index}>
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
                    <tr key={index} onClick={(e) => handleEditClick(row.id)} style={{cursor:'pointer'}}>
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
            </div>
          ))}
        </div>
      </div>
      <Offcanvas
        backdrop="static"
        show={showCanvas}
        onHide={handleClose}
        placement="end"
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
      <Modal
        backdrop="static"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton style={{ border: "none" }}></Modal.Header>
        <Modal.Body className="p-0">
          <h4 className="text-center">What do you want to add?</h4>
          <div className="d-flex justify-content-center  mb-5">
            <button
              className="btn btn-primary mx-2 mt-4"
              onClick={handleAddClick}
            >
              Add Record
            </button>
            <button className="btn btn-primary mx-2 mt-4">Add Timeframe</button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
