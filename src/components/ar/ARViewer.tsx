"use client";

import { useEffect, useState } from "react";
import "./arViewer.scss";

type TARViewerProps = {
	item: { name: string; image?: string | null; price: number; description?: string | null };
	onClose: () => void;
};

const ARViewer = ({ item, onClose }: TARViewerProps) => {
	const [modelLoaded, setModelLoaded] = useState(false);
	const [modelError, setModelError] = useState(false);

	useEffect(() => {
		// Load model-viewer library
		if (typeof window !== "undefined") {
			console.log('🔄 Loading model-viewer library...');
			import("@google/model-viewer")
				.then(() => {
					console.log('✅ Model-viewer loaded successfully');
					setModelLoaded(true);
				})
				.catch((err) => {
					console.error('❌ Failed to load model-viewer:', err);
					setModelError(true);
				});
		}

		// Add escape key handler
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [onClose]);

	const modelSrc = `/models/${item.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}.glb`;

	console.log('📦 Model path:', modelSrc);
	console.log('🎬 Model loaded:', modelLoaded);
	console.log('❌ Model error:', modelError);

	const handleModelError = (e?: any) => {
		console.error('❌ Model failed to load:', modelSrc, e);
		setModelError(true);
	};

	const handleModelLoad = () => {
		console.log('✅ Model loaded successfully:', modelSrc);
		setModelError(false);
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleCloseClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClose();
	};

	return (
		<div className="arViewerOverlay" onClick={handleOverlayClick}>
			<div className="arViewerModal" onClick={(e) => e.stopPropagation()}>
				<div className="arViewerHeader">
					<div className="arViewerTitle">
						<span>{item.name}</span>
						<span className="arViewerPrice">R{item.price.toFixed(2)}</span>
					</div>
					<button className="arViewerClose" onClick={handleCloseClick} aria-label="Close">✕</button>
				</div>
				
				{!modelLoaded ? (
					<div className="arViewerLoading">
						<div className="spinner" />
						<p>Loading 3D viewer...</p>
					</div>
				) : modelError ? (
					<div className="arViewerError">
						{item.image ? (
							<img src={item.image} alt={item.name} className="arFallbackImage" />
						) : (
							<div className="arPlaceholder">🍽️</div>
						)}
						<p className="arErrorText">3D model not available</p>
						<p className="arErrorHint">Showing product image instead</p>
					</div>
				) : (
					// @ts-expect-error - model-viewer is a custom element
					<model-viewer
						class="arViewerModel"
						src={modelSrc}
						alt={`3D model of ${item.name}`}
						camera-controls
						auto-rotate
						shadow-intensity="1"
						poster={item.image || undefined}
						onLoad={handleModelLoad}
						onError={handleModelError}
					/>
				)}
				
				<div className="arViewerFooter">
					{item.description && <p className="arViewerDescription">{item.description}</p>}
					{!modelError && modelLoaded && (
						<span className="arViewerHint">
							<span className="arHintDesktop">🖱️ Drag to rotate · Scroll to zoom</span>
							<span className="arHintMobile">👆 Drag to rotate · Pinch to zoom</span>
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default ARViewer;
