import { useState, useRef } from 'react';
import { Camera, Upload, ArrowLeft, Loader2 } from 'lucide-react';

interface ScanningScreenProps {
  onBack: () => void;
  onCapture: (imageUrl: string) => void;
  onError: (errorType: string) => void;
}

export function ScanningScreen({ onBack, onCapture, onError }: ScanningScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const mockImageUrl = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop';
      setCapturedImage(mockImageUrl);
      setIsProcessing(false);
      setTimeout(() => {
        onCapture(mockImageUrl);
      }, 1500);
    }, 2000);
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setIsProcessing(true);
      setCapturedImage(imageUrl);
      setTimeout(() => {
        setIsProcessing(false);
        setTimeout(() => {
          onCapture(imageUrl);
        }, 1500);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-white to-[#f0f4f8] p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#4a5568] hover:text-[#2d3748] mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <h1 className="text-4xl mb-8 text-[#1a365d] text-center">Skin Scan</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#e2e8f0]">
            <h2 className="text-2xl mb-4 text-[#1a365d]">Live Camera</h2>

            <div className="relative aspect-square bg-gradient-to-br from-[#e0f2fe] to-[#f0f4f8] rounded-2xl overflow-hidden mb-6">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-[#a8d5e2] mx-auto mb-4" />
                    <p className="text-[#718096]">Camera preview</p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-4 border-[#ffd4e5] rounded-2xl"></div>
              </div>

              {isProcessing && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#a8d5e2] mx-auto mb-4 animate-spin" />
                    <p className="text-[#1a365d] text-lg">Processing image...</p>
                    <p className="text-[#718096] text-sm">Please wait</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCapture}
              disabled={isProcessing}
              className="w-full bg-[#ffd4e5] hover:bg-[#ffc0da] disabled:bg-[#e2e8f0] disabled:text-[#cbd5e0] text-[#2d3748] px-8 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Capture Image
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#e2e8f0]">
            <h2 className="text-2xl mb-4 text-[#1a365d]">Upload Photo</h2>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-square border-4 border-dashed rounded-2xl cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#a8d5e2] bg-[#e0f2fe]'
                  : 'border-[#e2e8f0] hover:border-[#a8d5e2] hover:bg-[#f7fafc]'
              } flex items-center justify-center mb-6`}
            >
              <div className="text-center p-8">
                <Upload className="w-16 h-16 text-[#a8d5e2] mx-auto mb-4" />
                <p className="text-[#1a365d] text-lg mb-2">Drop your image here</p>
                <p className="text-[#718096] text-sm">or click to browse</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />

            <div className="bg-[#fff8e1] border-2 border-[#ffd4a3] rounded-2xl p-4 mb-6">
              <p className="text-[#2d3748] text-sm">
                <strong className="text-[#1a365d]">Tips for best results:</strong>
              </p>
              <ul className="text-[#4a5568] text-sm mt-2 space-y-1 list-disc list-inside">
                <li>Use good lighting</li>
                <li>Keep the camera steady</li>
                <li>Ensure the area is in focus</li>
              </ul>
            </div>

            <div className="bg-[#f0f4f8] rounded-2xl p-4 border-2 border-[#e2e8f0]">
              <p className="text-[#718096] text-xs mb-3">Design Demo: Test Error States</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onError('lighting')}
                  className="bg-white hover:bg-[#fff8e1] border-2 border-[#e2e8f0] text-[#2d3748] px-3 py-2 rounded-lg text-xs transition-all"
                >
                  Low Light
                </button>
                <button
                  onClick={() => onError('blur')}
                  className="bg-white hover:bg-[#fff8e1] border-2 border-[#e2e8f0] text-[#2d3748] px-3 py-2 rounded-lg text-xs transition-all"
                >
                  Blur
                </button>
                <button
                  onClick={() => onError('detection')}
                  className="bg-white hover:bg-[#fff8e1] border-2 border-[#e2e8f0] text-[#2d3748] px-3 py-2 rounded-lg text-xs transition-all"
                >
                  No Skin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
