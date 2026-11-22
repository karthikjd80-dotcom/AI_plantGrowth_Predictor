import React, { useState, useRef, memo } from 'react';
import { UploadCloud, X, AlertCircle, Camera, ImagePlus, Ruler, Sun, Sprout } from 'lucide-react';
import LatticeLoader from './LatticeLoader';
import { LiquidGlassSelect, LiquidGlassOption } from './LiquidGlassSelect';

const SCALE_OPTIONS: LiquidGlassOption[] = [
  { value: 'auto', label: 'Auto-detect scale', sublabel: 'Uses pot rim & leaf ratios' },
  { value: 'Small nursery pot (~10 cm rim)', label: 'Small Pot (~10 cm)', sublabel: '4-inch nursery pot' },
  { value: 'Medium standard pot (~15 cm rim)', label: 'Medium Pot (~15 cm)', sublabel: '6-inch home planter' },
  { value: 'Large planter or grow bag (~30 cm)', label: 'Large Grow Bag (~30 cm)', sublabel: '12-inch outdoor bag' },
  { value: 'Outdoor garden soil bed', label: 'Outdoor Soil Bed', sublabel: 'Open ground planting' },
];

const ENVIRONMENT_OPTIONS: LiquidGlassOption[] = [
  { value: 'auto', label: 'Auto-detect setting', sublabel: 'Reads lighting from photo' },
  { value: 'Indoor windowsill / indirect light', label: 'Indoor Pot', sublabel: 'Filtered window light' },
  { value: 'Balcony / patio partial sun', label: 'Balcony / Patio', sublabel: 'Partial morning or afternoon sun' },
  { value: 'Outdoor full direct sunlight', label: 'Outdoor Garden', sublabel: 'Direct open sunlight' },
];

const RULER_ICON = <Ruler className="w-3.5 h-3.5" />;
const SUN_ICON = <Sun className="w-3.5 h-3.5" />;

export interface ImageUploadCalibrationOptions {
  extraImages?: Array<{ data: string; mimeType: string }>;
  scaleReference?: string;
  environment?: string;
  plantHint?: string;
}

interface ImageUploaderProps {
  onImageSelected: (
    base64Image: string,
    mimeType: string,
    options?: ImageUploadCalibrationOptions
  ) => void;
  isLoading: boolean;
  onOpenCamera?: () => void;
  variant?: 'compact' | 'hero';
}

interface QueuedPhoto {
  dataUrl: string;
  name: string;
}

export const ImageUploader = memo(function ImageUploader({
  onImageSelected,
  isLoading,
  onOpenCamera,
  variant = 'compact',
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [queuedPhotos, setQueuedPhotos] = useState<QueuedPhoto[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [scaleReference, setScaleReference] = useState<string>('auto');
  const [environment, setEnvironment] = useState<string>('auto');
  const [plantHint, setPlantHint] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const compressFileToDataUrl = (file: File): Promise<QueuedPhoto> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Invalid file type'));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onloadend = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Invalid image data'));
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1280;
          const MAX_HEIGHT = 1280;
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
            resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.88), name: file.name });
          } else {
            resolve({ dataUrl: reader.result as string, name: file.name });
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const triggerAnalysis = (photos: QueuedPhoto[], activeIndex = 0) => {
    if (photos.length === 0) return;
    const primary = photos[activeIndex] || photos[0];
    const allImages = photos.slice(0, 4).map((p) => ({
      data: p.dataUrl,
      mimeType: 'image/jpeg',
    }));
    onImageSelected(primary.dataUrl, 'image/jpeg', {
      extraImages: allImages,
      scaleReference,
      environment,
      plantHint: plantHint.trim() || undefined,
    });
  };

  const processFiles = async (fileList: FileList) => {
    setFileError(null);
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/')).slice(0, 4);
    if (files.length === 0) {
      setFileError('Please upload valid plant photo files (JPG, PNG, or WebP).');
      return;
    }

    try {
      const processed = await Promise.all(files.map(compressFileToDataUrl));
      setQueuedPhotos(processed);
      setPreviewUrl(processed[0].dataUrl);
      triggerAnalysis(processed, 0);
    } catch {
      setFileError('Could not read one of the selected image files. Please try another photo.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setQueuedPhotos([]);
    setFileError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const isHero = variant === 'hero';

  return (
    <div className="w-full space-y-2.5">
      {isHero && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <LiquidGlassSelect
            label="Pot / Scale Reference"
            value={scaleReference}
            options={SCALE_OPTIONS}
            onChange={setScaleReference}
            disabled={isLoading}
            icon={RULER_ICON}
          />

          <LiquidGlassSelect
            label="Growing Location"
            value={environment}
            options={ENVIRONMENT_OPTIONS}
            onChange={setEnvironment}
            disabled={isLoading}
            icon={SUN_ICON}
          />

          <label className="ios-liquid-glass-trigger rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs">
            <Sprout className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[9.5px] font-bold uppercase tracking-wider text-zinc-500 leading-tight">
                Optional Plant Hint
              </span>
              <input
                type="text"
                value={plantHint}
                onChange={(e) => setPlantHint(e.target.value)}
                disabled={isLoading}
                placeholder="e.g. Hibiscus, Mint"
                className="w-full bg-transparent text-xs font-extrabold text-zinc-950 placeholder-zinc-400 outline-none mt-0.5"
              />
            </div>
          </label>
        </div>
      )}

      {!previewUrl ? (
        <div
          className={`relative flex flex-col items-center justify-center w-full ${
            isHero ? 'py-5 sm:py-6 px-4' : 'h-22 sm:h-26 px-3'
          } rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden botanical-glass-card border-2 border-dashed ${
            dragActive
              ? 'border-zinc-950 bg-zinc-100 shadow-sm'
              : 'border-zinc-300 hover:border-zinc-950'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            accept="image/*"
            onChange={handleChange}
            disabled={isLoading}
          />
          {isHero ? (
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5">
              <span className="rgb-pink-glow-dark rounded-full">
                <span className="rgb-pink-glow-surface inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-bold">
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>Choose Plant Photos</span>
                </span>
              </span>
              {onOpenCamera && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCamera();
                  }}
                  className="rgb-pink-glow rounded-full border border-zinc-200 cursor-pointer focus:outline-none"
                >
                  <span className="rgb-pink-glow-surface inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-zinc-900 text-xs font-bold">
                    <Camera className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Capture Photo</span>
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2.5 bg-zinc-950 rounded-xl shadow-xs shrink-0">
                <UploadCloud className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-extrabold text-zinc-950 leading-tight">
                  Click to upload plant photos or drag &amp; drop
                </p>
                <p className="text-[10px] sm:text-[11px] font-medium text-zinc-500 mt-0.5">
                  Upload full plant + close-up leaf photos (JPG, PNG, WebP)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className={`relative w-full ${isHero ? 'h-48 sm:h-56' : 'h-28 sm:h-32'} rounded-2xl overflow-hidden border border-zinc-200 botanical-glass-card flex items-center justify-center`}>
            <img
              src={previewUrl}
              alt="Uploaded plant preview"
              className={`max-w-full max-h-full object-contain ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            />
            {!isLoading && (
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1.5 bg-white/95 hover:bg-zinc-100 rounded-full shadow-md text-zinc-900 border border-zinc-200 transition-colors cursor-pointer active:scale-95"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-xs">
                <div className="bg-white/95 px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-zinc-200 text-zinc-950">
                  <LatticeLoader
                    status="working"
                    label={queuedPhotos.length > 1 ? `Analyzing ${queuedPhotos.length} Photos` : 'Analyzing Photo'}
                    doneLabel="Done in"
                    errorLabel="Failed after"
                    pattern="orbit"
                    grid={3}
                    shape="round"
                    color="currentColor"
                    doneColor="currentColor"
                    errorColor="#18181b"
                    cellSize={5}
                    gap={2}
                    fontSize={13}
                    step={90}
                    idleOpacity={0.25}
                    glow={false}
                    showTimer
                  />
                </div>
              </div>
            )}
          </div>

          {queuedPhotos.length > 1 && !isLoading && (
            <div className="flex flex-wrap items-center justify-between gap-2 py-0.5">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-bold text-zinc-600 shrink-0">
                  Combined ({queuedPhotos.length} angles):
                </span>
                {queuedPhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewUrl(photo.dataUrl)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                      previewUrl === photo.dataUrl
                        ? 'border-zinc-950 scale-105'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                    title={`Preview ${photo.name}`}
                  >
                    <img src={photo.dataUrl} alt={photo.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => triggerAnalysis(queuedPhotos, 0)}
                className="px-3.5 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer active:scale-95 shrink-0"
              >
                Re-analyze All {queuedPhotos.length} Photos
              </button>
            </div>
          )}
        </div>
      )}

      {fileError && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}
    </div>
  );
});

export default ImageUploader;
