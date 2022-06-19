import Head from "next/head";

const Header = ({ title, description, keywords }) => {
	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
