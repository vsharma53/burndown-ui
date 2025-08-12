import { Form } from "react-bootstrap";

export default function PTOUploader({ onUpload }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Upload PTO CSV</Form.Label>
      <Form.Control type="file" accept=".csv" onChange={onUpload} />
    </Form.Group>
  );
}
