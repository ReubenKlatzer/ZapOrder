import { scrollToSection } from "#utils/helper/common";
import "./navbar.scss";

export default function Navbar({ menuOpen, setMenuOpen }: TNavBarProps) {
	return (
		<div className="homeNavbar" id="homepage-navBar">
			<div className="logo" onClick={() => scrollToSection()}>
				ZAP ORDER
			</div>
			<div className={`menu ${menuOpen ? "open" : ""}`}>
				<div className="icon round" onClick={() => setMenuOpen(!menuOpen)}>
					<span className="line1" />
					<span className="line2" />
				</div>
				<div className="container">
					{["About Us", "Features"].map((item, key) => {
						return (
							<div
								key={key}
								className="item"
								onClick={() => {
									scrollToSection(`homepage-${item.toLowerCase().replace(/ /g, "")}`);
									setMenuOpen(false);
								}}>
								<p>{item}</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

type TNavBarProps = {
	menuOpen: boolean;
	setMenuOpen: (menuOpen: boolean) => void;
};
