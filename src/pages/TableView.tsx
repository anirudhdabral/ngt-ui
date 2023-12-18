import { useState } from "react";
import { Table, Offcanvas, Button } from "react-bootstrap";
import { AddRecord } from "../components/AddRecord";
import { EditRecord } from "../components/EditRecord";

export const TableView = () => {
  const [showCanvas, setShowCanvas] = useState<boolean>(false);
  const [canvasItem, setCanvasItem] = useState<"ADD" | "EDIT">("ADD");

  const handleAddClick = () => {
    setCanvasItem("ADD");
    setShowCanvas(true);
  };

  const handleEditClick = () => {
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
              onClick={handleAddClick}
            >
              Add
            </button>
          </div>
          <Table bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td colSpan={2}>Larry the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
      <Offcanvas show={showCanvas} onHide={handleClose} placement="end">
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
