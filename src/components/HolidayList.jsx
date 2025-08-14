import { Card, ListGroup } from "react-bootstrap";

export default function HolidayList({ holidays }) {
  return (
    <Card className="mb-3 mt-2 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Holidays</span>
        <span className="badge bg-secondary">{holidays.length}</span>
      </Card.Header>
      <ListGroup variant="flush">
        {holidays.map((h, i) => (
          <ListGroup.Item key={i} className="py-2">
            {h}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}
