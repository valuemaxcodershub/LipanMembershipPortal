import { useState } from "react";
import FlutterWavePayment from "../../utils/payments/Flutterwave";
import { Button } from "flowbite-react";
import PdfViewerModal from "../../components/UI/ReaderModal";

function TestPayment() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center justify-center">
      <FlutterWavePayment />
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <PdfViewerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        // fileUrl="https://example.com/sample.pdf"
        fileUrl="/test.pdf"
      />
    </div>
  );
}

export default TestPayment;
