import { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ScanningScreen } from "./components/ScanningScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { ErrorModal } from "./components/ErrorModal";
import { SettingsModal } from "./components/SettingsModal";

type Screen = "welcome" | "scanning" | "results";

interface PredictionResult {
	condition: string;
	confidence: number;
}

export default function App() {
	const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
	const [capturedImage, setCapturedImage] = useState<string>("");
	const [predictions, setPredictions] = useState<PredictionResult[]>([]);
	const [showError, setShowError] = useState<string | null>(null);
	const [showSettings, setShowSettings] = useState(false);
	const [confidenceThreshold, setConfidenceThreshold] = useState<number>(25);

	const handleStartScan = () => {
		setCurrentScreen("scanning");
	};

	const handleCapture = (
		imageUrl: string,
		backendResults: PredictionResult[],
	) => {
		setCapturedImage(imageUrl);
		setPredictions(backendResults);
		setCurrentScreen("results");
	};

	const handleError = (errorType: string) => {
		setShowError(errorType);
	};

	const handleStartOver = () => {
		setCapturedImage("");
		setPredictions([]);
		setCurrentScreen("welcome");
	};

	const handleTryAgain = () => {
		setShowError(null);
	};

	return (
		<div className="min-h-screen">
			{currentScreen === "welcome" && (
				<WelcomeScreen
					onStartScan={handleStartScan}
					onOpenSettings={() => setShowSettings(true)}
				/>
			)}

			{currentScreen === "scanning" && (
				<ScanningScreen
					onBack={() => setCurrentScreen("welcome")}
					onCapture={handleCapture}
					onError={handleError}
				/>
			)}

			{currentScreen === "results" && (
				<ResultsScreen
					imageUrl={capturedImage}
					apiResults={predictions}
					confidenceThreshold={confidenceThreshold}
					onBack={() => setCurrentScreen("scanning")}
					onStartOver={handleStartOver}
				/>
			)}

			{showError && (
				<ErrorModal
					errorType={showError}
					onClose={() => setShowError(null)}
					onTryAgain={handleTryAgain}
				/>
			)}

			{showSettings && (
				<SettingsModal
					initialConfidence={confidenceThreshold}
					onClose={() => setShowSettings(false)}
					onSave={(newValue) => {
						setConfidenceThreshold(newValue);
						setShowSettings(false);
					}}
				/>
			)}
		</div>
	);
}
