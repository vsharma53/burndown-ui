import { ButtonGroup, Button } from "react-bootstrap";

export default function ExportButtons({ onExport }) {
  return (
    <ButtonGroup className="mt-3">
      <Button variant="outline-success" onClick={() => onExport("csv")}>
        Export CSV
      </Button>
      <Button variant="outline-danger" onClick={() => onExport("pdf")}>
        Export PDF
      </Button>
    </ButtonGroup>
  );
}
