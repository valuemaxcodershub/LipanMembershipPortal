import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Spinner } from "flowbite-react";
import certTemplate from "../../assets/palfa-cert-template.jpeg"; // rename your uploaded file accordingly

interface CertificatePreviewProps {
  participant: {
    firstName: string;
    lastName: string;
    paperTitle?: string;
    organization?: string;
  };
}

export default function CertificatePreview({
  participant,
}: CertificatePreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const handleGeneratePDF = async () => {
    setBusy(true);
    const canvas = await html2canvas(ref.current as HTMLDivElement, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(
      `${participant.firstName}_${participant.lastName}_Certificate.pdf`
    );
    setBusy(false);
  };

  return (
    <div className="text-center">
      {/* Certificate preview area */}
      <div
        ref={ref}
        className="relative w-[1086px] h-[768px] mx-auto border rounded-lg overflow-hidden bg-white"
      >
        <img
          src={certTemplate}
          alt="Certificate Template"
          className="absolute inset-0 w-full h-full object-contain"
          crossOrigin="anonymous"
        />

        {/* Participant Name */}
        <div className="absolute top-[340px] left-1/2 transform -translate-x-1/2 text-center text-4xl font-semibold text-[#7a3d1a] font-dancing-script">
          {participant.firstName} {participant.lastName}
        </div>

        {/* Optional Presentation Title */}
        {participant.paperTitle && (
          <div className="absolute top-[500px] left-1/2 transform -translate-x-1/2 w-[700px] text-center text-lg font-medium text-gray-800">
            {participant.paperTitle}
          </div>
        )}
      </div>

      {/* Download button */}
      <Button
        onClick={handleGeneratePDF}
        disabled={busy}
        color="blue"
        className="mt-5"
      >
        {busy ? <Spinner size="sm" /> : "Download Certificate"}
      </Button>
    </div>
  );
}
