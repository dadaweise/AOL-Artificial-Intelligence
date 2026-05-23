import { AlertCircle, Sun, Focus, Eye, X } from 'lucide-react';

interface ErrorModalProps {
  errorType: string;
  onClose: () => void;
  onTryAgain: () => void;
}

export function ErrorModal({ errorType, onClose, onTryAgain }: ErrorModalProps) {
  const errors = {
    lighting: {
      icon: Sun,
      title: 'Lighting is Too Dim',
      message: 'Please move to a brighter area or turn on additional lights for better image quality.',
      color: '#ed8936',
    },
    blur: {
      icon: Focus,
      title: 'Image is Blurry',
      message: "Let's try holding the camera steady. Rest your hand on a stable surface if needed.",
      color: '#ecc94b',
    },
    detection: {
      icon: Eye,
      title: 'No Skin Detected',
      message: 'Please ensure the skin area is clearly visible in the target box.',
      color: '#fc8181',
    },
  };

  const error = errors[errorType as keyof typeof errors] || errors.detection;
  const Icon = error.icon;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative border-2 border-[#e2e8f0]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#718096] hover:text-[#2d3748]"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: `${error.color}20` }}
          >
            <Icon className="w-10 h-10" style={{ color: error.color }} />
          </div>

          <h2 className="text-2xl mb-4 text-[#1a365d]">{error.title}</h2>

          <p className="text-[#4a5568] mb-8 leading-relaxed">{error.message}</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#2d3748] px-6 py-3 rounded-full transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onTryAgain}
              className="flex-1 bg-[#ffd4e5] hover:bg-[#ffc0da] text-[#2d3748] px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
