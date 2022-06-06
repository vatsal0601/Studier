import Image from "next/image";
import Head from "@components/Header";
import Card from "@components/BlogCard";
import { AtSymbolIcon, HashtagIcon, InboxIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { handleFetch } from "@lib/handleFetch";
import { GetAllUsernames, GetUser } from "@lib/queries";

const Profile = ({ user }) => {
	const [isAvatarLoading, setIsAvatarLoading] = useState(true);
	const formatStartYear = new Date(user.startYear);
	const formatGraduationYear = new Date(user.graduationYear);

	return (
		<>
			<Head title={`${user.firstName} ${user.lastName} - ${user.username}`} />
			<main className="container space-y-10 pb-96 pt-24 lg:space-y-20 lg:pb-64 lg:pt-32">
				<section className="space-y-3 lg:space-y-5">
					<div className="space-y-10 lg:flex lg:items-center lg:justify-center lg:gap-10 lg:space-y-0">
						<div className="mx-auto w-max rounded-full border-2 border-blue-600 p-2 lg:mx-0">
							<div
								className={`h-36 w-36 rounded-full bg-zinc-300 lg:h-48 lg:w-48 ${
									isAvatarLoading && "animate-pulse"
								}`}>
								<Image
									src={`http://localhost:1337${
										user.avatar.data.attributes.formats.small
											? user.avatar.data.attributes.formats.small.url
											: user.avatar.data.attributes.formats.thumbnail.url
									}`}
									alt={user.username}
									width="1"
									height="1"
									layout="responsive"
									objectFit="cover"
									objectPosition="center center"
									className="rounded-full"
									onLoad={() => setIsAvatarLoading(false)}
								/>
							</div>
						</div>
						<div className="space-y-1">
							<div className="flex items-center justify-center gap-3 lg:justify-start lg:gap-5">
								<h1 className="text-4xl font-bold tracking-tighter text-blue-600 lg:text-5xl">
									{user.firstName} {user.lastName}
								</h1>
								<p className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 lg:text-sm">
									{user.type}
								</p>
							</div>
							<p className="flex items-center justify-center gap-5 lg:justify-start lg:gap-10">
								<span className="inline-flex items-center gap-1 text-zinc-600 lg:text-lg">
									<AtSymbolIcon className="h-5 w-5 text-blue-600 lg:h-7 lg:w-7" />
									<span>{user.username}</span>
								</span>
								<span className="inline-flex items-center gap-1 text-zinc-600 lg:text-lg">
									<InboxIcon className="h-5 w-5 text-blue-600 lg:h-7 lg:w-7" />
									<span>{user.email}</span>
								</span>
							</p>
							<p className="text-center text-zinc-600 lg:text-left lg:text-lg">
								{user.branch}
							</p>
							<div className="space-x-1 text-center text-zinc-600 lg:text-left lg:text-lg">
								<span>{user.university.data.attributes.name}</span>
								<span>
									[
									{formatStartYear.toLocaleDateString("en-US", {
										year: "numeric",
										month: "2-digit",
									})}{" "}
									&#8212;{" "}
									{formatGraduationYear.toLocaleDateString("en-US", {
										year: "numeric",
										month: "2-digit",
									})}
									]
								</span>
							</div>
							<div className="space-x-3 text-center text-blue-600 lg:space-x-5 lg:text-left lg:text-lg">
								{user.socialLinks.data.length > 0 &&
									user.socialLinks.data.map((socialLink, index) => (
										<a href={socialLink.attributes.url} key={index}>
											{socialLink.attributes.appName}
										</a>
									))}
							</div>
							<div className="space-x-3 text-center text-zinc-600 lg:space-x-5 lg:text-left lg:text-lg">
								{user.interests.data.length > 0 &&
									user.interests.data.map((interest, index) => (
										<span
											className="inline-flex items-center gap-1"
											key={index}>
											<HashtagIcon className="h-5 w-5 text-zinc-600" />
											{interest.attributes.interest}
										</span>
									))}
							</div>
						</div>
					</div>
					<p className="prose prose-zinc mx-auto lg:prose-lg">{user.bio}</p>
				</section>
				<section className="space-y-3 lg:space-y-5">
					<h1 className="text-3xl font-bold tracking-tighter text-zinc-900 lg:text-4xl">
						Blogs
					</h1>
					<div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-10">
						{user.blogs.data.map((blog, index) => (
							<Card
								key={index}
								index={index}
								title={blog.attributes.title}
								slug={blog.attributes.slug}
								excerpt={blog.attributes.excerpt}
								image={`http://localhost:1337${
									index === 0
										? blog.attributes.cover.data.attributes.formats.large.url
										: blog.attributes.cover.data.attributes.formats.small.url
								}`}
								date={blog.attributes.createdAt}
								tags={blog.attributes.tags.data}
							/>
						))}
					</div>
				</section>
			</main>
		</>
	);
};

export default Profile;

export const getStaticPaths = async () => {
	const data = await handleFetch(GetAllUsernames);
	const usernamesData = data.usersPermissionsUsers.data;
	const usernames = usernamesData.map((username) => ({
		params: {
			username: username.attributes.username,
		},
	}));

	return {
		paths: usernames,
		fallback: true,
	};
};

export const getStaticProps = async (context) => {
	const { username } = context.params;

	const data = await handleFetch(GetUser(username));
	const user = data.usersPermissionsUsers.data[0].attributes;

	return {
		props: {
			user,
		},
	};
};
