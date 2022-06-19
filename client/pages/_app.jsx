import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";
import ScrollButton from "@components/ScrollButton";
import { useState, useEffect } from "react";
import { UserProvider } from "@lib/userContext";
import "../styles/globals.css";

const App = ({ Component, pageProps, userData }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => {
		setIsOpen((isOpen) => !isOpen);
	};

	useEffect(() => {
		const hideMenu = () => {
			if (window.innerWidth > 768 && isOpen) {
				setIsOpen(false);
			}
		};

		window.addEventListener("resize", hideMenu);

		return () => {
			window.removeEventListener("resize", hideMenu);
		};
	});

	return (
		<UserProvider value={userData}>
			<ScrollButton />
			<Navbar toggle={toggle} />
			<Sidebar isOpen={isOpen} toggle={toggle} />
			<Component {...pageProps} />
			<Footer />
		</UserProvider>
	);
};

export default App;

App.getInitialProps = async (context) => {
	let userData = null;
	try {
		userData = await fetch("http://localhost:3000/api/login");
		userData = await userData.json();
	} catch (err) {
		userData = null;
	}
	return { userData };
};
