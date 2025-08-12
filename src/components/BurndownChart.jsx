import { Line } from "react-chartjs-2";
import { Card } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BurndownChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Possible Hours",
        data: data.possibleHours,
        borderColor: "rgba(40, 167, 69, 1)", // Bootstrap success green
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        fill: false,
        tension: 0.1
      },
      {
        label: "Actual Hours",
        data: data.actualHours,
        borderColor: "rgba(0, 123, 255, 1)", // Bootstrap primary blue
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: false,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Burndown Chart"
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Card className="mt-4 p-3">
      <Line data={chartData} options={options} />
    </Card>
  );
}
