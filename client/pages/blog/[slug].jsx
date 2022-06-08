import Head from "@components/Header";
import Image from "next/image";
import Link from "next/link";
import Markdown from "@components/Markdown";
import UserContext from "@lib/userContext";
import { useContext, useEffect, useState } from "react";
import { handleFetch } from "@lib/handleFetch";
import {
	CreateBookmark,
	CreateLike,
	DeleteBookmark,
	DeleteLike,
	GetAllBlogSlugs,
	GetBlog,
	GetUserDataOfBlog,
} from "@lib/queries";
import { HeartIcon, BookmarkIcon } from "@heroicons/react/outline";
import {
	HeartIcon as HeartIconSolid,
	BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/solid";
import Loading from "@components/Loading";
import { getTokenFromLocalCookie } from "@lib/auth";

const Blog = ({ blog }) => {
	const blogData = blog.attributes;

	const [isCoverLoading, setIsCoverLoading] = useState(true);
	const [isAvatarLoading, setIsAvatarLoading] = useState(true);
	const [blogLikesNumber, setBlogLikesNumber] = useState(blogData.likes.data.length);
	const [isBookmarked, setIsBookmarked] = useState(null);
	const [isBookmarkLoading, setIsBookmarkLoading] = useState(true);
	const [isLiked, setIsLiked] = useState(null);
	const [isLikeLoading, setIsLikeLoading] = useState(true);
	const formatedDate = new Date(blogData.createdAt);

	const { user } = useContext(UserContext);

	useEffect(() => {
		if (user) {
			const fetchData = async () => {
				const userData = await handleFetch(GetUserDataOfBlog(blogData.slug, user.username));
				userData = userData.blogs.data[0].attributes;
				if (userData.bookmarks.data.length > 0) {
					setIsBookmarked(+userData.bookmarks.data[0].id);
					setIsBookmarkLoading(false);
				} else {
					setIsBookmarkLoading(false);
				}
				if (userData.likes.data.length > 0) {
					setIsLiked(+userData.likes.data[0].id);
					setIsLikeLoading(false);
				} else {
					setIsLikeLoading(false);
				}
			};
			fetchData();
		}
	}, []);

	const handleBookmark = async () => {
		setIsBookmarkLoading(true);
		const jwt = getTokenFromLocalCookie();
		if (isBookmarked) {
			try {
				await handleFetch(DeleteBookmark(isBookmarked), {
					Authorization: `Bearer ${jwt}`,
				});
				setIsBookmarked(null);
			} catch (err) {
				console.log(err);
			} finally {
				setIsBookmarkLoading(false);
			}
		} else {
			try {
				const bookmarkId = await handleFetch(CreateBookmark(+blog.id, +user.id), {
					Authorization: `Bearer ${jwt}`,
				});
				setIsBookmarked(+bookmarkId.createBookmark.data.id);
			} catch (err) {
				console.log(err);
			} finally {
				setIsBookmarkLoading(false);
			}
		}
	};

	const handleLike = async () => {
		setIsLikeLoading(true);
		const jwt = getTokenFromLocalCookie();
		if (isLiked) {
			try {
				await handleFetch(DeleteLike(isLiked), {
					Authorization: `Bearer ${jwt}`,
				});
				setIsLiked(null);
				setBlogLikesNumber((blogLikesNumber) => (blogLikesNumber -= 1));
			} catch (err) {
				console.log(err);
			} finally {
				setIsLikeLoading(false);
			}
		} else {
			try {
				const likeId = await handleFetch(CreateLike(+blog.id, +user.id), {
					Authorization: `Bearer ${jwt}`,
				});
				setIsLiked(+likeId.createLike.data.id);
				setBlogLikesNumber((blogLikesNumber) => (blogLikesNumber += 1));
			} catch (err) {
				console.log(err);
			} finally {
				setIsLikeLoading(false);
			}
		}
	};

	return (
		<>
			<Head title={blogData.title} description={blogData.excerpt} />
			<main>
				<article className="container space-y-8 pb-96 pt-24 lg:space-y-16 lg:pb-64 lg:pt-32">
					<section className="space-y-8 lg:space-y-16">
						<div className="space-y-3 self-center lg:space-y-5">
							<h1 className="text-center text-4xl font-bold tracking-tighter text-blue-600 lg:text-5xl">
								{blogData.title}
							</h1>
							<p className="prose prose-zinc mx-auto pb-3 text-center lg:prose-lg lg:pb-5">
								{blogData.excerpt}
							</p>
							<div
								className={`mx-auto flex max-w-prose items-center ${
									user ? "justify-between" : "justify-center"
								} gap-3 lg:text-lg`}>
								<Link href={`/profile/${blogData.user.data.attributes.username}`}>
									<a className="flex items-center gap-3">
										<div
											className={`h-14 w-14 flex-shrink-0 rounded-full bg-zinc-300 lg:h-16 lg:w-16 ${
												isAvatarLoading && "animate-pulse"
											}`}>
											<Image
												src={`http://localhost:1337${blogData.user.data.attributes.avatar.data.attributes.formats.thumbnail.url}`}
												alt={blogData.user.data.attributes.username}
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
												<span>
													{blogData.user.data.attributes.firstName}{" "}
													{blogData.user.data.attributes.lastName}
												</span>
											</span>
											<span className="block text-sm lg:text-base">
												{formatedDate.toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</span>
										</p>
									</a>
								</Link>
								{user && (
									<div className="flex items-center gap-3 lg:gap-5">
										{isBookmarkLoading ? (
											<div className="flex flex-col items-center justify-center gap-1">
												<span>
													<Loading className="h-4 w-4 text-blue-600 lg:h-5 lg:w-5" />
												</span>
												<span className="text-xs lg:text-sm">Loading</span>
											</div>
										) : (
											<button
												onClick={handleBookmark}
												className="text-blue-600 transition-colors active:text-blue-700">
												{isBookmarked ? (
													<BookmarkIconSolid className="h-6 w-6 lg:h-8 lg:w-8" />
												) : (
													<BookmarkIcon className="h-6 w-6 lg:h-8 lg:w-8" />
												)}
											</button>
										)}
										{isLikeLoading ? (
											<div className="flex flex-col items-center justify-center gap-1">
												<span>
													<Loading className="h-4 w-4 text-blue-600 lg:h-5 lg:w-5" />
												</span>
												<span className="text-xs lg:text-sm">Loading</span>
											</div>
										) : (
											<button
												onClick={handleLike}
												className="inline-flex items-center gap-1 text-sm text-red-600 transition-colors active:text-red-700 lg:text-base">
												{isLiked ? (
													<HeartIconSolid className="h-6 w-6 lg:h-8 lg:w-8" />
												) : (
													<HeartIcon className="h-6 w-6 lg:h-8 lg:w-8" />
												)}{" "}
												<span>{blogLikesNumber}</span>
											</button>
										)}
									</div>
								)}
							</div>
						</div>
						<div
							className={`rounded-lg bg-zinc-300 xl:mx-auto xl:w-4/5 ${
								isCoverLoading && "animate-pulse"
							}`}>
							<Image
								src={`http://localhost:1337${blogData.cover.data.attributes.formats.large.url}`}
								alt={blogData.title}
								width="16"
								height="9"
								layout="responsive"
								objectFit="cover"
								objectPosition="center center"
								className="rounded-lg"
								onLoad={() => setIsCoverLoading(false)}
							/>
						</div>
					</section>
					<section className="prose prose-zinc mx-auto prose-a:font-semibold prose-a:decoration-blue-600 prose-a:underline-offset-4 hover:prose-a:decoration-2 prose-img:rounded-lg lg:prose-lg">
						<Markdown content={blogData.content} />
					</section>
					{blogData.tags.data && (
						<section className="mx-auto max-w-prose border-t border-zinc-200 lg:text-lg">
							<div className="space-y-1 pt-3 lg:space-y-3 lg:pt-5">
								<p className="text-sm font-semibold text-zinc-600 lg:text-base">
									Tags
								</p>
								<div className="space-x-1 lg:space-x-3">
									{blogData.tags.data.map((tag, index) => (
										<span
											key={index}
											className="rounded-lg bg-blue-100 py-1 px-3 font-semibold text-blue-600">
											{tag.attributes.tag}
										</span>
									))}
								</div>
							</div>
						</section>
					)}
				</article>
			</main>
		</>
	);
};

export default Blog;

export const getStaticPaths = async () => {
	const data = await handleFetch(GetAllBlogSlugs);
	const blogs = data.blogs.data;
	const slugs = blogs.map((slug) => ({
		params: {
			slug: slug.attributes.slug,
		},
	}));

	return {
		paths: slugs,
		fallback: true,
	};
};

export const getStaticProps = async (context) => {
	const { slug } = context.params;

	const data = await handleFetch(GetBlog(slug));
	const blog = data.blogs.data[0];

	return {
		props: {
			blog,
		},
	};
};
