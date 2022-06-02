import Link from "next/link";

const pageLinks = [
	{ name: "Home", link: "/" },
	{ name: "Blog", link: "/blog" },
];

const Footer = () => {
	return (
		<footer className="absolute bottom-0 z-0 w-full space-y-3 border-t border-zinc-200 bg-white py-3 print:hidden">
			<div className="container space-y-5 sm:flex sm:justify-between sm:gap-3 sm:space-y-0">
				<div className="space-y-3">
					<div className="space-y-1">
						<h4 className="text-2xl font-bold tracking-tighter text-zinc-900 lg:text-3xl">
							Studier
						</h4>
						<p className="max-w-xs text-zinc-600 lg:max-w-sm lg:text-lg">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam minus
						</p>
					</div>
					<p className="text-sm font-light text-zinc-600 lg:text-base">
						&#169; Studier. All rights reserverd
					</p>
				</div>
				<div className="space-y-3">
					<h5 className="text-xl font-semibold tracking-tighter text-zinc-900 lg:text-2xl">
						Page Links
					</h5>
					<ul className="space-y-1">
						{pageLinks.map(({ name, link }, index) => (
							<li key={index}>
								<Link href={link}>
									<a className="text-zinc-600 transition-colors active:text-blue-600 lg:text-lg">
										{name}
									</a>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
