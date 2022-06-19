import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html lang="en" className="h-full scroll-smooth">
				<Head>
					<meta name="author" content="Vatsal Sakariya" />
					<meta charSet="UTF-8" />

					<link rel="icon" href="/icon/favicon.ico" />
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/icon/apple-touch-icon.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="/icon/favicon-32x32.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="/icon/favicon-16x16.png"
					/>
					<link rel="manifest" href="/icon/site.webmanifest" />
				</Head>
				<body className="relative min-h-full subpixel-antialiased transition-colors duration-300 selection:bg-blue-100 selection:text-zinc-900">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
