import { Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStartScan: () => void;
  onOpenSettings: () => void;
}

export function WelcomeScreen({ onStartScan, onOpenSettings }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-white to-[#fce7f3] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-[#a8d5e2] to-[#ffd4e5] rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-16 h-16 text-white" strokeWidth={2} />
          </div>
        </div>

        <h1 className="text-5xl mb-4 text-[#1a365d]">Welcome to SkinSpectra</h1>

        <p className="text-xl text-[#4a5568] mb-8 leading-relaxed">
          A friendly tool to help you monitor your skin health at home
        </p>

        <button
          onClick={onStartScan}
          className="bg-[#ffd4e5] hover:bg-[#ffc0da] text-[#2d3748] px-12 py-4 rounded-full text-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 mb-8"
        >
          Start New Scan
        </button>

        <div className="bg-[#fff5f7] border-2 border-[#ffd4e5] rounded-2xl p-6 max-w-xl mx-auto">
          <p className="text-[#2d3748] leading-relaxed">
            <strong className="text-[#1a365d]">Tech Demo Only:</strong> This tool does not provide medical diagnosis.
            Always consult a doctor for professional medical advice.
          </p>
        </div>

        <button
          onClick={onOpenSettings}
          className="mt-8 text-[#718096] hover:text-[#4a5568] underline text-sm"
        >
          Settings
        </button>
      </div>
    </div>
  );
}
