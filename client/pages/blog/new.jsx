import Input from "@components/Input";
import Image from "@components/Image";
import UserContext from "@lib/userContext";
import Head from "@components/Header";
import Loading from "@components/Loading";
import { useValidate } from "@lib/useValidate";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { handleFetch } from "@lib/handleFetch";
import { CheckTitle, CreateBlog } from "@lib/queries";

const NewBlog = () => {
	const titleDetails = useValidate({ isRequired: true });
	const excerptDetails = useValidate({ isRequired: true });
	const contentDetails = useValidate({ isRequired: true });
	const [file, setFile] = useState(null);
	const [isFileError, setIsFileError] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const router = useRouter();

	const { user } = useContext(UserContext);

	useEffect(() => {
		if (!user) router.push("/login");
	}, []);

	const handleSubmit = async () => {
		const sendData = async (imageId) => {
			const data = await handleFetch({
				query: CreateBlog,
				variables: {
					title: titleDetails.value,
					excerpt: excerptDetails.value,
					content: contentDetails.value,
					userId: user.id,
					coverId: imageId,
				},
			});
			return data.createBlog.data.attributes.slug;
		};

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

		if (titleDetails.value.trim() === "" || titleDetails.errorMessage) {
			if (!titleDetails.errorMessage.length > 0)
				titleDetails.setErrorMessage("This field is required");
			return;
		}
		if (excerptDetails.value.trim() === "" || excerptDetails.errorMessage) {
			if (!excerptDetails.errorMessage.length > 0)
				excerptDetails.setErrorMessage("This field is required");
			return;
		}
		if (file === null || isFileError) {
			setIsFileError(true);
			return;
		}
		if (contentDetails.value.trim() === "" || contentDetails.errorMessage) {
			if (!contentDetails.errorMessage.length > 0)
				contentDetails.setErrorMessage("This field is required");
			return;
		}

		setIsSubmitting(true);
		const imageId = await uploadImage();
		const slug = await sendData(imageId);
		setIsSubmitting(false);
		router.push(`/blog/${slug}`);
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

	return (
		<>
			<Head title="New Blog" />
			<main className="container space-y-5 pb-96 pt-24 lg:space-y-10 lg:pb-64 lg:pt-32">
				<h1 className="text-center text-4xl font-bold tracking-tighter text-zinc-900 lg:text-5xl">
					Create New Post
				</h1>
				<form
					onSubmit={(e) => e.preventDefault()}
					className="mx-auto space-y-3 lg:w-[35rem] lg:space-y-5 xl:w-[50rem]">
					<Input
						input={titleDetails}
						isRequired={true}
						handleTitle={handleTitle}
						name="title"
						placeholder="Title"
						type="text"
					/>
					<Input
						input={excerptDetails}
						isRequired={true}
						name="excerpt"
						placeholder="Excerpt"
						type="text"
					/>
					<div>
						<p className="w-full text-xs font-semibold text-zinc-600 lg:text-sm">
							Cover Image <span className="text-red-600">*</span>
						</p>
						<Image
							file={file}
							setFile={setFile}
							fileError={isFileError}
							setIsFileError={setIsFileError}
						/>
						{isFileError && (
							<p className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 lg:text-sm">
								<ExclamationCircleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
								This field is required
							</p>
						)}
					</div>
					<div>
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
						<p className="text-xs font-light italic text-zinc-600 lg:text-sm">
							Tip: You can write your content in markdown.
						</p>
					</div>
					<div className="space-x-3 lg:space-x-5">
						{!isSubmitting && (
							<button
								onClick={() => router.back()}
								className="rounded-lg bg-zinc-200 px-2 py-1 text-sm font-semibold text-zinc-900 transition-colors active:bg-zinc-300 lg:text-base">
								Cancel
							</button>
						)}
						<button
							onClick={handleSubmit}
							disabled={isSubmitting}
							className={`rounded-lg bg-blue-600 px-2 py-1 text-sm font-semibold text-white transition-colors active:bg-blue-700 lg:text-base ${
								isSubmitting
									? "inline-flex items-center justify-center gap-1"
									: null
							}`}>
							{isSubmitting && (
								<span>
									<Loading className="h-5 w-5 text-white" />
								</span>
							)}
							<span>{isSubmitting ? "Submitting..." : "Submit"}</span>
						</button>
					</div>
				</form>
			</main>
		</>
	);
};

export default NewBlog;
