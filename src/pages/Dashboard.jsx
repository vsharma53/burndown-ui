import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import DateRangePicker from "../components/DateRangePicker";
import HolidayList from "../components/HolidayList";
import PTOManager from "../components/PTOManager";
import ReportGenerator from "../components/ReportGenerator";
import ReportMetrics from "../components/ReportMetrics";
import BurndownChart from "../components/BurndownChart";
import ExportButtons from "../components/ExportButtons";
import { getHolidays } from "../api";
import { getChartBurndown } from "../api";
import { getBurndown } from "../api";

export default function Dashboard() {
  const [holidays, setHolidays] = useState([]);
  const [metrics, setMetrics] = useState({ actualHours: "-", possibleHours: "-", ratio: "-" });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [ptoEntries, setPtoEntries] = useState([]);
  const [showPto, setShowPto] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [burndownRows, setBurndownRows] = useState([]);

  const handleDateChange = (value, type) => {
    setDateRange((prev) => ({ ...prev, [type]: value }));
  };

  const handleGenerate = async () => {
    if (!dateRange.start || !dateRange.end) return;
    try {
      const data = await getChartBurndown({
        startDate: dateRange.start,
        endDate: dateRange.end
      });
      if (Array.isArray(data)) {
        setBurndownRows(data);
        const labels = data.map((r) => r.employeeName || r.employeeEmail);
        const possibleHours = data.map((r) => Number(r.totalUtilizationHours) || 0);
        const actualHours = data.map((r) => Number(r.actualUtilizationHours) || 0);

        setChartData({ labels, possibleHours, actualHours });

        const possibleSum = possibleHours.reduce((sum, v) => sum + v, 0);
        const actualSum = actualHours.reduce((sum, v) => sum + v, 0);
        const ratio = possibleSum > 0 ? ((actualSum / possibleSum) * 100).toFixed(2) : "0.00";
        setMetrics({ actualHours: actualSum, possibleHours: possibleSum, ratio });
      }
    } catch (e) {
      // Optional: handle error
    }
  };

  // Legacy onExport removed; ExportButtons handles CSV based on dateRange

  useEffect(() => {
    const fetchHolidays = async () => {
      if (!dateRange.start || !dateRange.end) return;
      try {
        const data = await getHolidays({
          startDate: dateRange.start,
          endDate: dateRange.end
        });
        // Transform objects to display strings for HolidayList
        const items = Array.isArray(data)
          ? data.map((h) => `${h.date} - ${h.holidayName}`)
          : [];
        setHolidays(items);
      } catch (e) {
        // Optional: surface error to UI
        // console.error("Failed to fetch holidays", e);
        setHolidays([]);
      }
    };
    fetchHolidays();
  }, [dateRange.start, dateRange.end]);

  return (
    <Container className="mt-4">
      <div
        className="mb-3 p-3 border rounded shadow-sm d-flex justify-content-between align-items-center"
        style={{ background: "linear-gradient(180deg, #f8f9fa, #ffffff)" }}
      >
        <div>
          <h4 className="mb-1">Burndown Report Generator</h4>
          <div className="text-muted small">Select a date range to generate charts and export reports</div>
        </div>
        {dateRange.start && dateRange.end && (
          <span className="badge bg-primary">
            {dateRange.start} 
            <span className="mx-1">to</span>
            {dateRange.end}
          </span>
        )}
      </div>
      <Card className="mb-3 shadow-sm" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "2px solid #ced4da", borderRadius: "0.5rem" }}>
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <DateRangePicker onDateChange={handleDateChange} field="start" noCard />
            </Col>
            <Col md={4}>
              <DateRangePicker onDateChange={handleDateChange} field="end" noCard />
            </Col>
            <Col md={4} className="d-flex flex-column justify-content-end">
              <ReportGenerator onGenerate={handleGenerate} disabled={!dateRange.start || !dateRange.end} fullWidth />
              <ExportButtons dateRange={dateRange} fullWidth />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {dateRange.start && dateRange.end && <HolidayList holidays={holidays} />}
      <Card className="mb-3 shadow-sm" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "2px solid #ced4da", borderRadius: "0.5rem" }}>
        <Card.Body className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
          <div className="mb-2 mb-md-0">
            <div className="fw-semibold mb-1">Do you want to add PTO?</div>
            <div className="text-muted small">Add personal time off entries for the selected date range</div>
          </div>
          <Form>
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                label="Yes"
                name="addPto"
                id="addPtoYes"
                checked={showPto}
                onChange={() => setShowPto(true)}
              />
              <Form.Check
                type="radio"
                label="No"
                name="addPto"
                id="addPtoNo"
                checked={!showPto}
                onChange={() => setShowPto(false)}
              />
            </div>
          </Form>
        </Card.Body>
      </Card>
     
      {showPto && (
        <PTOManager dateRange={dateRange} onPTOChange={setPtoEntries} />
      )}
    
      {chartData.labels.length > 0 && (
        <ReportMetrics rows={burndownRows} />
      )}
      {chartData.labels.length > 0 && <BurndownChart data={chartData} />}
    
    </Container>
  );
}
