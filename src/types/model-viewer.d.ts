declare namespace JSX {
	interface IntrinsicElements {
		"model-viewer": ModelViewerJSX & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
	}
}

interface ModelViewerJSX {
	src?: string;
	"ios-src"?: string;
	alt?: string;
	ar?: boolean;
	"ar-modes"?: string;
	"camera-controls"?: boolean;
	"auto-rotate"?: boolean;
	"auto-rotate-delay"?: string;
	"rotation-per-second"?: string;
	"shadow-intensity"?: string;
	"environment-image"?: string;
	exposure?: string;
	poster?: string;
	loading?: string;
	class?: string;
	onLoad?: () => void;
	onError?: (e: Event) => void;
}
