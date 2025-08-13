import { Table } from "react-bootstrap";

export default function ReportMetrics({ rows = [] }) {
  return (
    <div className="mt-4">
      <h5>Report Summary</h5>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Total Hours</th>
            <th>Holiday Hours</th>
            <th>PTO Hours</th>
            <th>Actual Hours</th>
            <th>Ratio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const total = Number(r.totalUtilizationHours) || 0;
            const actual = Number(r.actualUtilizationHours) || 0;
            const ratio = total > 0 ? ((actual / total) * 100).toFixed(2) : "0.00";
            return (
              <tr key={i}>
                <td>{r.employeeName || r.employeeEmail}</td>
                <td>{total}</td>
                <td>{Number(r.holidayHours) || 0}</td>
                <td>{Number(r.ptoHours) || 0}</td>
                <td>{actual}</td>
                <td>{ratio}%</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
