import { useEffect, useState } from "react";
import { Form, Button, Table, Row, Col } from "react-bootstrap";
import { addPto, getBurndown } from "../api";

export default function PTOManager({ dateRange, onPTOChange }) {
  useEffect(()=>{
    //addPto();
     //getBurndown()
  },[])
  const [mode, setMode] = useState("upload"); // upload | manual
  const [ptoData, setPtoData] = useState([
    { id: 1, name: "John Doe", email: "", startDate: "", endDate: "", pto_code: "CL" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const employees = [
    { email: "alice.singh@example.com", name: "Alice Singh", location: "Bangalore" },
    { email: "bob.nair@example.com", name: "Bob Nair", location: "Chennai" },
    { email: "carol.sharma@example.com", name: "Carol Sharma", location: "Gurgaon" },
    { email: "david.patel@example.com", name: "David Patel", location: "Hyderabad" },
    { email: "emma.roy@example.com", name: "Emma Roy", location: "Kolkata" },
    { email: "frank.joseph@example.com", name: "Frank Joseph", location: "Mumbai" },
    { email: "grace.rana@example.com", name: "Grace Rana", location: "Pune" }
  ];
  const [selectedEmail, setSelectedEmail] = useState("");

  const handleUpload = (e) => {
    console.log("Uploaded file:", e.target.files[0]?.name);
    // TODO: parse CSV later, mock now
  };

  const handleStartDateChange = (id, value) => {
    const updated = ptoData.map((row) =>
      row.id === id ? { ...row, startDate: value } : row
    );
    setPtoData(updated);
    onPTOChange(updated);
  };

  const handleEndDateChange = (id, value) => {
    const updated = ptoData.map((row) =>
      row.id === id ? { ...row, endDate: value } : row
    );
    setPtoData(updated);
    onPTOChange(updated);
  };

  const addUser = () => {
    setPtoData([...ptoData, { id: Date.now(), name: "", email: "", startDate: "", endDate: "", pto_code: "CL" }]);
  };

  const handleNameChange = (id, value) => {
    const updated = ptoData.map((row) =>
      row.id === id ? { ...row, name: value } : row
    );
    setPtoData(updated);
    onPTOChange(updated);
  };

  const handleCodeChange = (id, value) => {
    const updated = ptoData.map((row) =>
      row.id === id ? { ...row, pto_code: value } : row
    );
    setPtoData(updated);
    onPTOChange(updated);
  };

  const handleEmployeeChange = (id, email) => {
    const emp = employees.find((e) => e.email === email);
    const updated = ptoData.map((row) =>
      row.id === id ? { ...row, email, name: emp?.name || "" } : row
    );
    setPtoData(updated);
    setSelectedEmail(email);
    onPTOChange(updated);
  };

  const hasValidRows = ptoData.some(
    (row) => (row.startDate || "").length > 0 && (row.endDate || "").length > 0
  );
  const canSubmit = hasValidRows && ptoData.some((r) => (r.email || "").length > 0);

  const handleSubmitPTO = async () => {
    if (!hasValidRows || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        email: (ptoData.find((r) => r.email) || {}).email || "",
        ptos_dateRange: ptoData
          .filter((row) => (row.startDate || "").length > 0 && (row.endDate || "").length > 0)
          .map((row) => ({
            startDate: row.startDate,
            endDate: row.endDate,
            pto_code: row.pto_code
          }))
      };

      await addPto(payload);
      alert("PTO data submitted successfully");
    } catch (e) {
      alert(`Failed to submit PTO data: ${e?.message || e}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-4">
      <h5>PTO Management</h5>
      {/* <Form.Group as={Row} className="mb-3">
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
      </Form.Group> */}

      {/* {mode === "upload" && (
        <Form.Group>
          <Form.Label>Upload PTO CSV</Form.Label>
          <Form.Control type="file" accept=".csv" onChange={handleUpload} />
        </Form.Group>
      )} */}

      { (
        <div>
          {/* <Form.Group className="mb-3">
            <Form.Label>Select Employee</Form.Label>
            <Form.Select value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)}>
              <option value="">Select...</option>
              {employees.map((emp) => (
                <option key={emp.email} value={emp.email}>
                  {emp.name} ({emp.location}) - {emp.email}
                </option>
              ))}
            </Form.Select>
          </Form.Group> */}

          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>PTO Code</th>
              </tr>
            </thead>
            <tbody>
              {ptoData.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Form.Select
                      value={row.email}
                      onChange={(e) => handleEmployeeChange(row.id, e.target.value)}
                    >
                      <option value="">Select...</option>
                      {employees.map((emp) => (
                        <option key={emp.email} value={emp.email}>
                          {emp.name} ({emp.location}) - {emp.email}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      type="date"
                      value={row.startDate}
                      onChange={(e) => handleStartDateChange(row.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="date"
                      value={row.endDate}
                      onChange={(e) => handleEndDateChange(row.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Select
                      value={row.pto_code}
                      onChange={(e) => handleCodeChange(row.id, e.target.value)}
                    >
                      <option value="CL">CL</option>
                      <option value="PL">PL</option>
                      <option value="SL">SL</option>
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="secondary" onClick={addUser}>
            Add User
          </Button>
          <Button
            variant="primary"
            className="ms-2"
            onClick={handleSubmitPTO}
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit PTO"}
          </Button>
        </div>
      )}
    </div>
  );
}
