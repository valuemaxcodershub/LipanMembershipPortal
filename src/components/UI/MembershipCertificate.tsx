import { useEffect, useState, useRef } from "react";
import certTemplate from "../../assets/cert-template.jpeg";
import { Skeleton } from "./Skeleton";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// @ts-ignore - dom-to-image-more has no shipped types
import domtoimage from "dom-to-image-more";
import axios from "../../config/axios";

interface CertificateProps {
  memberId?: string;
}

export default function Certificate({ memberId }: CertificateProps) {
  const [member, setMember] = useState<any>(null);
  const [membershipTime, setMembershipTime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

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
    // const element = document.getElementById("certificate");
    setBusy(true);
    const canvas = await html2canvas(printRef?.current as HTMLDivElement, {
      scale: 3,
    }); // higher scale = clearer
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`certificate.pdf`);
    setBusy(false);
  };

  if (loading) return <Skeleton className="w-full h-full mx-auto" />;

  return (
    <>
      <div className="overflow-x-auto">
        {/* Certificate display area (exact same dimensions you had) */}
        <div
          ref={printRef}
          className="relative w-[850px] h-[768px] m-auto border-4 rounded-lg shadow-lg bg-white"
        >
          <img
            src={certTemplate}
            alt="Certificate Template"
            className="absolute inset-0 w-full h-full object-contain"
            crossOrigin="anonymous"
          />

          {/* Overlay Text */}
          <div className="absolute font-dancing-script top-[250px] left-[180px] text-black font-[700] space-letters text-3xl">
            {member?.full_name}
          </div>

          <div className="absolute font-poppins top-[305px] left-[190px] text-black font-bold space-letters text-lg">
            {member?.organization}
          </div>

          <div className="absolute font-poppins top-[350px] left-[180px] text-black font-bold space-letters text-xl">
            {member?.state}
          </div>

          <div className="absolute font-poppins top-[395px] left-[410px] text-black font-bold text-xl">
            {member?.lipan_id}
          </div>

          <div className="absolute font-poppins top-[510px] left-[310px] text-black text-md font-bold">
            {new Date(membershipTime?.start_date).toLocaleDateString()}{" "}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {new Date(membershipTime?.end_date).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center mt-4">
        {/* <button
          onClick={downloadPNG}
          disabled={busy}
          className="bg-white border border-blue-600 text-blue-600 font-semibold px-4 py-2 rounded hover:bg-blue-50 disabled:opacity-60"
        >
          {busy ? "Working..." : "Download PNG"}
        </button> */}

        <button
          onClick={handleDownload}
          disabled={busy}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow disabled:opacity-60"
        >
          {busy ? "Working..." : "Save as PDF"}
        </button>
      </div>
    </>
  );
}
