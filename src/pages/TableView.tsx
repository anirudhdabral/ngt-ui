import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import axios from "axios";
import { useEffect, useState } from "react";
import { Accordion, Modal, Offcanvas, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { AddRecord } from "../components/AddRecord";
import { AddRecordTimeframe } from "../components/AddRecordTimeframe";
import { DataView } from "../components/DataView";
import { EditRecord } from "../components/EditRecord";
import { BASE_URL } from "../env";

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
    await axios
      .get(BASE_URL + "/recordName/" + recordName)
      .then((response) => {
        const recordData = {
          recordName: recordName,
          recordList: response.data,
        };
        setData((prev: any) => [...prev, recordData]);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const getSumData = async () => {
    await axios
      .get(BASE_URL + "/getForecastedResults")
      .then((response) => {
        setSumData(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
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

  const handleAddTimeframeCallback = () => {
    setShowModal(false);
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
          <Accordion defaultActiveKey="0" className="mb-4" alwaysOpen>
            {data.map((record: any, index: number) => (
              <Accordion.Item
                eventKey={record.recordName}
                key={index}
                className="record-accordion"
              >
                <Accordion.Header>{record.recordName}</Accordion.Header>
                <Accordion.Body>
                  <DataView data={record} callback={handleEditClick} />
                  <Table bordered hover>
                    <thead className="table-dark">
                      <tr>
                        <th colSpan={record.recordList[0].fields?.length}></th>

                        {record.recordList[0].values?.map(
                          (field: any, index: number) => (
                            <th key={index}>{field.element}</th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {sumData &&
                        Object.keys(
                          sumData.groupedTotalByTimeframe[record.recordName]
                        ).map((group, index) => {
                          const ob =
                            sumData.groupedTotalByTimeframe[record.recordName];
                          return (
                            <tr key={index} className="table-info">
                              <td
                                colSpan={
                                  Object.keys(record.recordList[0].fields)
                                    .length
                                }
                              >
                                Total By Group: {group}
                              </td>
                              {Object.keys(ob[group]).map(
                                (timeframe, index) => (
                                  <td>{ob[group][timeframe].toFixed(2)}</td>
                                )
                              )}
                            </tr>
                          );
                        })}
                      <tr className="table-info">
                        <td
                          colSpan={
                            Object.keys(record.recordList[0].fields).length
                          }
                        >
                          Record Total
                        </td>
                        {sumData &&
                          Object.keys(
                            sumData.recordNameTotalByTimeframe[
                              record.recordName
                            ]
                          ).map((timeframe, index) => {
                            const ob =
                              sumData.recordNameTotalByTimeframe[
                                record.recordName
                              ];
                            return <td>{ob[timeframe].toFixed(2)}</td>;
                          })}
                      </tr>
                    </tbody>
                  </Table>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddTimeframe(record.recordName)}
                  >
                    Add a new Timeframe for "{record.recordName}"
                  </button>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
          <Table bordered>
            <thead className="table-success">
              <tr>
                {sumData && (
                  <th
                    colSpan={Object.keys(sumData.grandTotalByTimeframe).length}
                    className="text-center"
                  >
                    Grand Total by Timeframe
                  </th>
                )}
              </tr>
              <tr>
                {sumData &&
                  Object.keys(sumData.grandTotalByTimeframe).map(
                    (year, index) => <th>{year}</th>
                  )}
              </tr>
            </thead>
            <tbody>
              <tr>
                {sumData &&
                  Object.keys(sumData.grandTotalByTimeframe).map(
                    (year, index) => (
                      <td>{sumData.grandTotalByTimeframe[year].toFixed(2)}</td>
                    )
                  )}
              </tr>
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
            callback={handleAddTimeframeCallback}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
