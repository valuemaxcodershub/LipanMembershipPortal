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
