import Link from "next/link";

const pageLinks = [
	{ name: "Home", link: "/" },
	{ name: "Blog", link: "/blog" },
];

const Footer = () => {
	return (
		<footer className="absolute bottom-0 z-0 w-full space-y-3 border-t border-zinc-200 bg-white py-3 text-center print:hidden">
			<div className="container flex justify-between">
				<div className="space-y-3">
					<h4 className="text-left text-2xl font-bold tracking-tighter text-zinc-900 lg:text-3xl">
						Studier
					</h4>
					<div className="space-y-1">
						<p className="text-sm text-zinc-600 lg:text-base">
							Lorem ipsum dolor sit amet.
						</p>
						<p className="text-left text-xs font-light text-zinc-600 lg:text-sm">
							&#169; Studier
						</p>
					</div>
				</div>
				<div className="flex flex-col items-start gap-3">
					<h5 className="text-lg font-semibold tracking-tighter text-zinc-900 lg:text-xl">
						Page Links
					</h5>
					<ul className="flex flex-col items-start gap-1">
						{pageLinks.map(({ name, link }, index) => (
							<li key={index}>
								<Link href={link}>
									<a className="text-sm text-zinc-600 transition-colors active:text-blue-600 lg:text-base">
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
