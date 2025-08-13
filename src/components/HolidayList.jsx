import { ListGroup } from "react-bootstrap";

export default function HolidayList({ holidays }) {
  return (
    <div className="mb-3 mt-2">
      <h5>Holidays</h5>
      <ListGroup>
        {holidays.map((h, i) => (
          <ListGroup.Item key={i}>{h}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
