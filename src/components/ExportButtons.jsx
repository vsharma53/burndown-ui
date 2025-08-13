import { ButtonGroup, Button } from "react-bootstrap";
import { getBurndown } from "../api";

export default function ExportButtons({ dateRange }) {
  const disabled = !dateRange?.start || !dateRange?.end;

  const handleExportCsv = async () => {
    if (disabled) return;
    await getBurndown({ startDate: dateRange.start, endDate: dateRange.end });
  };

  return (
    <ButtonGroup className="">
      <Button
        variant="warning"
        className="my-2 mr-2"
        disabled={disabled}
        onClick={handleExportCsv}
      >
        Export CSV
      </Button>
    </ButtonGroup>
  );
}
