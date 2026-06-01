import "./noContent.scss";

const NoContent = (props: TNoContentProps) => {
	const { label } = props;
	return (
		<div className="noContent">
			<div>
				{label && <p>{label}</p>}
			</div>
		</div>
	);
};

export default NoContent;

export type TNoContentProps = {
	animationName?: string;
	label: string;
	size?: number;
	speed?: number;
};
