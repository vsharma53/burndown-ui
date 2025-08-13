import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
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
      <h3>Burndown Report Generator</h3>
      <DateRangePicker onDateChange={handleDateChange} />
      {dateRange.start && dateRange.end && <HolidayList holidays={holidays} />}
      <PTOManager dateRange={dateRange} onPTOChange={setPtoEntries} />
      <ReportGenerator onGenerate={handleGenerate} disabled={!dateRange.start || !dateRange.end} />
      <ExportButtons dateRange={dateRange} />
    
      {chartData.labels.length > 0 && (
        <ReportMetrics rows={burndownRows} />
      )}
      {chartData.labels.length > 0 && <BurndownChart data={chartData} />}
    
    </Container>
  );
}
