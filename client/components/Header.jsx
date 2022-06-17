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
			<link rel="icon" href="/icon/favicon.ico" />
			<link rel="apple-touch-icon" sizes="180x180" href="/icon/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/icon/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/icon/favicon-16x16.png" />
			<link rel="manifest" href="/icon/site.webmanifest" />
		</Head>
	);
};

Header.defaultProps = {
	title: "Studier",
	description:
		"A portal for easily connecting and collaborating with other people from your university.",
	keywords: "studier, students, ease, connection, collaboration, university",
};

export default Header;
