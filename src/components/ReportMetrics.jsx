import { Table } from "react-bootstrap";

export default function ReportMetrics({ metrics }) {
  return (
    <div className="mt-4">
      <h5>Report Summary</h5>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td>Total Actual Hours</td>
            <td>{metrics.actualHours}</td>
          </tr>
          <tr>
            <td>Total Possible Hours</td>
            <td>{metrics.possibleHours}</td>
          </tr>
          <tr>
            <td>Burndown Ratio</td>
            <td>{metrics.ratio}%</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
