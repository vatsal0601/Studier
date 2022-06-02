import Head from "@components/Header";
import Image from "next/image";
import Link from "next/link";
import Markdown from "@components/Markdown";
import { useState } from "react";
import { handleFetch } from "@lib/handleFetch";
import { GetAllBlogSlugs, GetBlog } from "@lib/queries";
import { HeartIcon, BookmarkIcon } from "@heroicons/react/outline";

const Blog = ({ blog }) => {
	const [isCoverLoading, setIsCoverLoading] = useState(true);
	const [isAvatarLoading, setIsAvatarLoading] = useState(true);
	const formatedDate = new Date(blog.createdAt);

	return (
		<>
			<Head title={blog.title} description={blog.excerpt} />
			<main>
				<article className="container space-y-10 lg:space-y-16">
					<section className="space-y-8 lg:space-y-16">
						<div className="space-y-3 self-center lg:space-y-5">
							<h1 className="text-center text-4xl font-bold tracking-tighter text-blue-600 lg:text-5xl">
								{blog.title}
							</h1>
							<p className="prose prose-zinc mx-auto text-center lg:prose-lg">
								{blog.excerpt}
							</p>
							<div className="mx-auto flex max-w-prose items-center justify-between gap-3 pt-1 lg:pt-3 lg:text-lg">
								<Link href={`/profile/${blog.user.data.attributes.username}`}>
									<a className="mt-3 flex items-center gap-3">
										<div
											className={`h-14 w-14 rounded-full bg-zinc-300 lg:h-16 lg:w-16 ${
												isAvatarLoading && "animate-pulse"
											}`}>
											<Image
												src={`http://localhost:1337${blog.user.data.attributes.avatar.data.attributes.formats.thumbnail.url}`}
												alt={blog.user.data.attributes.username}
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
												{blog.user.data.attributes.firstName}{" "}
												{blog.user.data.attributes.lastName}
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
								<div className="space-x-3 lg:space-x-5">
									<button className="text-blue-600 active:text-red-700">
										<BookmarkIcon className="h-8 w-8" />
									</button>
									<button className="inline-flex items-center gap-1 text-sm text-red-600 active:text-red-700 lg:text-base">
										<HeartIcon className="h-8 w-8" /> <span>200</span>
									</button>
								</div>
							</div>
						</div>
						<div
							className={`rounded-lg bg-zinc-300 xl:mx-auto xl:w-4/5 ${
								isCoverLoading && "animate-pulse"
							}`}>
							<Image
								src={`http://localhost:1337${blog.cover.data.attributes.formats.large.url}`}
								alt={blog.title}
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
					<section className="prose prose-zinc mx-auto prose-headings:scroll-m-20 prose-a:font-semibold prose-a:decoration-blue-600 prose-a:underline-offset-4 hover:prose-a:decoration-2 prose-img:rounded-lg lg:prose-lg lg:prose-headings:scroll-m-24">
						<Markdown content={blog.content} />
					</section>
					{blog.tags.data && (
						<section className="mx-auto max-w-prose border-t border-zinc-200 lg:text-lg">
							<div className="space-y-1 pt-3 lg:space-y-3 lg:pt-5">
								<p className="text-sm font-semibold text-zinc-600 lg:text-base">
									Tags
								</p>
								<div className="space-x-1 lg:space-x-3">
									{blog.tags.data.map((tag, index) => (
										<span
											key={index}
											className="rounded-lg border border-blue-600 bg-blue-100 py-1 px-3 font-semibold text-blue-600">
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
	const blog = data.blogs.data[0].attributes;

	return {
		props: {
			blog,
		},
	};
};
