import { useRef, useState } from 'react';
import { Download, QrCode, Sparkles, Check, Copy } from 'lucide-react';

interface QRGeneratorProps {
  data: string;
  title: string;
  logoEmoji?: string;
  accentColor?: string;
}

export default function QRGenerator({ data, title, logoEmoji = '🛒', accentColor = '#4f46e5' }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Generate QR code API URL
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const downloadQR = async () => {
    setDownloading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Reset canvas
      canvas.width = 600;
      canvas.height = 700;

      // Draw background with subtle gradient
      const grad = ctx.createLinearGradient(0, 0, 600, 700);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, '#f8fafc');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 700);

      // Draw rounded corner card border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(30, 30, 540, 640, 30);
      ctx.stroke();

      // Draw shop title text
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 36px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, 300, 90);

      // Draw tagline text
      ctx.fillStyle = '#64748b';
      ctx.font = 'medium 18px system-ui, sans-serif';
      ctx.fillText('Scan to Browse Products & Order', 300, 125);

      // Load QR Image
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.src = qrUrl;

      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => {
          // Draw the QR Code image in the center
          ctx.drawImage(qrImg, 150, 180, 300, 300);

          // Draw custom Accent Ring around the QR Code
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.roundRect(140, 170, 320, 320, 20);
          ctx.stroke();

          // Draw the Shop Emoji Logo in the middle of the QR Code
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(300, 330, 32, 0, 2 * Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.font = '36px serif';
          ctx.textBaseline = 'middle';
          ctx.fillText(logoEmoji, 300, 332);

          resolve();
        };
        qrImg.onerror = () => reject(new Error('Failed to load QR image'));
      });

      // Draw bottom brand banner
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(60, 540, 480, 80, 15);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.fillText('⚡ Powered by Local Shop Builder', 300, 585);

      // Create download link
      const imageURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_qr_code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating high-res download', err);
      // Fallback: simple direct link download if canvas tainted
      window.open(qrUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div id="qr-generator-card" className="flex flex-col items-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="relative group flex items-center justify-center bg-slate-50 p-4 rounded-xl border border-slate-100 w-full aspect-square max-w-[240px] mb-4">
        {/* Real Dynamic QR Code */}
        <img
          src={qrUrl}
          alt={`QR Code for ${title}`}
          className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-102"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
        {/* Centered Emoji Overlay */}
        <div className="absolute bg-white shadow-md border border-slate-100 rounded-full w-12 h-12 flex items-center justify-center text-2xl select-none">
          {logoEmoji}
        </div>
      </div>

      <div className="text-center mb-5">
        <h4 className="font-semibold text-slate-800 flex items-center justify-center gap-1.5 text-base">
          <QrCode className="w-4 h-4 text-slate-500" />
          Scannable Flyer
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-[240px] leading-relaxed">
          Customers can scan this code to view your website or make instant payments.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
        <button
          onClick={copyLink}
          type="button"
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              Copy Link
            </>
          )}
        </button>

        <button
          onClick={downloadQR}
          disabled={downloading}
          type="button"
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 active:bg-black transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          {downloading ? 'Exporting...' : 'Download'}
        </button>
      </div>

      {/* Hidden Canvas for High-Res PNG Generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
