import { useState } from "react";
import axios from "../../config/axios";
import { toast } from "react-toastify";

export function useDownloadFile() {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const downloadFile = async (fileId: number, filename: string) => {
    try {
      setDownloading(true);
      const response = await axios.get(`/resource/${fileId}/download/`, {
        responseType: "blob",
        onDownloadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / (e.total || 1));
          setProgress(percent);
        },
      });

      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      link.remove();
      toast.success("Downloaded successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed", {
        position: "top-center",
      });
    } finally {
      setTimeout(()=>{
        setProgress(0);
        setDownloading(false);
      }, 7000)
    }
  };

  return { downloadFile, progress, downloading };
}


 export async function checkCode(
  id: string
): Promise<{ valid: boolean; message: string } | undefined> {
  const pattern = /^Li\d{4}PAN$/;
  if (!pattern.test(id)) {
    return {
      valid: false,
      message: "❌ Invalid ID Provided.",
    };
  }

  // Simulate API call to validate the code
  try {
    await axios.post("/accounts/user/verify-id/", { lipan_id: id });
    return {
      valid: true,
      message: "✅ ID validated successfully.",
    };
  } catch (err: any) {
    console.error(err);
    return {
      valid: false,
      message:
        err?.response?.data?.message ||
        "❌ Error validating ID. Please try again later.",
    };
  }
}