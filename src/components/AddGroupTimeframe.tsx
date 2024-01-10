import { TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Button, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { BASE_URL } from "../env";
type Props = {
  recordName: string;
  callback: any;
  groupName: string;
};
export const AddGroupTimeframe = (props: Props) => {
  const [timeframeName, setTimeframeName] = useState<string>("");
  const [timeframeValue, setTimeframeValue] = useState<number>(0);
  const handleSubmit = async () => {
    const timeframeTotalDetails = {
      timeframeName: timeframeName,
      timeframeTotal: timeframeValue,
    };
    await axios
      .put(
        BASE_URL +
          "/addGroupTimeframeTotal/" +
          props.recordName +
          "/" +
          props.groupName,
        timeframeTotalDetails
      )
      .then((response) => {
        props.callback();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setTimeout(() => props.callback(), 3100);
      });
  };
  return (
    <>
      <div className="d-flex justify-content-center">
        <span className="text-center">
          Are you sure you want to add following timeframe to all records with
          record name: "{props.recordName}" and field value "{props.groupName}"
        </span>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <Col sm="5">
          <TextField
            id="outlined-basic"
            label="Timeframe Name"
            variant="outlined"
            size="small"
            className="mx-1"
            value={timeframeName}
            onChange={(e) => setTimeframeName(e.target.value)}
          />
        </Col>
        <Col sm="5">
          <TextField
            id="outlined-basic"
            label="Total Value"
            variant="outlined"
            size="small"
            className="mx-1"
            value={timeframeValue}
            onChange={(e) => setTimeframeValue(Number(e.target.value))}
            onBlur={(e) => {
              if (e.target.value.length === 0) {
                setTimeframeValue(0);
              }
            }}
          />
        </Col>
      </div>
      <div className="px-4">
        <Button className="my-3 w-100" onClick={handleSubmit}>
          Add Timeframe
        </Button>
      </div>
    </>
  );
};
