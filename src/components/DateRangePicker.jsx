import { Row, Col, Form } from "react-bootstrap";

export default function DateRangePicker({ onDateChange }) {
  return (
    <Row className="mb-3">
      <Col>
        <Form.Label>Start Date</Form.Label>
        <Form.Control type="date" onChange={(e) => onDateChange(e.target.value, "start")} />
      </Col>
      <Col>
        <Form.Label>End Date</Form.Label>
        <Form.Control type="date" onChange={(e) => onDateChange(e.target.value, "end")} />
      </Col>
    </Row>
  );
}
