import { Button } from "react-bootstrap";

export default function ReportGenerator({ onGenerate, disabled = false, fullWidth = true }) {
  return (
    <Button
      variant="primary"
      className={fullWidth ? "w-100 my-2" : "my-2"}
      onClick={onGenerate}
      disabled={disabled}
    >
      Generate Burndown Report
    </Button>
  );
}
