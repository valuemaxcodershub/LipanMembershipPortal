// CaptchaCanvas.js
import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { BiRefresh } from "react-icons/bi";

interface CaptchaProps {
  onChange: (captcha: string) => void;
  length?: number;
}

export type CaptchaRef = {
  refreshCaptcha: () => void;
}

const Captcha = forwardRef<CaptchaRef, CaptchaProps>(
  ({ onChange, length = 6 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateCaptcha = () => {
      const chars =
        "stuvwABCD567EFGHJKLMabcdefghijkNPQRSTUV234WXYZlmnopqrxyz189";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const drawCaptcha = (text: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas?.width, canvas?.height);
      ctx.font = "26px monospace";
      ctx.fillStyle = "#1f2937"; // Tailwind gray-800
      const letterSpacing = canvas?.width / (text.length + 1);

      for (let i = 0; i < text.length; i++) {
        const x = (i + 1) * letterSpacing;
        const y = 30 + Math.random() * 10;
        ctx.fillText(text[i], x, y);
      }
    };

    const refreshCaptcha = () => {
      const newCaptcha = generateCaptcha();
      drawCaptcha(newCaptcha);
      onChange(newCaptcha);
    };

    useImperativeHandle(ref, () => ({
      refreshCaptcha,
    }));

    useEffect(() => {
      refreshCaptcha();
    }, []);

    return (
      <div className="flex items-center gap-2 mb-2">
        <canvas
          ref={canvasRef}
          width="150"
          height="50"
          className="rounded border bg-gray-100 dark:bg-gray-700"
        />
        <button
          type="button"
          onClick={refreshCaptcha}
          className="rounded-full p-3 bg-gray-200 text-blue-600 hover:underline"
        >
          <BiRefresh size={25} />
        </button>
      </div>
    );
  }
);

export default Captcha;
