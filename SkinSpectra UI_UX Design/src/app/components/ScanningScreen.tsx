import { useState, useRef, useEffect } from "react";
import { Camera, Upload, ArrowLeft, Loader2 } from "lucide-react";

interface ScanningScreenProps {
	onBack: () => void;
	onCapture: (imageUrl: string, results: any[]) => void;
	onError: (errorType: string) => void;
}

function dataURLtoBlob(dataUrl: string): Blob {
	const arr = dataUrl.split(",");
	const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

export function ScanningScreen({
	onBack,
	onCapture,
	onError,
}: ScanningScreenProps) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [streamActive, setStreamActive] = useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const streamRef = useRef<MediaStream | null>(null);

	useEffect(() => {
		async function startCamera() {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: "environment",
						width: 600,
						height: 600,
					},
				});
				streamRef.current = stream;

				// Now videoRef.current is guaranteed to exist!
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					setStreamActive(true);
				}
			} catch (err) {
				console.error("Camera access blocked or unavailable:", err);
				setStreamActive(false);
			}
		}

		startCamera();

		return () => {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	// Action: Snipe current frame matrix inside video box container element
	const handleCapture = async () => {
		if (!videoRef.current || !canvasRef.current) return;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		if (ctx) {
			// Set fixed resolution parameters mirroring pipeline sizes
			canvas.width = 300;
			canvas.height = 300;

			// Draw frame snap snapshot onto invisible canvas layout workspace
			ctx.drawImage(video, 0, 0, 300, 300);
			const dataUrl = canvas.toDataURL("image/jpeg");

			setIsProcessing(true);

			const formData = new FormData();
			const blob = dataURLtoBlob(dataUrl);
			formData.append("file", blob, "webcam_snapshot.jpg");

			try {
				const res = await fetch("http://127.0.0.1:8000/predict", {
					method: "POST",
					body: formData,
				});
				if (!res.ok)
					throw new Error("Model rejected transaction target");
				const data = await res.json();

				onCapture(dataUrl, data.results);
			} catch (err) {
				console.error(err);
				onError("detection");
			} finally {
				setIsProcessing(false);
			}
		}
	};

	const handleFileUpload = (file: File) => {
		if (!file.type.startsWith("image/")) {
			return;
		}

		const reader = new FileReader();
		reader.onload = async (e) => {
			const imageUrl = e.target?.result as string;
			setIsProcessing(true);
			setCapturedImage(imageUrl);

			// 1. Wrap the local image data into standard multipart format
			const formData = new FormData();
			const blob = dataURLtoBlob(imageUrl);
			formData.append("file", blob, file.name);

			try {
				// 2. Network transmission to your local model container
				const apiResponse = await fetch(
					"http://127.0.0.1:8000/predict",
					{
						method: "POST",
						body: formData,
					},
				);

				if (!apiResponse.ok) throw new Error("Prediction failed");

				const data = await apiResponse.json();

				// 3. Complete step, passing the results array to App.tsx
				onCapture(imageUrl, data.results);
			} catch (err) {
				console.error(err);
				onError("detection");
			} finally {
				setIsProcessing(false);
			}
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

				<h1 className="text-4xl mb-8 text-[#1a365d] text-center">
					Skin Scan
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#e2e8f0]">
						<h2 className="text-2xl mb-4 text-[#1a365d]">
							Live Camera
						</h2>

						<div className="relative aspect-square bg-black rounded-2xl overflow-hidden mb-6">
							{/* ALWAYS MOUNTED CANVAS AND VIDEO FOR RELIABLE REF BINDING */}
							<canvas ref={canvasRef} className="hidden" />

							<video
								ref={videoRef}
								autoPlay
								playsInline
								muted
								className={`w-full h-full object-cover transform -scale-x-100 ${
									streamActive ? "block" : "hidden"
								}`}
							/>

							{/* FALLBACK OVERLAY SHOWS ONLY WHILE LOADING */}
							{!streamActive && (
								<div className="absolute inset-0 flex items-center justify-center bg-slate-50">
									<div className="text-center p-4">
										<Camera className="w-16 h-16 text-[#a8d5e2] mx-auto mb-4" />
										<p className="text-[#718096]">
											Connecting to your webcam device...
										</p>
									</div>
								</div>
							)}

							{/* AIMING TARGET BOX OVERLAY */}
							<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
								<div className="w-48 h-48 border-4 border-[#ffd4e5] rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]"></div>
							</div>

							{/* PROCESSING MODEL LOADER SCREEN */}
							{isProcessing && (
								<div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
									<div className="text-center">
										<Loader2 className="w-12 h-12 text-[#a8d5e2] mx-auto mb-4 animate-spin" />
										<p className="text-[#1a365d] text-lg font-medium">
											Analyzing condition profile...
										</p>
										<p className="text-[#718096] text-sm">
											Running TensorFlow inference layers
										</p>
									</div>
								</div>
							)}
						</div>

						<button
							onClick={handleCapture}
							disabled={isProcessing || !streamActive} 
							className="w-full bg-[#ffd4e5] hover:bg-[#ffc0da] disabled:bg-[#e2e8f0] disabled:text-[#cbd5e0] text-[#2d3748] px-8 py-4 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
						>
							<Camera className="w-5 h-5" />
							Capture Image
						</button>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#e2e8f0]">
						<h2 className="text-2xl mb-4 text-[#1a365d]">
							Upload Photo
						</h2>

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
									? "border-[#a8d5e2] bg-[#e0f2fe]"
									: "border-[#e2e8f0] hover:border-[#a8d5e2] hover:bg-[#f7fafc]"
							} flex items-center justify-center mb-6`}
						>
							<div className="text-center p-8">
								<Upload className="w-16 h-16 text-[#a8d5e2] mx-auto mb-4" />
								<p className="text-[#1a365d] text-lg mb-2">
									Drop your image here
								</p>
								<p className="text-[#718096] text-sm">
									or click to browse
								</p>
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
								<strong className="text-[#1a365d]">
									Tips for best results:
								</strong>
							</p>
							<ul className="text-[#4a5568] text-sm mt-2 space-y-1 list-disc list-inside">
								<li>Use good lighting</li>
								<li>Keep the camera steady</li>
								<li>Ensure the area is in focus</li>
							</ul>
						</div>

						<div className="bg-[#f0f4f8] rounded-2xl p-4 border-2 border-[#e2e8f0]">
							<p className="text-[#718096] text-xs mb-3">
								Design Demo: Test Error States
							</p>
							<div className="grid grid-cols-3 gap-2">
								<button
									onClick={() => onError("lighting")}
									className="bg-white hover:bg-[#fff8e1] border-2 border-[#e2e8f0] text-[#2d3748] px-3 py-2 rounded-lg text-xs transition-all"
								>
									Low Light
								</button>
								<button
									onClick={() => onError("blur")}
									className="bg-white hover:bg-[#fff8e1] border-2 border-[#e2e8f0] text-[#2d3748] px-3 py-2 rounded-lg text-xs transition-all"
								>
									Blur
								</button>
								<button
									onClick={() => onError("detection")}
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
