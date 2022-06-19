import Link from "next/link";
import UserContext from "@lib/userContext";
import Image from "next/image";
import { Fragment, useContext, useState } from "react";
import { useRouter } from "next/router";
import { XIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";

const pageLinks = [
	{ name: "Home", link: "/" },
	{ name: "Blogs", link: "/blog" },
	{ name: "Projects", link: "/project" },
	{ name: "Events", link: "/event" },
];

const Sidebar = ({ isOpen, toggle }) => {
	const [isAvatarLoading, setIsAvatarLoading] = useState(true);
	const { user, setUser } = useContext(UserContext);
	const router = useRouter();

	const handleLogout = () => {
		setUser(null);
		// removeToken();
		toggle();
	};

	return (
		<Transition
			show={isOpen}
			as={Fragment}
			enter="transition transform"
			enterFrom="translate-x-full opacity-0"
			enterTo="translate-x-0 opacity-100"
			leave="transition transform"
			leaveFrom="translate-x-0 opacity-100"
			leaveTo="translate-x-full opacity-0">
			<div
				className="fixed inset-0 z-50 flex w-full flex-col items-start justify-center gap-5 bg-white px-5"
				role="navigation">
				<XIcon
					onClick={toggle}
					className="absolute right-5 top-5 h-6 w-6 cursor-pointer text-zinc-600 transition-colors active:text-blue-600"
				/>

				<Link href="/">
					<a onClick={toggle} className="text-5xl font-bold text-zinc-900">
						Studier
					</a>
				</Link>

				<ul className="flex w-full flex-col items-start gap-3 py-5 text-lg font-semibold">
					{user && (
						<li className="flex w-full items-center justify-between gap-3">
							<Link href={`/profile/${user.username}`}>
								<a onClick={toggle} className="inline-flex items-center gap-2">
									<span
										className={`h-14 w-14 flex-shrink-0 rounded-full bg-zinc-300 ${
											isAvatarLoading && "animate-pulse"
										}`}>
										<Image
											src={`http://localhost:1337${user.avatar}`}
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
										<span className="block font-semibold">
											{user.firstName} {user.lastName}
										</span>
										<span className="block text-sm">@{user.username}</span>
									</span>
								</a>
							</Link>
							<div>
								<button
									onClick={handleLogout}
									className="rounded-lg bg-blue-600 py-1 px-2 font-semibold text-white transition-colors active:bg-blue-700 lg:text-lg">
									Logout
								</button>
							</div>
						</li>
					)}
					{pageLinks.map(({ name, link }, index) => (
						<li key={index}>
							<Link href={link}>
								<a
									onClick={toggle}
									className={`${
										router.pathname == link
											? "font-semibold text-zinc-900"
											: "font-normal text-zinc-600"
									} rounded-lg py-1 px-1 transition-colors hover:bg-blue-100 active:text-blue-600`}>
									{name}
								</a>
							</Link>
						</li>
					))}
					{!user && (
						<>
							<li>
								<Link href="/login">
									<a
										onClick={toggle}
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
									<a
										onClick={toggle}
										className="rounded-lg bg-blue-600 py-1 px-2 font-semibold text-white transition-colors active:bg-blue-700 lg:text-lg">
										Register
									</a>
								</Link>
							</li>
						</>
					)}
				</ul>
			</div>
		</Transition>
	);
};

export default Sidebar;
