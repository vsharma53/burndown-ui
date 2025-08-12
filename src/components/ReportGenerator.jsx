import { Button } from "react-bootstrap";

export default function ReportGenerator({ onGenerate }) {
  return (
    <Button variant="primary" className="mt-2" onClick={onGenerate}>
      Generate Burndown Report
    </Button>
  );
}
