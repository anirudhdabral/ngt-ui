import { TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { BASE_URL } from "../env";

type Props = {
  id: number;
  callback: any;
};
export const EditRecord = (props: Props) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [recordName, setRecordName] = useState<string>("");
  const [recordId, setRecordId] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [dimensions, setDimensions] = useState([{ element: "", value: "" }]);

  const [timeframes, setTimeframes] = useState([{ element: "", value: 0 }]);

  const getRecordDetails = async () => {
    await axios.get(BASE_URL + "/records/" + props.id).then((response) => {
      setRecordName(response.data.recordName);
      setDimensions(response.data.fields);
      setTimeframes(response.data.values);
      setRecordId(response.data.id);
    });
  };

  useEffect(() => {
    getRecordDetails();
  }, [props.id]);

  const handleDimensionNameChange = (e: any, index: number) => {
    let updatedDimensions = [...dimensions];
    updatedDimensions[index] = {
      ...updatedDimensions[index],
      element: e.target.value,
    };
    setDimensions(updatedDimensions);
  };

  const handleDimensionValueChange = (e: any, index: number) => {
    let updatedDimensions = [...dimensions];
    updatedDimensions[index] = {
      ...updatedDimensions[index],
      value: e.target.value,
    };
    setDimensions(updatedDimensions);
  };

  const handleTimeframeNameChange = (e: any, index: number) => {
    let updatedTimeframes = [...timeframes];
    updatedTimeframes[index] = {
      ...updatedTimeframes[index],
      element: e.target.value,
    };
    setTimeframes(updatedTimeframes);
  };

  const handleTimeframeValueChange = (e: any, index: number) => {
    let updatedTimeframes = [...timeframes];
    updatedTimeframes[index] = {
      ...updatedTimeframes[index],
      value: e.target.value,
    };
    setTimeframes(updatedTimeframes);
  };

  const handleTimeframeDefaultValue = (e: any, index: number) => {
    if (e.target.value.length == 0) {
      let updatedTimeframes = [...timeframes];
      updatedTimeframes[index] = {
        ...updatedTimeframes[index],
        value: 0,
      };
      setTimeframes(updatedTimeframes);
    }
  };
  const handleDeleteDimension = (index: number) => {
    const updatedDimensions = [
      ...dimensions.slice(0, index),
      ...dimensions.slice(index + 1),
    ];
    setDimensions(updatedDimensions);
  };
  const handleDeleteTimeframe = (index: number) => {
    const updatedTimeframes = [
      ...timeframes.slice(0, index),
      ...timeframes.slice(index + 1),
    ];
    setTimeframes(updatedTimeframes);
  };

  const handleAddDimension = () => {
    setDimensions([...dimensions, { element: "", value: "" }]);
  };

  const handleAddTimeframe = () => {
    setTimeframes([...timeframes, { element: "", value: 0 }]);
  };

  useEffect(() => {
    let invalidForm =
      dimensions.some(
        (dim) => dim.element.length === 0 || dim.value.length === 0
      ) ||
      timeframes.some((tim) => tim.element.length === 0) ||
      recordName.length == 0;
    setIsFormValid(!invalidForm);
  }, [dimensions, timeframes]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let record: any = {};
    record.id = recordId;
    record.recordName = recordName;
    record.fields = dimensions;
    record.values = timeframes;
    await axios.put(BASE_URL + "/updateRecord", record).then((response) => {
      props.callback();
    });
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    await axios.delete(BASE_URL + "/records/" + recordId).then((response) => {
      props.callback();
    });
  };

  return (
    <>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="4">
            Record Name
          </Form.Label>
          <Col sm="7">
            <Form.Control value={recordName} readOnly />
          </Col>
        </Form.Group>
        <hr />
        <div className="dimensions">
          <div className="mb-3">
            <small>Dimension Details</small>
          </div>
          {dimensions?.map((dimension: any, index: number) => (
            <Form.Group
              key={index}
              as={Row}
              className="mb-3"
              controlId="formPlaintextEmail"
            >
              <Col sm="5">
                <TextField
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  size="small"
                  value={dimension.element}
                  onChange={(e) => handleDimensionNameChange(e, index)}
                />
              </Col>
              <Col sm="5">
                <TextField
                  id="outlined-basic"
                  label="Value"
                  variant="outlined"
                  size="small"
                  value={dimension.value}
                  onChange={(e) => handleDimensionValueChange(e, index)}
                />
              </Col>
              <Col sm="2" className="d-flex align-items-center ">
                <Button
                  variant="danger"
                  size="sm"
                  disabled={dimensions.length == 1}
                  onClick={() => handleDeleteDimension(index)}
                >
                  X
                </Button>
              </Col>
            </Form.Group>
          ))}
          <div className="d-flex justify-content-end">
            <Button
              className="mx-3"
              variant="primary"
              size="sm"
              onClick={handleAddDimension}
            >
              +
            </Button>
          </div>
        </div>
        <hr />
        <div className="values">
          <div className="mb-3">
            <small>Timeframe Details</small>
          </div>
          {timeframes?.map((item: any, index: number) => (
            <Form.Group
              key={index}
              as={Row}
              className="mb-3"
              controlId="formPlaintextEmail"
            >
              <Col sm="5">
                <TextField
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  size="small"
                  value={item.element}
                  onChange={(e) => handleTimeframeNameChange(e, index)}
                />
              </Col>
              <Col sm="5">
                <TextField
                  id="outlined-basic"
                  label="Value"
                  variant="outlined"
                  size="small"
                  value={item.value}
                  onChange={(e) => handleTimeframeValueChange(e, index)}
                  onBlur={(e) => handleTimeframeDefaultValue(e, index)}
                />
              </Col>
              <Col sm="2" className="d-flex align-items-center">
                <Button
                  variant="danger"
                  size="sm"
                  disabled={timeframes.length == 1}
                  onClick={() => handleDeleteTimeframe(index)}
                >
                  X
                </Button>
              </Col>
            </Form.Group>
          ))}
          <div className="d-flex justify-content-end">
            <Button
              className="mx-3"
              variant="primary"
              size="sm"
              onClick={handleAddTimeframe}
            >
              +
            </Button>
          </div>
        </div>
        <hr />
        <div className="my-3">
          {!isFormValid && (
            <small className="text-danger" style={{ fontSize: 12 }}>
              Please fill all the required fields
            </small>
          )}
          <Button
            variant="success"
            className="w-100 my-1"
            disabled={!isFormValid}
            onClick={(e) => handleSubmit(e)}
          >
            Update
          </Button>
          <Button
            variant="danger"
            className="w-100 mb-1 mt-3"
            onClick={() => setShowModal(true)}
          >
            Delete Record
          </Button>
        </div>
      </Form>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ border: "none" }}>
          <Modal.Title>Delete Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <span className="text-center" style={{ fontSize: 17.5 }}>
              Are you sure you want to delete this record?
            </span>
          </div>
          <div className="d-flex justify-content-center my-2 mt-4">
            <button
              className="btn btn-danger mx-3 px-5"
              onClick={(e) => handleDelete(e)}
            >
              Delete
            </button>
            <button
              className="btn btn-secondary mx-3 px-5"
              onClick={() => props.callback()}
            >
              Cancel
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
