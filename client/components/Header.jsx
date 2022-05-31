import Head from "next/head";

const Header = ({ title, description, keywords }) => {
	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			<meta name="author" content="Vatsal Sakariya" />
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
	);
};

Header.defaultProps = {
	title: "Studier",
	description: "Studier",
	keywords: "Studier",
};

export default Header;
