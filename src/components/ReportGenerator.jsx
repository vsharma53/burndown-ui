import { Button } from "react-bootstrap";

export default function ReportGenerator({ onGenerate, disabled = false }) {
  return (
    <Button variant="primary" className="my-2 mr-2" style={{marginRight: "10px"}} onClick={onGenerate} disabled={disabled}>
      Generate Burndown Report
    </Button>
  );
}
