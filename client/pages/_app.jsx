import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";
import ScrollButton from "@components/ScrollButton";
import Loading from "@components/Loading";
import { useState, useEffect } from "react";
import { UserProvider } from "@lib/userContext";
import { getUserFromLocalCookie } from "@lib/auth";
import "../styles/globals.css";

const App = ({ Component, pageProps }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);

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

	useEffect(() => {
		const fetchUser = async () => {
			const userData = await getUserFromLocalCookie();
			if (userData) {
				setUser({
					id: userData.usersPermissionsUsers.data[0].id,
					...userData.usersPermissionsUsers.data[0].attributes,
				});
			}
			setIsLoading(false);
		};
		fetchUser();
	}, []);

	if (isLoading)
		return (
			<p className="grid h-screen place-content-center text-center text-4xl font-semibold tracking-tighter text-blue-600 lg:text-5xl">
				<span className="inline-flex items-center gap-3 lg:gap-5">
					<span>
						<Loading className="h-10 w-10 text-blue-600 lg:h-12 lg:w-12" />
					</span>
					<span>Loading...</span>
				</span>
			</p>
		);

	return (
		<UserProvider value={user}>
			<ScrollButton />
			<Navbar toggle={toggle} />
			<Sidebar isOpen={isOpen} toggle={toggle} />
			<Component {...pageProps} />
			<Footer />
		</UserProvider>
	);
};

export default App;
