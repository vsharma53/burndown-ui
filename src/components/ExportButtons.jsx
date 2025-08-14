import { ButtonGroup, Button } from "react-bootstrap";
import { getBurndown } from "../api";

export default function ExportButtons({ dateRange, fullWidth = true }) {
  const disabled = !dateRange?.start || !dateRange?.end;

  const handleExportCsv = async () => {
    if (disabled) return;
    await getBurndown({ startDate: dateRange.start, endDate: dateRange.end });
  };

  return (
    <div className={fullWidth ? "w-100" : ""}>
      <ButtonGroup className="w-100">
        <Button
          variant="warning"
          className="my-2"
          disabled={disabled}
          onClick={handleExportCsv}
        >
          Export Burndown CSV
        </Button>
      </ButtonGroup>
    </div>
  );
}
