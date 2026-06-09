import { useState } from 'react';
import { X, Settings as SettingsIcon, FolderOpen } from 'lucide-react';

interface SettingsModalProps {
  initialConfidence: number; // <-- NEW
  onClose: () => void;
  onSave: (confidence: number) => void; // <-- NEW
}

export function SettingsModal({ initialConfidence, onClose, onSave }: SettingsModalProps) {
  const [modelPath, setModelPath] = useState('/models/skinspectra_v1.h5');
  const [confidence, setConfidence] = useState(70); // <-- Initialize with state

  const handleSave = () => {
    onSave(confidence); // Emit value upwards on click
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative border-2 border-[#e2e8f0]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#718096] hover:text-[#2d3748]"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#a8d5e2] to-[#ffd4e5] rounded-full flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl text-[#1a365d]">Settings</h2>
        </div>

        <div className="space-y-6">
          {/* TensorFlow Model Block */}
          <div className="bg-[#f7fafc] rounded-2xl p-6 border-2 border-[#e2e8f0]">
            <h3 className="text-lg mb-4 text-[#1a365d]">TensorFlow Model</h3>
            <label className="block mb-2 text-[#4a5568]">Model Path</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={modelPath}
                onChange={(e) => setModelPath(e.target.value)}
                className="flex-1 bg-white border-2 border-[#e2e8f0] rounded-xl px-4 py-3 text-[#2d3748] focus:outline-none focus:border-[#a8d5e2]"
                placeholder="/path/to/model.h5"
              />
              <button className="bg-[#a8d5e2] hover:bg-[#8fc4d6] text-[#1a365d] px-4 py-3 rounded-xl transition-all flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Browse
              </button>
            </div>
            <p className="text-[#718096] text-sm mt-2">
              Load your local TensorFlow model for skin condition detection
            </p>
          </div>

          {/* Detection Settings Block */}
          {/* <div className="bg-[#f7fafc] rounded-2xl p-6 border-2 border-[#e2e8f0]">
            <h3 className="text-lg mb-4 text-[#1a365d]">Detection Settings</h3>
            <label className="block mb-2 text-[#4a5568]">
              Confidence Threshold: <span className="text-[#1a365d] font-medium">{confidence}%</span>
            </label>

            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full h-3 bg-[#e2e8f0] rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #a8d5e2 0%, #a8d5e2 ${confidence}%, #e2e8f0 ${confidence}%, #e2e8f0 100%)`,
              }}
            />

            <div className="flex justify-between text-sm text-[#718096] mt-2">
              <span>Less sensitive</span>
              <span>More sensitive</span>
            </div>

            <p className="text-[#718096] text-sm mt-3">
              Adjust the minimum confidence level required for detection alerts
            </p>
          </div> */}

          <div className="bg-[#fff8e1] border-2 border-[#ffd4a3] rounded-2xl p-4">
            <p className="text-[#2d3748] text-sm">
              <strong className="text-[#1a365d]">Tech Demo Mode:</strong> These settings are for demonstration purposes. In production, model configuration should be managed by trained professionals.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#2d3748] px-6 py-3 rounded-full transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave} // <-- CALL HANDLER
              className="flex-1 bg-[#ffd4e5] hover:bg-[#ffc0da] text-[#2d3748] px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}