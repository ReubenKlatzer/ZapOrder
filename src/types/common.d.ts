import _mongoose, { connect } from "mongoose";

declare global {
	declare module "*.svg" {
		import { FC, SVGProps } from "react";

		const SVG: FC<SVGProps<SVGSVGElement>>;
		export default SVG;
	}

	interface NextResponseError {
		status: number;
		message: string;
	}

	// eslint-disable-next-line no-var
	var mongoose: {
		promise: ReturnType<undefined | typeof connect>;
		conn: typeof _mongoose | null;
	};

	namespace JSX {
		interface IntrinsicElements {
			"model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
				src?: string;
				"ios-src"?: string;
				alt?: string;
				ar?: boolean | string;
				"ar-modes"?: string;
				"camera-controls"?: boolean | string;
				"auto-rotate"?: boolean | string;
				"shadow-intensity"?: string;
				poster?: string;
			};
		}
	}
}
