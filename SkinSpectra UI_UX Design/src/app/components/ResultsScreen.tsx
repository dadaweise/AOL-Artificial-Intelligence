import {
    ArrowLeft,
    Download,
    AlertCircle,
    CheckCircle2,
    ArrowUpCircle,
    ArrowDownCircle,
} from "lucide-react";

interface ApiConditionResult {
    condition: string;
    confidence: number;
}

interface ResultsScreenProps {
    imageUrl: string;
    apiResults: ApiConditionResult[];
    confidenceThreshold: number;
    onBack: () => void;
    onStartOver: () => void;
}

export function ResultsScreen({
    imageUrl,
    apiResults,
    confidenceThreshold,
    onBack,
    onStartOver,
}: ResultsScreenProps) {
    
    // 1. Find the absolute highest confidence score in the current batch
    const maxConfidence = apiResults && apiResults.length > 0 
        ? Math.max(...apiResults.map(r => r.confidence)) 
        : 0;

    // 2. Map results purely based on the confidence threshold
    const results = (apiResults && apiResults.length > 0 ? apiResults : []).map(
        (item) => {
            const isHighConfidence = item.confidence >= confidenceThreshold;
            
            // Check if this specific item is BOTH above threshold AND the highest score
            const isHighestSurpassing = isHighConfidence && item.confidence === maxConfidence;

            return {
                condition: item.condition,
                confidence: item.confidence,
                // High confidence = Green up arrow, Low confidence = Gray down arrow
                color: isHighConfidence ? "#48bb78" : "#a0aec0", 
                icon: isHighConfidence ? ArrowUpCircle : ArrowDownCircle,
                isHighestSurpassing: isHighestSurpassing,
            };
        },
    );

    // 3. Flag attention box if ANY issue is >= the threshold
    const needsAttention = results.some((r) => r.confidence >= confidenceThreshold);

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

                <h1 className="text-4xl mb-8 text-[#1a365d] text-center">
                    Scan Results
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Image */ }
                    <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#e2e8f0]">
                        <h2 className="text-2xl mb-4 text-[#1a365d]">
                            Captured Image
                        </h2>
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

                    {/* Right Column: Results */ }
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#e2e8f0]">
                            <h2 className="text-2xl mb-6 text-[#1a365d]">
                                Analysis Results
                            </h2>

                            <div className="space-y-6">
                                {results.map((result) => {
                                    const Icon = result.icon;
                                    
                                    // Apply dynamic scaling/styling if it's the highest surpassing result
                                    const containerClasses = result.isHighestSurpassing 
                                        ? "space-y-3 p-4 bg-[#f0fdf4] rounded-2xl border-2 border-[#48bb78] transform scale-105 shadow-md transition-all" 
                                        : "space-y-2 p-2";

                                    const textClasses = result.isHighestSurpassing
                                        ? "text-xl font-bold text-[#1a365d]"
                                        : "text-[#2d3748]";

                                    return (
                                        <div
                                            key={result.condition}
                                            className={containerClasses}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        className={`${result.isHighestSurpassing ? 'w-7 h-7' : 'w-5 h-5'} flex-shrink-0`}
                                                        style={{ color: result.color }}
                                                    />
                                                    <span className={`${textClasses} line-clamp-1`}>
                                                        {result.condition}
                                                    </span>
                                                </div>
                                                <span className={`${textClasses} ml-4`}>
                                                    {result.confidence}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-[#e2e8f0] rounded-full h-3 overflow-hidden">
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

                        {/* Advisory Banners */}
                        {needsAttention ? (
                            <div className="bg-[#fff5f7] border-2 border-[#ffd4e5] rounded-2xl p-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-6 h-6 text-[#fc8181] flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-[#1a365d] text-lg mb-2">
                                            Next Steps
                                        </h3>
                                        <p className="text-[#2d3748] mb-4 leading-relaxed">
                                            We noticed findings that passed the confidence threshold. Consider showing this breakdown to a healthcare professional.
                                        </p>
                                        <p className="text-[#718096] text-sm">
                                            Remember: This is an AI demo and not a substitute for professional diagnostic advice.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-2xl p-6">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-[#48bb78] flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-[#1a365d] text-lg mb-2">
                                            Analysis Complete
                                        </h3>
                                        <p className="text-[#2d3748] mb-4 leading-relaxed">
                                            The analysis does not indicate any conditions meeting the required confidence threshold. Keep tracking any changes normally.
                                        </p>
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