import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Card = ({
	index,
	avatar,
	firstName,
	lastName,
	username,
	title,
	slug,
	excerpt,
	image,
	date,
	tags,
	windowWidth,
}) => {
	const [isCoverLoading, setIsCoverLoading] = useState(true);
	const [isAvatarLoading, setIsAvatarLoading] = useState(true);
	const [isShowMore, setIsShowMore] = useState(false);

	const formatDate = new Date(date);

	if (index === 0 && windowWidth >= 1024) {
		return (
			<div className="col-span-3">
				<div className="grid grid-cols-3 gap-5">
					<div
						className={`col-span-2 rounded-lg bg-zinc-300 ${
							isCoverLoading && "animate-pulse"
						}`}>
						<Link href={`/blog/${slug}`}>
							<a tabIndex={-1}>
								<Image
									src={image}
									alt={title}
									width="16"
									height="9"
									layout="responsive"
									objectFit="cover"
									objectPosition="center center"
									className="rounded-lg"
									onLoad={() => setIsCoverLoading(false)}
								/>
							</a>
						</Link>
					</div>
					<div className="flex flex-col justify-between gap-5">
						<div className="space-y-1">
							<div className="pb-1">
								<div className="space-x-1 text-sm font-semibold lg:space-x-3 lg:text-base">
									{tags &&
										tags.map((tag, index) => (
											<span key={index} className="text-blue-600">
												{tag.attributes.tag}
											</span>
										))}
								</div>
							</div>
							<Link href={`/blog/${slug}`}>
								<a>
									<h3 className="text-3xl font-semibold tracking-tighter text-zinc-900 transition-colors active:text-blue-600 xl:text-4xl">
										{title}
									</h3>
								</a>
							</Link>
							<div>
								<p
									className={`prose-lg prose-zinc ${
										!isShowMore ? "line-clamp-5" : ""
									} lg:prose-xl`}>
									{excerpt}
								</p>
								{excerpt.split(" ").length >= 24 && (
									<button
										onClick={() => setIsShowMore((isShowMore) => !isShowMore)}
										className="font-semibold text-zinc-600 lg:text-lg">
										Show {isShowMore ? "Less" : "More"}
									</button>
								)}
							</div>
						</div>
						<Link href={`/profile/${username}`}>
							<a className="mt-3 flex items-center gap-3">
								<div
									className={`h-14 w-14 flex-shrink-0 rounded-full bg-zinc-300 lg:h-16 lg:w-16 ${
										isAvatarLoading && "animate-pulse"
									}`}>
									<Image
										src={avatar}
										alt={username}
										width="1"
										height="1"
										layout="responsive"
										objectFit="cover"
										objectPosition="center center"
										className="rounded-full"
										onLoad={() => setIsAvatarLoading(false)}
									/>
								</div>
								<p className="text-zinc-600">
									<span className="block text-lg font-semibold lg:text-xl">
										{firstName} {lastName}
									</span>
									<span className="block lg:text-lg">
										{formatDate.toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</span>
								</p>
							</a>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col justify-between gap-3 lg:gap-5">
			<div className="space-y-3 lg:space-y-5">
				<div className={`rounded-lg bg-zinc-300 ${isCoverLoading && "animate-pulse"}`}>
					<Link href={`/blog/${slug}`}>
						<a tabIndex={-1}>
							<Image
								src={image}
								alt={title}
								width="16"
								height="9"
								layout="responsive"
								objectFit="cover"
								objectPosition="center center"
								className="rounded-lg"
								onLoad={() => setIsCoverLoading(false)}
							/>
						</a>
					</Link>
				</div>
				<div className="space-y-1">
					<div className="pb-1">
						<div className="space-x-1 text-xs font-semibold lg:space-x-3 lg:text-sm">
							{tags &&
								tags.map((tag, index) => (
									<span key={index} className="text-blue-600">
										{tag.attributes.tag}
									</span>
								))}
						</div>
					</div>
					<Link href={`/blog/${slug}`}>
						<a>
							<h3 className="text-2xl font-semibold tracking-tighter text-zinc-900 transition-colors active:text-blue-600 xl:text-3xl">
								{title}
							</h3>
						</a>
					</Link>
					<div>
						<p
							className={`prose prose-zinc ${
								!isShowMore ? "line-clamp-3" : ""
							} lg:prose-lg`}>
							{excerpt}
						</p>
						{excerpt.split(" ").length >= 16 && (
							<button
								onClick={() => setIsShowMore((isShowMore) => !isShowMore)}
								className="text-sm font-semibold text-zinc-600 lg:text-base">
								Show {isShowMore ? "Less" : "More"}
							</button>
						)}
					</div>
				</div>
			</div>
			{avatar && (
				<Link href={`/profile/${username}`}>
					<a className="mt-3 flex items-center gap-3">
						<div
							className={`h-12 w-12 rounded-full bg-zinc-300 lg:h-14 lg:w-14 ${
								isAvatarLoading && "animate-pulse"
							}`}>
							<Image
								src={avatar}
								alt={username}
								width="1"
								height="1"
								layout="responsive"
								objectFit="cover"
								objectPosition="center center"
								className="rounded-full"
								onLoad={() => setIsAvatarLoading(false)}
							/>
						</div>
						<p className="text-zinc-600">
							<span className="block font-semibold lg:text-lg">
								{firstName} {lastName}
							</span>
							<span className="block text-sm lg:text-base">
								{formatDate.toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</span>
						</p>
					</a>
				</Link>
			)}
		</div>
	);
};

export default Card;
