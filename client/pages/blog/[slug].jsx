import Head from "@components/Header";
import Image from "next/image";
import Link from "next/link";
import Markdown from "@components/Markdown";
import UserContext from "@lib/userContext";
import Loading from "@components/Loading";
import Input from "@components/Input";
import ChangeImage from "@components/Image";
import { useContext, useEffect, useState } from "react";
import { handleFetch } from "@lib/handleFetch";
import {
	CreateBookmark,
	CreateLike,
	DeleteBlog,
	DeleteBookmark,
	DeleteLike,
	GetAllBlogSlugs,
	GetBlog,
	GetUserDataOfBlog,
	CheckTitle,
	UpdateBlog,
	UpdateBlogCover,
} from "@lib/queries";
import { HeartIcon, BookmarkIcon } from "@heroicons/react/outline";
import {
	HeartIcon as HeartIconSolid,
	BookmarkIcon as BookmarkIconSolid,
	TrashIcon,
	PencilIcon,
	ExclamationCircleIcon,
} from "@heroicons/react/solid";
import { getTokenFromLocalCookie } from "@lib/auth";
import { useRouter } from "next/router";
import { useValidate } from "@lib/useValidate";

const Blog = ({ blog }) => {
	const blogData = blog.attributes;

	const [isCoverLoading, setIsCoverLoading] = useState(true);
	const [isAvatarLoading, setIsAvatarLoading] = useState(true);
	const [blogLikesNumber, setBlogLikesNumber] = useState(blogData.likes.data.length);
	const [isBookmarked, setIsBookmarked] = useState(null);
	const [isBookmarkLoading, setIsBookmarkLoading] = useState(true);
	const [isLiked, setIsLiked] = useState(null);
	const [isLikeLoading, setIsLikeLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [changeCover, setChangeCover] = useState(false);
	const titleDetails = useValidate({ isRequired: true, initialValue: blogData.title });
	const excerptDetails = useValidate({ isRequired: true, initialValue: blogData.excerpt });
	const contentDetails = useValidate({ isRequired: true, initialValue: blogData.content });
	const [file, setFile] = useState(null);
	const [isFileError, setIsFileError] = useState(false);
	const formatedDate = new Date(blogData.createdAt);

	const { user } = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		if (user) {
			const fetchData = async () => {
				const userData = await handleFetch({
					query: GetUserDataOfBlog,
					variables: { slug: blogData.slug, username: user.username },
				});
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
				await handleFetch({
					query: DeleteBookmark,
					options: { Authorization: `Bearer ${jwt}` },
					variables: { bookmarkId: isBookmarked },
				});
				setIsBookmarked(null);
				setToastList((toastList) => [
					...toastList,
					{ type: "success", message: "Bookmark added successfully" },
				]);
			} catch (err) {
				console.log(err);
			} finally {
				setIsBookmarkLoading(false);
			}
		} else {
			try {
				const bookmarkId = await handleFetch({
					query: CreateBookmark,
					options: { Authorization: `Bearer ${jwt}` },
					variables: { blogId: +blog.id, userId: +user.id },
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
				await handleFetch({
					query: DeleteLike,
					options: { Authorization: `Bearer ${jwt}` },
					variables: { likeId: isLiked },
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
				const likeId = await handleFetch({
					query: CreateLike,
					options: { Authorization: `Bearer ${jwt}` },
					variables: { blogId: +blog.id, userId: +user.id },
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

	const handleDelete = async () => {
		setIsDeleting(true);
		await handleFetch({ query: DeleteBlog, variables: { id: blog.id } });
		setIsDeleting(false);
		router.push("/");
	};

	const handleSave = async () => {
		const sendData = async () => {
			const data = await handleFetch({
				query: UpdateBlog,
				variables: {
					id: blog.id,
					title: titleDetails.value,
					excerpt: excerptDetails.value,
					content: contentDetails.value,
				},
			});
			return data;
		};

		if (isEditing && (titleDetails.value.trim() === "" || titleDetails.errorMessage)) {
			if (!titleDetails.errorMessage.length > 0)
				titleDetails.setErrorMessage("This field is required");
			return;
		}
		if (isEditing && (excerptDetails.value.trim() === "" || excerptDetails.errorMessage)) {
			if (!excerptDetails.errorMessage.length > 0)
				excerptDetails.setErrorMessage("This field is required");
			return;
		}
		if (isEditing && (contentDetails.value.trim() === "" || contentDetails.errorMessage)) {
			if (!contentDetails.errorMessage.length > 0)
				contentDetails.setErrorMessage("This field is required");
			return;
		}

		setIsSaving(true);
		await sendData();
		setIsSaving(false);
		router.reload();
	};

	const handleTitle = async () => {
		if (titleDetails.value.trim() === "")
			return titleDetails.setErrorMessage("This field is required");
		const titleData = await handleFetch({
			query: CheckTitle,
			variables: { title: titleDetails.value },
		});
		if (titleData.blogs.data.length === 1)
			return titleDetails.setErrorMessage("Title already exists");
		return titleDetails.setErrorMessage("");
	};

	const handleCoverChange = async () => {
		const uploadImage = async () => {
			const data = new FormData();
			data.append(
				"operations",
				JSON.stringify({
					query: "mutation($file:Upload!){upload(file:$file){data{id}}}",
					variables: { file: null },
				})
			);
			data.append("map", '{ "0": ["variables.file"] }');
			data.append("0", file);
			const imageData = await handleFetch({ formData: data });
			return imageData.upload.data.id;
		};
		if (changeCover && (file === null || isFileError)) {
			setIsFileError(true);
			return;
		}
		const imageId = await uploadImage();
		await handleFetch({
			query: UpdateBlogCover,
			variables: { id: blog.id, coverId: imageId },
		});
		setChangeCover(false);
		router.reload();
	};

	return (
		<>
			<Head title={blogData.title} description={blogData.excerpt} />
			<main>
				<article className="container space-y-8 pb-96 pt-24 lg:space-y-16 lg:pb-64 lg:pt-32">
					{user && user.username === blogData.user.data.attributes.username && (
						<div className="space-x-3 text-right lg:space-x-5">
							{!isEditing ? (
								<>
									<button
										onClick={() => setIsEditing(true)}
										className="inline-flex items-center gap-1 rounded-lg border-2 border-blue-600 px-2 py-1 text-sm font-semibold text-blue-600 transition-colors active:bg-blue-600 active:text-white lg:text-base">
										<span>
											<PencilIcon className="h-5 w-5" />
										</span>
										<span>Edit Blog</span>
									</button>
									<button
										disabled={isDeleting}
										onClick={handleDelete}
										className="inline-flex items-center gap-1 rounded-lg border-2 border-red-600 px-2 py-1 text-sm font-semibold text-red-600 transition-colors active:bg-red-600 active:text-white lg:text-base">
										<span>
											{isDeleting ? (
												<Loading className="h-5 w-5 text-white" />
											) : (
												<TrashIcon className="h-5 w-5" />
											)}
										</span>
										<span>{isDeleting ? "Deleting..." : "Delete Blog"}</span>
									</button>
								</>
							) : (
								<>
									{!isSaving && (
										<button
											onClick={() => setIsEditing(false)}
											className="rounded-lg bg-zinc-200 px-2 py-1 text-sm font-semibold text-zinc-900 transition-colors active:bg-zinc-300 lg:text-base">
											Cancel Changes
										</button>
									)}
									<button
										disabled={isSaving}
										onClick={handleSave}
										className={`rounded-lg bg-blue-600 px-2 py-1 text-sm font-semibold text-white transition-colors active:bg-blue-700 lg:text-base ${
											isSaving ? "inline-flex items-center gap-1" : null
										}`}>
										{isSaving && (
											<span>
												<Loading className="h-5 w-5 text-white" />
											</span>
										)}
										<span>{isSaving ? "Saving..." : "Save Changes"}</span>
									</button>
								</>
							)}
						</div>
					)}
					<section className="space-y-8 lg:space-y-16">
						{!isEditing ? (
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
									<Link
										href={`/profile/${blogData.user.data.attributes.username}`}>
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
													<span className="text-xs lg:text-sm">
														Loading
													</span>
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
													<span className="text-xs lg:text-sm">
														Loading
													</span>
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
						) : (
							<div className="mx-auto space-y-3 lg:w-[35rem] lg:space-y-5 xl:w-[50rem]">
								<Input
									input={titleDetails}
									handleTitle={handleTitle}
									isRequired={true}
									type="text"
									name="title"
									placeholder="Title"
								/>
								<Input
									input={excerptDetails}
									isRequired={true}
									type="text"
									name="excerpt"
									placeholder="Excerpt"
								/>
							</div>
						)}
						{!changeCover ? (
							<div
								className={`rounded-lg bg-zinc-300 xl:mx-auto xl:w-4/5 ${
									isCoverLoading && "animate-pulse"
								}`}>
								<Image
									src={`http://localhost:1337${blogData.cover.data.attributes.url}`}
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
						) : (
							<div className="mx-auto lg:w-[35rem] xl:w-[50rem]">
								<ChangeImage
									file={file}
									setFile={setFile}
									setIsFileError={setIsFileError}
								/>
								{isFileError && (
									<p className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 lg:text-sm">
										<ExclamationCircleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
										This field is required
									</p>
								)}
							</div>
						)}
						<div className="space-x-3 text-center lg:space-x-5">
							{user &&
								user.username === blogData.user.data.attributes.username &&
								(!changeCover ? (
									<button
										onClick={() => setChangeCover(true)}
										className="rounded-lg bg-blue-600 px-2 py-1 font-semibold text-white transition-colors active:bg-blue-700">
										Change Cover
									</button>
								) : (
									<>
										<button
											onClick={() => setChangeCover(false)}
											className="rounded-lg bg-zinc-200 px-2 py-1 text-zinc-600 transition-colors focus:outline-none active:bg-zinc-300">
											<span className="font-semibold">
												Cancel Cover Changes
											</span>
										</button>
										<button
											onClick={handleCoverChange}
											className="rounded-lg bg-blue-600 px-2 py-1 text-white transition-colors focus:outline-none active:bg-blue-700">
											<span className="font-semibold">
												Save Cover Changes
											</span>
										</button>
									</>
								))}
						</div>
					</section>
					{!isEditing ? (
						<section className="prose prose-zinc mx-auto prose-a:font-semibold prose-a:decoration-blue-600 prose-a:underline-offset-4 hover:prose-a:decoration-2 prose-img:rounded-lg lg:prose-lg">
							<Markdown content={blogData.content} />
						</section>
					) : (
						<div className="mx-auto lg:w-[35rem] xl:w-[50rem]">
							<label
								htmlFor="content"
								className="w-full text-xs font-semibold text-zinc-600 lg:text-sm">
								Content
							</label>
							<textarea
								name="bio"
								rows="15"
								onChange={(e) => contentDetails.setValue(e.target.value)}
								value={contentDetails.value}
								className="focus:ring-3 w-full resize-none rounded-lg border-zinc-300 p-3 text-sm placeholder-zinc-400 ring-blue-600 transition-all focus:outline-none lg:text-base"></textarea>
							{contentDetails.errorMessage && (
								<p className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 lg:text-sm">
									<ExclamationCircleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
									{contentDetails.errorMessage}
								</p>
							)}
						</div>
					)}
					{blogData.tags.data.length > 0 && (
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
	const data = await handleFetch({ query: GetAllBlogSlugs });
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

	const data = await handleFetch({ query: GetBlog, variables: { slug } });
	const blog = data.blogs.data[0];

	return {
		props: {
			blog,
		},
	};
};
