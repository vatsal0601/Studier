import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const pageLinks = [
	{ name: "Home", link: "/" },
	{ name: "Blog", link: "/blog" },
];

const Navbar = () => {
	const router = useRouter();
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) setIsScrolled(true);
			else setIsScrolled(false);
		};
		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	});

	return (
		<header
			className={`fixed top-0 z-50 w-full border-b bg-white ${
				isScrolled ? "border-zinc-200" : "border-transparent"
			} transition-colors duration-300 print:hidden`}>
			<nav
				className="container relative flex items-center justify-between py-3"
				role="navigation">
				<Link href="/">
					<a className="text-3xl font-bold tracking-tighter text-zinc-900 transition-colors active:text-blue-600 lg:text-4xl">
						Studier
					</a>
				</Link>

				<div className="flex items-center divide-x divide-zinc-200">
					<ul className="flex items-center gap-1 font-semibold lg:gap-5">
						{pageLinks.map(({ name, link }, index) => (
							<li key={index}>
								<Link href={link}>
									<a
										className={`${
											router.pathname == link
												? "font-semibold text-zinc-900"
												: "font-normal text-zinc-600"
										} rounded-lg py-1 px-1 transition-colors hover:bg-blue-100 active:text-blue-600 lg:px-2 lg:text-lg`}>
										{name}
									</a>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
