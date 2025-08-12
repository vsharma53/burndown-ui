import { useState } from "react";
import { Form, Button, Table, Row, Col } from "react-bootstrap";

export default function PTOManager({ dateRange, onPTOChange }) {
  const [mode, setMode] = useState("upload"); // upload | manual
  const [ptoData, setPtoData] = useState([
    { id: 1, name: "John Doe", ptoHours: 8 },
    { id: 2, name: "Jane Smith", ptoHours: 4 }
  ]);

  const handleUpload = (e) => {
    console.log("Uploaded file:", e.target.files[0]?.name);
    // TODO: parse CSV later, mock now
  };

  const handleEdit = (id, value) => {
    const updated = ptoData.map((row) =>
      row.id === id ? { ...row, ptoHours: value } : row
    );
    setPtoData(updated);
    onPTOChange(updated);
  };

  const addUser = () => {
    setPtoData([...ptoData, { id: Date.now(), name: "", ptoHours: 0 }]);
  };

  const handleNameChange = (id, value) => {
    const updated = ptoData.map((row) =>
      row.id === id ? { ...row, name: value } : row
    );
    setPtoData(updated);
    onPTOChange(updated);
  };

  return (
    <div className="mb-4">
      <h5>PTO Management</h5>
      <Form.Group as={Row} className="mb-3">
        <Col sm="3">
          <Form.Check
            type="radio"
            label="Upload PTO CSV"
            name="ptoMode"
            checked={mode === "upload"}
            onChange={() => setMode("upload")}
          />
        </Col>
        <Col sm="3">
          <Form.Check
            type="radio"
            label="Manual Entry"
            name="ptoMode"
            checked={mode === "manual"}
            onChange={() => setMode("manual")}
          />
        </Col>
      </Form.Group>

      {mode === "upload" && (
        <Form.Group>
          <Form.Label>Upload PTO CSV</Form.Label>
          <Form.Control type="file" accept=".csv" onChange={handleUpload} />
        </Form.Group>
      )}

      {mode === "manual" && (
        <div>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>User Name</th>
                <th>PTO Hours</th>
              </tr>
            </thead>
            <tbody>
              {ptoData.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Form.Control
                      value={row.name}
                      placeholder="Enter name"
                      onChange={(e) => handleNameChange(row.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={row.ptoHours}
                      onChange={(e) =>
                        handleEdit(row.id, Number(e.target.value))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="secondary" onClick={addUser}>
            Add User
          </Button>
        </div>
      )}
    </div>
  );
}
