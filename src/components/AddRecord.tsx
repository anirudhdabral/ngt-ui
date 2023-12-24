import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../env";

type Props={
  callback:any
}

export const AddRecord = (props:Props) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [recordName, setRecordName] = useState<string>("");

  const [dimensions, setDimensions] = useState([
    { dimensionName: "", dimensionValue: "" },
  ]);

  const [timeframes, setTimeframes] = useState([
    { timeframeName: "", timeframeValue: 0 },
  ]);

  const handleAddDimension = () => {
    setDimensions([...dimensions, { dimensionName: "", dimensionValue: "" }]);
  };

  const handleDeleteDimension = (index: number) => {
    const updatedDimensions = [
      ...dimensions.slice(0, index),
      ...dimensions.slice(index + 1),
    ];
    setDimensions(updatedDimensions);
  };

  const handleDimensionNameChange = (e: any, index: number) => {
    let updatedDimensions = [...dimensions];
    updatedDimensions[index] = {
      ...updatedDimensions[index],
      dimensionName: e.target.value,
    };
    setDimensions(updatedDimensions);
  };

  const handleAddTimeframe = () => {
    setTimeframes([...timeframes, { timeframeName: "", timeframeValue: 0 }]);
  };

  const handleDeleteTimeframe = (index: number) => {
    const updatedTimeframes = [
      ...timeframes.slice(0, index),
      ...timeframes.slice(index + 1),
    ];
    setTimeframes(updatedTimeframes);
  };

  const handleTimeframeNameChange = (e: any, index: number) => {
    let updatedTimeframes = [...timeframes];
    updatedTimeframes[index] = {
      ...updatedTimeframes[index],
      timeframeName: e.target.value,
    };
    setTimeframes(updatedTimeframes);
  };

  const handleTimeframeValueChange = (e: any, index: number) => {
    let updatedTimeframes = [...timeframes];
    updatedTimeframes[index] = {
      ...updatedTimeframes[index],
      timeframeValue: e.target.value,
    };
    setTimeframes(updatedTimeframes);
  };

  const handleTimeframeDefaultValue = (e: any, index: number) => {
    if (e.target.value.length == 0) {
      let updatedTimeframes = [...timeframes];
      updatedTimeframes[index] = {
        ...updatedTimeframes[index],
        timeframeValue: 0,
      };
      setTimeframes(updatedTimeframes);
    }
  };

  const handleDimensionValueChange = (e: any, index: number) => {
    let updatedDimensions = [...dimensions];
    updatedDimensions[index] = {
      ...updatedDimensions[index],
      dimensionValue: e.target.value,
    };
    setDimensions(updatedDimensions);
  };

  useEffect(() => {
    let invalidForm =
      dimensions.some(
        (dim) =>
          dim.dimensionName.length === 0 || dim.dimensionValue.length === 0
      ) ||
      timeframes.some((tim) => tim.timeframeName.length === 0) ||
      recordName.length == 0;
    setIsFormValid(!invalidForm);
  }, [dimensions, timeframes]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let record: any = {};
    record.recordName = recordName;
    let fields: any = [];
    let values: any = [];
    for (const item of dimensions) {
      fields.push({ element: item.dimensionName, value: item.dimensionValue });
    }
    for (const item of timeframes) {
      values.push({ element: item.timeframeName, value: item.timeframeValue });
    }
    record.fields = fields;
    record.values = values;
    await axios.post(BASE_URL + "/addRecord", record).then((response) => {
      props.callback()
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
            <Form.Control
              value={recordName}
              onChange={(e) => setRecordName(e.target.value)}
            />
          </Col>
        </Form.Group>
        <hr />
        <div className="dimensions">
          <div className="mb-3">
            <small>Dimension Details</small>
          </div>
          {dimensions.map((dimension, index) => (
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
                  value={dimension.dimensionName}
                  onChange={(e) => handleDimensionNameChange(e, index)}
                />
              </Col>
              <Col sm="5">
                <TextField
                  id="outlined-basic"
                  label="Value"
                  variant="outlined"
                  size="small"
                  value={dimension.dimensionValue}
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
          {timeframes.map((item, index) => (
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
                  value={item.timeframeName}
                  onChange={(e) => handleTimeframeNameChange(e, index)}
                />
              </Col>
              <Col sm="5">
                <TextField
                  id="outlined-basic"
                  label="Value"
                  variant="outlined"
                  size="small"
                  value={item.timeframeValue}
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
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
};
