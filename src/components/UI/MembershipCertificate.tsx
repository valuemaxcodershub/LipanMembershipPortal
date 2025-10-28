import { useEffect, useState, useRef } from "react";
import certTemplate from "../../assets/cert-template.jpeg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "../../config/axios";
import { BiDownload } from "react-icons/bi";
import { Skeleton } from "./Skeleton";

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

  const handleDownload = async () => {
    if (!printRef.current) return;
    setBusy(true);

    try {
      // ✅ Render HTML to Canvas (optimized scale)
      const canvas = await html2canvas(printRef.current, {
        scale: 1.5, // reduce from 2 → 1.5 for smaller file but still sharp
        useCORS: true,
        scrollY: 0,
      });

      // ✅ Convert to JPEG with controlled quality
      const imgData = canvas.toDataURL("image/jpeg", 0.7); // 0.7 = good balance

      // ✅ Create PDF (landscape A4)
      const pdf = new jsPDF("landscape", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Maintain aspect ratio and leave small padding
      const ratio =
        Math.min(pageWidth / imgWidth, pageHeight / imgHeight) * 0.95;

      const x = (pageWidth - imgWidth * ratio) / 2;
      const y = (pageHeight - imgHeight * ratio) / 2;

      // ✅ Add the compressed image to the PDF
      pdf.addImage(imgData, "JPEG", x, y, imgWidth * ratio, imgHeight * ratio);

      // ✅ Save the PDF
      pdf.save(`certificate-${member?.full_name || "user"}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setBusy(false);
    }
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
              top: "197px",
              left: "320px",
              wordSpacing: "10px",
              letterSpacing: "11px",
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
