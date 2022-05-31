import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Card = ({
	avatar,
	firstName,
	lastName,
	username,
	id,
	title,
	excerpt,
	image,
	date,
	github,
	link,
	type,
}) => {
	const [isCoverLoading, setIsCoverLoading] = useState(true);
	const [isAvatarLoading, setIsAvatarLoading] = useState(true);

	return (
		<div>
			<div className={`rounded-lg bg-zinc-300 ${isCoverLoading && "animate-pulse"}`}>
				<Link href={`/${type}/${id}`}>
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
			<div className="space-y-1 py-1 lg:py-3">
				<Link href={`/${type}/${id}`}>
					<a>
						<h3 className="text-2xl font-semibold tracking-tight text-zinc-900 transition-colors active:text-blue-600 xl:text-3xl">
							{title}
						</h3>
					</a>
				</Link>
				<p className="prose lg:prose-lg prose-zinc">{excerpt}</p>
				{type === "project" && (
					<p className="space-x-1 text-sm text-blue-600 lg:space-x-3 lg:text-base">
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={github}
							className="hover:underline">
							GitHub
						</a>
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={link}
							className="hover:underline">
							Link
						</a>
					</p>
				)}
				<p className="text-sm font-light text-zinc-600 lg:text-base">Published on {date}</p>
			</div>
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
						<span className="block text-sm font-semibold lg:text-base">
							{firstName} {lastName}
						</span>
						<span className="block text-xs lg:text-sm">@{username}</span>
					</p>
				</a>
			</Link>
		</div>
	);
};

export default Card;
