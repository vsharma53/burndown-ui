import { useState } from "react";
import { Container } from "react-bootstrap";
import DateRangePicker from "../components/DateRangePicker";
import HolidayList from "../components/HolidayList";
import PTOManager from "../components/PTOManager";
import ReportGenerator from "../components/ReportGenerator";
import ReportMetrics from "../components/ReportMetrics";
import BurndownChart from "../components/BurndownChart";
import ExportButtons from "../components/ExportButtons";
import burndownData from "../data/burndownData.json";

export default function Dashboard() {
  const [holidays] = useState(["2025-08-15", "2025-08-19"]);
  const [metrics, setMetrics] = useState({ actualHours: "-", possibleHours: "-", ratio: "-" });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [ptoEntries, setPtoEntries] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const handleDateChange = (value, type) => {
    setDateRange((prev) => ({ ...prev, [type]: value }));
  };

  const handleGenerate = () => {
    // Mock calc: possibleHours = users * 40 * weeks
    const possibleHours = 400;
    const actualHours = possibleHours - ptoEntries.reduce((sum, p) => sum + p.ptoHours, 0);
    const ratio = ((actualHours / possibleHours) * 100).toFixed(2);

    setMetrics({ actualHours, possibleHours, ratio });

    setChartData({
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        { label: "Actual Hours", data: [80, 160, 240, actualHours], borderColor: "blue", fill: false },
        { label: "Possible Hours", data: [100, 200, 300, possibleHours], borderColor: "green", fill: false }
      ]
    });
  };

  const handleExport = (type) => {
    alert(`Exporting ${type.toUpperCase()} (mock)`);
  };

  return (
    <Container className="mt-4">
      <h3>Burndown Report Generator</h3>
      <DateRangePicker onDateChange={handleDateChange} />
      <PTOManager dateRange={dateRange} onPTOChange={setPtoEntries} />
      <HolidayList holidays={holidays} />
      <ReportGenerator onGenerate={handleGenerate} />
      <ReportMetrics metrics={metrics} />
      <BurndownChart data={burndownData} />
      <ExportButtons onExport={handleExport} />
    </Container>
  );
}
