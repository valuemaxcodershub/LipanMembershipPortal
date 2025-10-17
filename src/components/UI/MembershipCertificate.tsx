import { useEffect, useState, useRef } from "react";
import certTemplate from "../../assets/cert-template.jpeg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "../../config/axios";
import { BiDownload } from "react-icons/bi";
import { Skeleton } from "./Skeleton";

// // Old English Google font
// const fontLink = document.createElement("link");
// fontLink.href =
//   "https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap";
// fontLink.rel = "stylesheet";
// document.head.appendChild(fontLink);

interface CertificateProps {
  memberId?: string;
}

export default function Certificate({ memberId }: CertificateProps) {
  const [member, setMember] = useState<any>(null);
  const [membershipTime, setMembershipTime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const [profileRes, membershipRes] = await Promise.all([
          axios.get("/auth/user/"),
          axios.get("/accounts/user/membership/"),
        ]);
        setMember(profileRes.data);
        setMembershipTime(membershipRes.data);
      } catch (err) {
        console.error("Error fetching certificate data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [memberId]);

  // const handleDownload = async () => {
  //   if (!printRef.current) return;
  //   setBusy(true);

  //   // Render HTML to Canvas
  //   const canvas = await html2canvas(printRef.current, {
  //     scale: 2,
  //     useCORS: true,
  //   });

  //   // Convert to PDF with same aspect ratio
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF({
  //     orientation: "landscape",
  //     unit: "px",
  //     format: [canvas.width, canvas.height],
  //   });

  //   pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  //   pdf.save(`certificate-${member?.full_name || "user"}.pdf`);
  //   setBusy(false);
  // };

  const handleDownload = async () => {
    if (!printRef.current) return;
    setBusy(true);

    // Render HTML to Canvas (high quality)
    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    // Create PDF with standard A4 landscape size
    const pdf = new jsPDF("landscape", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Scale image to fit nicely within A4
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight) * 0.95; // slightly smaller for padding

    // Center the image
    const x = (pageWidth - imgWidth * ratio) / 2;
    const y = (pageHeight - imgHeight * ratio) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`certificate-${member?.full_name || "user"}.pdf`);

    setBusy(false);
  };

  if (loading) return <Skeleton className="w-full h-full mx-auto" />;

  return (
    <>
      <div className=" overflow-x-auto">
        <div
          ref={printRef}
          id="certificate"
          className="relative m-auto"
          style={{
            width: "1000px", // match actual certificate image dimensions
            height: "750px",
            backgroundImage: `url(${certTemplate})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* Full Name */}
          <div
            className="absolute font-Ditty text-[36px] font-bold text-black"
            style={{
              top: "200px",
              left: "210px",
            }}
          >
            {member?.full_name?.toUpperCase()}
          </div>

          {/* Institution */}
          <div
            className="absolute text-[20px] font-semibold text-black"
            style={{ top: "275px", left: "210px", fontFamily: "Poppins" }}
          >
            {member?.organization}
          </div>

          {/* State */}
          <div
            className="absolute text-[22px] font-semibold text-black"
            style={{ top: "335px", left: "210px", fontFamily: "Poppins" }}
          >
            {member?.state}
          </div>

          {/* Membership Number */}
          <div
            className="absolute text-[22px] font-bold text-black"
            style={{ top: "395px", left: "440px", fontFamily: "Poppins" }}
          >
            {member?.lipan_id}
          </div>

          {/* Dates */}
          <div
            className="absolute text-[18px] font-semibold text-black"
            style={{ top: "530px", left: "370px", fontFamily: "Poppins" }}
          >
            <div className="flex justify-center items-center gap-14">
              <p>{new Date(membershipTime?.start_date).toLocaleDateString()}</p>
              <p>{new Date(membershipTime?.end_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleDownload}
          disabled={busy}
          className="bg-blue-600 flex items-center gap-2 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow disabled:opacity-60"
        >
          <BiDownload />
          {busy ? "Downloading..." : "Download Certificate"}
        </button>
      </div>
    </>
  );
}
