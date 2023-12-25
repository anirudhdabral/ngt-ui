import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import axios from "axios";
import { useEffect, useState } from "react";
import { Accordion, Modal, Offcanvas, Table } from "react-bootstrap";
import { AddRecord } from "../components/AddRecord";
import { AddRecordTimeframe } from "../components/AddRecordTimeframe";
import { EditRecord } from "../components/EditRecord";
import { BASE_URL } from "../env";
import { DataView } from "../components/DataView";

export const TableView = () => {
  const [showCanvas, setShowCanvas] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [canvasItem, setCanvasItem] = useState<"ADD" | "EDIT">("ADD");
  const [data, setData] = useState<any>([]);
  const [sumData, setSumData] = useState<any>();

  const [actionId, setActionId] = useState<number>(-1);
  const [actionRecordName, setActionRecordName] = useState<string>("");

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

  const handleAddClick = () => {
    setCanvasItem("ADD");
    setShowCanvas(true);
  };

  const handleEditClick = (id: number) => {
    setCanvasItem("EDIT");
    setShowCanvas(true);
    setActionId(id);
  };

  const handleClose = () => {
    setShowCanvas(false);
  };

  const handleAddTimeframe = (recordName: string) => {
    setActionRecordName(recordName);
    setShowModal(true);
  };

  const handleRecordChangeCallback = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="d-flex justify-content-center m-3 p-3">
        <div className="w-100">
          <div className="d-flex justify-content-between mb-3">
            <h4>Record List</h4>
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleAddClick}
            >
              Add Record
            </button>
          </div>
          <Accordion defaultActiveKey="0" className="mb-4">
            {data.map((record: any, index: number) => (
              <Accordion.Item
                eventKey={record.recordName}
                key={index}
                className="record-accordion"
              >
                <Accordion.Header>{record.recordName}</Accordion.Header>
                <Accordion.Body>
                  <DataView data={record} callback={handleEditClick} />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddTimeframe(record.recordName)}
                  >
                    Add a new Timeframe
                  </button>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
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
          {canvasItem === "ADD" ? (
            <AddRecord callback={handleRecordChangeCallback} />
          ) : (
            <EditRecord id={actionId} callback={handleRecordChangeCallback} />
          )}
        </Offcanvas.Body>
      </Offcanvas>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ border: "none" }}>
          <Modal.Title>Add Timeframe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddRecordTimeframe
            recordName={actionRecordName}
            callback={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
