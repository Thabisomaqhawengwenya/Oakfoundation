'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CameraQrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  isProcessing: boolean;
}

export const CameraQrScanner: React.FC<CameraQrScannerProps> = ({
  onScanSuccess,
  isProcessing,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerRegionId = 'qr-reader-region';

  const startScanner = async () => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerRegionId);
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          if (!isProcessing) {
            onScanSuccess(decodedText);
          }
        },
        (errorMessage) => {
          // ignore continuous scanning frame errors
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.warn('Camera error or permission denied:', err);
      setCameraError(
        'Camera access not available or permission denied. You can test with the quick scan selector or manual input below.'
      );
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Failed to stop camera scanner', err);
      }
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Scan Status Indicator */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-medium">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isProcessing
                ? 'bg-amber-400 animate-pulse'
                : isScanning
                ? 'bg-emerald-400 animate-ping'
                : 'bg-red-400'
            }`}
          />
          <span>
            {isProcessing
              ? 'Status: Processing Scan...'
              : isScanning
              ? 'Status: Camera Active & Scanning'
              : 'Status: Camera Inactive'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isScanning ? (
            <button
              onClick={stopScanner}
              className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded-md bg-slate-800"
            >
              <CameraOff className="w-3.5 h-3.5" />
              Pause
            </button>
          ) : (
            <button
              onClick={startScanner}
              className="flex items-center gap-1 text-blue-300 hover:text-white px-2 py-1 rounded-md bg-blue-900/60"
            >
              <Camera className="w-3.5 h-3.5" />
              Start Camera
            </button>
          )}
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 min-h-[300px] flex items-center justify-center">
        <div id={scannerRegionId} className="w-full max-w-sm overflow-hidden" />

        {/* Viewfinder crosshairs overlay */}
        {isScanning && !cameraError && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-56 h-56 border-2 border-blue-400/60 rounded-2xl relative animate-pulse">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500" />
            </div>
          </div>
        )}

        {cameraError && (
          <div className="p-6 text-center text-slate-400 max-w-xs space-y-3">
            <CameraOff className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-300">{cameraError}</p>
            <button
              onClick={startScanner}
              className="px-3 py-1.5 bg-[#163866] text-white rounded-lg text-xs font-semibold hover:bg-blue-900 inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Camera
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
