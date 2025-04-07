import React, { useRef, useState, useEffect } from "react";
import { generateRandomString } from "../../utils/app/text";
import { FaCamera } from "react-icons/fa";
import { BiDownload } from "react-icons/bi";
import { Button, Spinner } from "flowbite-react";
import { Alert } from "flowbite-react";

interface CameraCaptureProps {
  onCapture: (dataUrl: string, filename: string) => void;
}

const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setLoading(false);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Unable to access your camera. Please grant permission.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getCameraStream();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [capturedImage]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const dataUrl = canvasRef.current.toDataURL("image/png");
        setCapturedImage(dataUrl);
      }
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
    getCameraStream();
  };

  const saveImage = () => {
    if (capturedImage) {
      const filename = `lipan@app-selfie-${generateRandomString()}.png`;
      const link = document.createElement("a");
      link.href = capturedImage;
      link.download = filename;
      link.click();
      onCapture(capturedImage, filename);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-5 w-full py-6">
      {error && (
        <Alert color="failure" className="max-w-md w-full text-center">
          {error}
        </Alert>
      )}

      {capturedImage ? (
        <div className="flex flex-col items-center space-y-4">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full max-w-md rounded-xl border shadow-lg"
          />
          <div className="flex gap-4">
            <Button color="failure" onClick={clearImage}>
              Clear
            </Button>
            <Button color="warning" onClick={saveImage}>
              <BiDownload className="mr-2" />
              Save & Use Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center space-y-4">
          <div className="relative w-full aspect- bg-black rounded-xl overflow-hidden shadow-md">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Spinner size="lg" color="warning" />
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover z-0"
            />
          </div>
          <Button
            color="warning"
            onClick={captureImage}
            disabled={loading}
            className="flex items-center"
          >
            <FaCamera className="mr-2" />
            Capture Image
          </Button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
