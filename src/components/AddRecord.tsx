import { useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";

export const AddRecord = () => {
  const [dimensions, setDimensions] = useState([
    { dimensionName: "", dimensionValue: "" },
  ]);
  const [timeframes, setTimeframes] = useState([
    { timeframeName: "", timeframeValue: "" },
  ]);
  const handleAddDimension = () => {
    setDimensions([...dimensions, { dimensionName: "", dimensionValue: "" }]);
  };
  const handleAddTimeframe = () => {
    setTimeframes([...timeframes, { timeframeName: "", timeframeValue: "" }]);
  };
  const handleDeleteDimension = (index: number) => {};
  const handleDeleteTimeframe = (index: number) => {};
  const handleDimensionNameChange = (e: any, index: number) => {
    let updatedDimensions = [...dimensions];
    updatedDimensions[index] = {
      ...updatedDimensions[index],
      dimensionName: e.target.value,
    };
    setDimensions(updatedDimensions);
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
  const handleDimensionValueChange = (e: any, index: number) => {
    let updatedDimensions = [...dimensions];
    updatedDimensions[index] = {
      ...updatedDimensions[index],
      dimensionValue: e.target.value,
    };
    setDimensions(updatedDimensions);
  };

  useEffect(() => {
    console.log(dimensions);
  }, [dimensions]);
  return (
    <>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="4">
            Record Name
          </Form.Label>
          <Col sm="7">
            <Form.Control />
          </Col>
        </Form.Group>
        <div className="dimensions">
          {dimensions.map((dimension, index) => (
            <Form.Group
              key={index}
              as={Row}
              className="mb-3"
              controlId="formPlaintextEmail"
            >
              <Col sm="5">
                <FloatingLabel controlId="floatingInput" label="Dimension Name">
                  <Form.Control
                    type="text"
                    placeholder="Dimension Name"
                    onChange={(e) => handleDimensionNameChange(e, index)}
                  />
                </FloatingLabel>
              </Col>
              <Col sm="5">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Dimension Value"
                >
                  <Form.Control
                    type="text"
                    placeholder="Dimension Value"
                    onChange={(e) => handleDimensionValueChange(e, index)}
                  />
                </FloatingLabel>
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
          {timeframes.map((item, index) => (
            <Form.Group
              key={index}
              as={Row}
              className="mb-3"
              controlId="formPlaintextEmail"
            >
              <Col sm="5">
                <FloatingLabel controlId="floatingInput" label="Timeframe Name">
                  <Form.Control
                    type="text"
                    placeholder="Timeframe Name"
                    onChange={(e) => handleTimeframeNameChange(e, index)}
                  />
                </FloatingLabel>
              </Col>
              <Col sm="5">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Timeframe Value"
                >
                  <Form.Control
                    type="text"
                    placeholder="Timeframe Value"
                    onChange={(e) => handleTimeframeValueChange(e, index)}
                  />
                </FloatingLabel>
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
      </Form>
    </>
  );
};
