import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
      <div className="mb-3">
        <DateRangePicker onDateChange={handleDateChange} />
        <Row className="g-2 g-md-3">
          <Col md={6}>
            <ReportGenerator onGenerate={handleGenerate} disabled={!dateRange.start || !dateRange.end} fullWidth />
          </Col>
          <Col md={6}>
            <ExportButtons dateRange={dateRange} fullWidth />
          </Col>
        </Row>
      </div>
      {dateRange.start && dateRange.end && <HolidayList holidays={holidays} />}
      <PTOManager dateRange={dateRange} onPTOChange={setPtoEntries} />
    
      {chartData.labels.length > 0 && (
        <ReportMetrics rows={burndownRows} />
      )}
      {chartData.labels.length > 0 && <BurndownChart data={chartData} />}
    
    </Container>
  );
}
