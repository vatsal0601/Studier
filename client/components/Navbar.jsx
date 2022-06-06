import Link from "next/link";
import Image from "next/image";
import UserContext from "@lib/userContext";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { MenuAlt2Icon } from "@heroicons/react/solid";
import { removeToken } from "@lib/auth";

const pageLinksLeft = [
	{ name: "Home", link: "/" },
	{ name: "Blogs", link: "/blog" },
	{ name: "Projects", link: "/project" },
	{ name: "Events", link: "/event" },
];

const Navbar = ({ toggle }) => {
	const router = useRouter();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isAvatarLoading, setIsAvatarLoading] = useState(true);
	const { user, setUser } = useContext(UserContext);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) setIsScrolled(true);
			else setIsScrolled(false);
		};
		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	});

	const handleLogout = () => {
		setUser(null);
		removeToken();
	};

	return (
		<header
			className={`sticky top-0 z-40 w-full flex-shrink-0 border-b bg-white ${
				isScrolled ? "border-zinc-200" : "border-transparent"
			} transition duration-300 print:hidden`}>
			<nav className="container flex items-center justify-between py-3" role="navigation">
				<div className="flex items-center gap-10 lg:gap-16">
					<Link href="/">
						<a className="text-3xl font-bold tracking-tighter text-zinc-900 transition-colors active:text-blue-600 lg:text-4xl">
							Studier
						</a>
					</Link>
					<div className="hidden items-center divide-x divide-zinc-200 md:flex">
						<ul className="flex items-center gap-3 font-semibold lg:gap-5">
							{pageLinksLeft.map(({ name, link }, index) => (
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
				</div>
				{user ? (
					<ul className="hidden items-center gap-3 md:flex lg:gap-5">
						<li>
							<Link href={`/profile/${user.username}`}>
								<a className="inline-flex items-center gap-2">
									<span
										className={`h-10 w-10 flex-shrink-0 rounded-full bg-zinc-300 lg:h-12 lg:w-12 ${
											isAvatarLoading && "animate-pulse"
										}`}>
										<Image
											src={`http://localhost:1337${user.avatar.data.attributes.formats.thumbnail.url}`}
											alt={user.username}
											width="1"
											height="1"
											layout="responsive"
											objectFit="cover"
											objectPosition="center center"
											className="rounded-full"
											onLoad={() => setIsAvatarLoading(false)}
										/>
									</span>
									<span className="text-zinc-600">
										<span className="block text-sm font-semibold lg:text-base">
											{user.firstName} {user.lastName}
										</span>
										<span className="block text-xs lg:text-sm">
											@{user.username}
										</span>
									</span>
								</a>
							</Link>
						</li>
						<li>
							<button
								onClick={handleLogout}
								className="rounded-lg bg-blue-600 py-1 px-2 font-semibold text-white transition-colors active:bg-blue-700 lg:text-lg">
								Logout
							</button>
						</li>
					</ul>
				) : (
					<ul className="hidden items-center gap-3 font-semibold md:flex lg:gap-5">
						<li>
							<Link href="/login">
								<a
									className={`${
										router.pathname == "/login"
											? "font-semibold text-zinc-900"
											: "font-normal text-zinc-600"
									} rounded-lg py-1 px-1 transition-colors hover:bg-blue-100 active:text-blue-600 lg:px-2 lg:text-lg`}>
									Login
								</a>
							</Link>
						</li>
						<li>
							<Link href="/register">
								<a className="rounded-lg bg-blue-600 py-1 px-2 font-semibold text-white transition-colors active:bg-blue-700 lg:text-lg">
									Register
								</a>
							</Link>
						</li>
					</ul>
				)}
				<MenuAlt2Icon
					onClick={toggle}
					className="h-6 w-6 cursor-pointer transition-colors active:text-blue-600 md:hidden"
				/>
			</nav>
		</header>
	);
};

export default Navbar;
