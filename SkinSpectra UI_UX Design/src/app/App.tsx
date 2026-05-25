import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ScanningScreen } from './components/ScanningScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ErrorModal } from './components/ErrorModal';
import { SettingsModal } from './components/SettingsModal';

type Screen = 'welcome' | 'scanning' | 'results';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [showError, setShowError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleStartScan = () => {
    setCurrentScreen('scanning');
  };

  const handleCapture = (imageUrl: string) => {
    setCapturedImage(imageUrl);
    setCurrentScreen('results');
  };

  const handleError = (errorType: string) => {
    setShowError(errorType);
  };

  const handleStartOver = () => {
    setCapturedImage('');
    setCurrentScreen('welcome');
  };

  const handleTryAgain = () => {
    setShowError(null);
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onStartScan={handleStartScan}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {currentScreen === 'scanning' && (
        <ScanningScreen
          onBack={() => setCurrentScreen('welcome')}
          onCapture={handleCapture}
          onError={handleError}
        />
      )}

      {currentScreen === 'results' && (
        <ResultsScreen
          imageUrl={capturedImage}
          onBack={() => setCurrentScreen('scanning')}
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

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}