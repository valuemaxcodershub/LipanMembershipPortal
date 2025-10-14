import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Spinner } from "flowbite-react";
import certTemplate from "../../assets/conf-cert-template.jpeg"; // rename your uploaded file accordingly
import axios from "axios";
import { toast } from "react-toastify";
import { BiDownload, BiMailSend } from "react-icons/bi";

interface CertificatePreviewProps {
  participant: {
    firstName: string;
    lastName: string;
    paperTitle?: string;
    organization?: string;
    email: string;
  };
}

export default function ConfCertificate({
  participant,
}: CertificatePreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const createCertificatePDF = async () => {
    const element = ref.current as HTMLDivElement;
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL("image/png");
    const { width: canvasWidth, height: canvasHeight } = canvas;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const ratio = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);
    const imgWidth = canvasWidth * ratio;
    const imgHeight = canvasHeight * ratio;

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

    return pdf;
  };

  // -----------------------------
  // Generate & Download PDF
  // -----------------------------
  const handleGeneratePDF = async () => {
    setBusy(true);
    try {
      const pdf = await createCertificatePDF();

      const filename = `${participant.firstName}_${participant.lastName}_Certificate.pdf`;

      // Save PDF for download
      pdf.save(filename);
    } finally {
      setBusy(false);
    }
  };

  // -----------------------------
  // Generate Only Blob (for email)
  // -----------------------------
  const generatePdfBlob = async () => {
    const pdf = await createCertificatePDF();
    return pdf.output("blob");
  };

  // -----------------------------
  // Send Email with PDF Attachment
  // -----------------------------
  const sendEmailToParticipant = async () => {
    setIsSending(true);
    try {
      const blobToSend = await generatePdfBlob();

      const filename = `${participant.firstName}_${participant.lastName}_Certificate.pdf`;

      const formData = new FormData();
      formData.append("certificate", blobToSend as Blob, filename);
      formData.append(
        "name",
        participant.firstName + " " + participant.lastName
      );
      formData.append("email", participant.email);
      formData.append("conferenceName", "Pan African literacy for all (PALFA)");

      await axios.post(
        `${import.meta.env.VITE_OTHER_API_URL}/api/send-certificate`,
        formData
      );

      toast.success("Certificate sent successfully!");
    } catch (err) {
      console.error("Error sending email:", err);
      toast.error("Failed to send certificate.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="text-center">
      {/* Certificate preview area */}
      <div className=" max-w-6xl w-full h-auto mx-auto border rounded-lg overflow-x-auto bg-white">
        <div
          ref={ref}
          className="relative w-[540px] h-[780px] mx-auto border rounded-lg"
        >
          <img
            src={certTemplate}
            alt="Certificate Template"
            className="absolute inset-0 w-full h-full object-contain"
            crossOrigin="anonymous"
          />

          {/* Participant Name */}
          <div
            style={{ wordSpacing: "10px", letterSpacing: "4px" }}
            className="absolute top-[322px] left-1/2 transform -translate-x-1/2 text-center text-[2rem] font-semibold text-black font-Ditty"
          >
            {participant.firstName} {participant.lastName}
          </div>

          {/* Optional Presentation Title */}
          {participant.paperTitle && (
            <div className="absolute top-[500px] left-1/2 transform -translate-x-1/2 w-[700px] text-center text-lg font-medium text-gray-800">
              {participant.paperTitle}
            </div>
          )}
        </div>
      </div>

      {/* Download button */}
      <div className="flex items-center justify-start gap-3 mt-6">
        {/* add icons to thses buttons */}

        <Button
          onClick={handleGeneratePDF}
          disabled={busy}
          color="blue"
          className="mt-5"
        >
          {busy ? (
            <Spinner size="sm" />
          ) : (
            <>
              <BiDownload className="mr-2" size={24} />
              <span>Download Certificate</span>
            </>
          )}
        </Button>

        {/* Email button */}
        <Button
          onClick={sendEmailToParticipant}
          disabled={isSending}
          color="green"
          className="mt-5"
        >
          {isSending ? (
            <Spinner size="sm" />
          ) : (
            <>
              <BiMailSend className="mr-2" size={24} />
              <span>Email Certificate to Participant</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
