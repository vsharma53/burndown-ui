import { Row, Col, Form, Card } from "react-bootstrap";

export default function DateRangePicker({ onDateChange }) {
  return (
    <Card className="mb-3 shadow-sm" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "2px solid #ced4da", borderRadius: "0.5rem" }}>
      <Card.Body className="pb-2">
        <Row className="g-3 align-items-end">
          <Col md={6}>
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" onChange={(e) => onDateChange(e.target.value, "start")} />
          </Col>
          <Col md={6}>
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" onChange={(e) => onDateChange(e.target.value, "end")} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
