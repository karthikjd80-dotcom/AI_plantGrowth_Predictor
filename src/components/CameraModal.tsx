import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Upload, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string, mimeType: string) => void;
  isDarkMode?: boolean;
}

export function CameraModal({ isOpen, onClose, onCapture, isDarkMode = false }: CameraModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileFallbackInputRef = useRef<HTMLInputElement>(null);

  // Stop camera tracks helper
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Start camera stream
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    setIsInitializing(true);
    setCameraError(null);
    setCapturedImage(null);

    // Stop existing stream first
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser. You can still upload from files.');
      setIsInitializing(false);
      return;
    }

    try {
      // Check for available video inputs to enable camera switch button
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      } catch (e) {
        // Ignore enumerate devices errors
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera start error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in browser settings or choose a photo from files.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. You can select a photo from files.');
      } else {
        setCameraError('Unable to open camera stream. Please try again or select a photo from files.');
      }
    } finally {
      setIsInitializing(false);
    }
  }, [stream]);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopStream();
      setCapturedImage(null);
      setCameraError(null);
    }

    return () => {
      stopStream();
    };
  }, [isOpen]);

  // Handle switching front/back camera
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture snapshot from video stream
  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, mirror image for natural selfie feel
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopStream();
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  // Confirm photo and send to prediction
  const handleConfirm = () => {
    if (!capturedImage) return;
    stopStream();
    onCapture(capturedImage, 'image/jpeg');
    onClose();
  };

  // Upload fallback
  const handleFileFallbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          stopStream();
          onCapture(dataUrl, 'image/jpeg');
          onClose();
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 select-none ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Hidden file input for file selection fallback */}
      <input
        ref={fileFallbackInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileFallbackChange}
      />

      {/* Main Camera Container */}
      <div className="relative w-full max-w-lg md:max-w-xl h-[88vh] max-h-[750px] bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col">
        
        {/* Top Header Bar */}
        <div className="absolute top-0 inset-x-0 z-30 px-4 py-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>Plant Camera</span>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </h3>
              <p className="text-[10px] text-white/70">Point at leaf or stem for diagnosis</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!capturedImage && !cameraError && (
              <button
                onClick={handleToggleFacingMode}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all active:scale-90 border border-white/20"
                title="Switch Camera (Front/Back)"
                aria-label="Switch Camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                stopStream();
                onClose();
              }}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all active:scale-90 border border-white/20"
              title="Close Camera"
              aria-label="Close Camera"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder / Video Canvas Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            /* Captured Photo Preview */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured Plant"
                className="w-full h-full object-cover sm:object-contain"
              />
              <div className="absolute top-16 left-4 right-4 z-20 px-3 py-1.5 bg-zinc-950/90 backdrop-blur-md text-white text-xs font-semibold rounded-xl text-center shadow-lg border border-white/25">
                Photo Captured! Ready to analyze plant health &amp; growth.
              </div>
            </div>
          ) : cameraError ? (
            /* Camera Error / Permission Denied State */
            <div className="p-6 text-center max-w-sm flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/30 text-white flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="text-white text-base font-bold mb-2">Camera Unavailable</h4>
              <p className="text-zinc-300 text-xs leading-relaxed mb-6">
                {cameraError}
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                <button
                  onClick={() => startCamera(facingMode)}
                  className="flex-1 py-2.5 px-4 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold transition-all border border-white/20 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => fileFallbackInputRef.current?.click()}
                  className="flex-1 py-2.5 px-4 bg-white hover:bg-zinc-200 text-zinc-950 rounded-xl text-xs font-semibold transition-all shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose File</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera View */
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Botanical Target Frame Overlay */}
              <div className="absolute inset-8 sm:inset-12 pointer-events-none flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-t-3 border-l-3 border-white rounded-tl-xl shadow-sm" />
                  <div className="w-8 h-8 border-t-3 border-r-3 border-white rounded-tr-xl shadow-sm" />
                </div>
                
                {/* Center scan line */}
                <div className="w-full flex items-center justify-center">
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/25 text-[11px] text-white font-medium">
                    Center leaf in frame
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="w-8 h-8 border-b-3 border-l-3 border-white rounded-bl-xl shadow-sm" />
                  <div className="w-8 h-8 border-b-3 border-r-3 border-white rounded-br-xl shadow-sm" />
                </div>
              </div>

              {isInitializing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Starting camera...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Shutter / Action Controls */}
        <div className="p-4 pb-6 bg-gradient-to-t from-black via-black/90 to-transparent flex items-center justify-around z-30">
          {capturedImage ? (
            /* Actions after capturing photo: Retake or Confirm */
            <div className="w-full flex items-center justify-center space-x-4 max-w-xs mx-auto">
              <button
                onClick={handleRetake}
                className="flex-1 py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-2 border border-white/20 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake</span>
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 px-4 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-95 border border-white"
              >
                <Check className="w-4 h-4" />
                <span>Analyze Plant</span>
              </button>
            </div>
          ) : (
            /* Live Camera Shutter Controls */
            <div className="w-full flex items-center justify-between px-6 max-w-md mx-auto">
              <button
                onClick={() => fileFallbackInputRef.current?.click()}
                className="flex flex-col items-center justify-center text-white/80 hover:text-white group p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                title="Choose from Gallery or Files"
              >
                <div className="w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-medium tracking-tight">Files</span>
              </button>

              {/* Big Circular Shutter Button */}
              <button
                onClick={handleSnap}
                disabled={isInitializing || !!cameraError}
                className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white/20 p-1 border-2 border-white/60 hover:border-white transition-all active:scale-95 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
                title="Take Photo"
                aria-label="Take Photo"
              >
                <div className="w-full h-full rounded-full bg-white group-hover:bg-zinc-200 transition-colors shadow-lg shadow-white/20 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-2 border-zinc-900/20 group-hover:border-zinc-900/40" />
                </div>
              </button>

              {/* Toggle front/back camera */}
              <button
                onClick={handleToggleFacingMode}
                disabled={isInitializing || !!cameraError}
                className="flex flex-col items-center justify-center text-white/80 hover:text-white group p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer disabled:opacity-30"
                title="Flip Camera"
              >
                <div className="w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-medium tracking-tight">Flip</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
