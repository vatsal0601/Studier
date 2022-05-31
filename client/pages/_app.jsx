import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import "../styles/globals.css";

function App({ Component, pageProps }) {
	return (
		<>
			<Navbar />
			<Component {...pageProps} />
			<Footer />
		</>
	);
}

export default App;
