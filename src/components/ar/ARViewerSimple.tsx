"use client";

import "./arViewer.scss";

type TARViewerProps = {
	item: { name: string; image?: string | null; price: number; description?: string | null };
	onClose: () => void;
};

// Simple version - just shows the image in a nice modal
const ARViewerSimple = ({ item, onClose }: TARViewerProps) => {
	return (
		<div className="arViewerOverlay" onClick={onClose}>
			<div className="arViewerModal" onClick={(e) => e.stopPropagation()}>
				<div className="arViewerHeader">
					<div className="arViewerTitle">
						<span>{item.name}</span>
						<span className="arViewerPrice">R{item.price.toFixed(2)}</span>
					</div>
					<button className="arViewerClose" onClick={onClose} aria-label="Close">✕</button>
				</div>
				
				<div className="arViewerError">
					{item.image ? (
						<img src={item.image} alt={item.name} className="arFallbackImage" />
					) : (
						<div className="arPlaceholder">🍽️</div>
					)}
					<p className="arErrorText">{item.name}</p>
					<p className="arErrorHint">3D viewer coming soon!</p>
				</div>
				
				<div className="arViewerFooter">
					{item.description && <p className="arViewerDescription">{item.description}</p>}
				</div>
			</div>
		</div>
	);
};

export default ARViewerSimple;
