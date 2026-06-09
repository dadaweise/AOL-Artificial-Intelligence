import {
	ArrowLeft,
	Download,
	AlertCircle,
	CheckCircle2,
	Info,
} from "lucide-react";

interface ApiConditionResult {
	condition: string;
	confidence: number;
}

interface ResultsScreenProps {
  imageUrl: string;
  apiResults: ApiConditionResult[];
  confidenceThreshold: number; // <-- ADD THIS TO PROPS INTERFACE
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
	// 1. Helper function to clean up dataset strings and assign UI styles
	const getUiConfig = (rawCondition: string) => {
		const lower = rawCondition.toLowerCase();

		let cleanName = rawCondition;

		// High risk categories (Red treatment)
		if (
			lower.includes("melanoma") ||
			lower.includes("malignant") ||
			lower.includes("carcinoma")
		) {
			return {
				name: cleanName,
				color: "#fc8181", // Tailwind red-400
				icon: AlertCircle,
				isHighRisk: true,
			};
		}

		// Moderate/Common conditions (Orange/Yellow treatment)
		if (
			lower.includes("acne") ||
			lower.includes("eczema") ||
			lower.includes("psoriasis") ||
			lower.includes("dermatitis") ||
			lower.includes("warts")
		) {
			return {
				name: cleanName,
				color: "#ed8936", // Tailwind orange-400
				icon: Info,
				isHighRisk: false,
			};
		}

		// Default/Benign fallback (Green treatment)
		return {
			name: cleanName,
			color: "#48bb78", // Tailwind green-400
			icon: CheckCircle2,
			isHighRisk: false,
		};
	};

	// 2. Map over the live incoming API data (or fallback if empty while loading)
	const results = (apiResults && apiResults.length > 0 ? apiResults : []).map(
		(item) => {
			const ui = getUiConfig(item.condition);
			return {
				condition: ui.name,
				confidence: item.confidence,
				color: ui.color,
				icon: ui.icon,
				isHighRisk: ui.isHighRisk,
			};
		},
	);

	// 3. Dynamic logic for the advisory banners
	const highestResult = results[0] || {
		condition: "No data",
		confidence: 0,
		isHighRisk: false,
	};

	// Flag attention box if the top prediction belongs to a high-risk group or any issue is > 30%
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

					<div className="space-y-6">
						<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#e2e8f0]">
							<h2 className="text-2xl mb-6 text-[#1a365d]">
								Analysis Results
							</h2>

							<div className="space-y-4">
								{results.map((result) => {
									const Icon = result.icon;
									return (
										<div
											key={result.condition}
											className="space-y-2"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Icon
														className="w-5 h-5 flex-shrink-0"
														style={{
															color: result.color,
														}}
													/>{" "}
													{/* Add flex-shrink-0 */}
													<span className="text-[#2d3748] line-clamp-1">
														{result.condition}
													</span>{" "}
													{/* Add line-clamp-1 to truncate gracefully */}
												</div>
												<span className="text-[#1a365d] font-medium ml-4">
													{result.confidence}%
												</span>
											</div>
											<div className="w-full bg-[#f0f4f8] rounded-full h-3 overflow-hidden">
												<div
													className="h-full rounded-full transition-all duration-1000"
													style={{
														width: `${result.confidence}%`,
														backgroundColor:
															result.color,
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
										<h3 className="text-[#1a365d] text-lg mb-2">
											Next Steps
										</h3>
										<p className="text-[#2d3748] mb-4 leading-relaxed">
											We noticed findings that may warrant
											an evaluation. Consider showing this
											breakdown to a healthcare
											professional or dermatologist.
										</p>
										<p className="text-[#718096] text-sm">
											Remember: This is an AI demo and not
											a substitute for professional
											diagnostic advice.
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
											The analysis does not indicate high
											confidence in severe structural
											irregularities. Keep tracking any
											changes on your skin normally.
										</p>
										<p className="text-[#718096] text-sm">
											Regular skin checks are important
											for everyone.
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
