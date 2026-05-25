import { ArrowLeft, Download, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface ResultsScreenProps {
  imageUrl: string;
  onBack: () => void;
  onStartOver: () => void;
}

export function ResultsScreen({ imageUrl, onBack, onStartOver }: ResultsScreenProps) {
  const results = [
    { condition: 'Normal Skin', confidence: 65, color: '#48bb78', icon: CheckCircle2 },
    { condition: 'Melanocytic Nevus', confidence: 22, color: '#ed8936', icon: Info },
    { condition: 'Dermatofibroma', confidence: 8, color: '#ecc94b', icon: Info },
    { condition: 'Melanoma', confidence: 5, color: '#fc8181', icon: AlertCircle },
  ];

  const highestResult = results[0];
  const needsAttention = results.some((r) => r.confidence > 20 && r.condition !== 'Normal Skin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-white to-[#f0f4f8] p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#4a5568] hover:text-[#2d3748] mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-4xl mb-8 text-[#1a365d] text-center">Scan Results</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#e2e8f0]">
            <h2 className="text-2xl mb-4 text-[#1a365d]">Captured Image</h2>
            <img
              src={imageUrl}
              alt="Scanned skin"
              className="w-full aspect-square object-cover rounded-2xl mb-6 border-2 border-[#e2e8f0]"
            />

            <button className="w-full bg-[#a8d5e2] hover:bg-[#8fc4d6] text-[#1a365d] px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Save Result
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#e2e8f0]">
              <h2 className="text-2xl mb-6 text-[#1a365d]">Analysis Results</h2>

              <div className="space-y-4">
                {results.map((result) => {
                  const Icon = result.icon;
                  return (
                    <div key={result.condition} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5" style={{ color: result.color }} />
                          <span className="text-[#2d3748]">{result.condition}</span>
                        </div>
                        <span className="text-[#1a365d] font-medium">{result.confidence}%</span>
                      </div>
                      <div className="w-full bg-[#f0f4f8] rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${result.confidence}%`,
                            backgroundColor: result.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {needsAttention ? (
              <div className="bg-[#fff5f7] border-2 border-[#ffd4e5] rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-[#ed8936] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-[#1a365d] text-lg mb-2">Next Steps</h3>
                    <p className="text-[#2d3748] mb-4 leading-relaxed">
                      We noticed something that may need attention. Consider showing this result to a dermatologist for a
                      professional evaluation.
                    </p>
                    <p className="text-[#718096] text-sm">
                      Remember: This is a tech demo and not a substitute for professional medical advice.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#48bb78] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-[#1a365d] text-lg mb-2">Looking Good!</h3>
                    <p className="text-[#2d3748] mb-4 leading-relaxed">
                      The analysis suggests normal skin. However, continue to monitor any changes and consult a
                      dermatologist if you have concerns.
                    </p>
                    <p className="text-[#718096] text-sm">Regular skin checks are important for everyone.</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onStartOver}
              className="w-full bg-[#ffd4e5] hover:bg-[#ffc0da] text-[#2d3748] px-8 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
