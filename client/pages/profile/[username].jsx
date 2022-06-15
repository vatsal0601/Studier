import Image from "next/image";
import Link from "next/link";
import Head from "@components/Header";
import Card from "@components/BlogCard";
import Loading from "@components/Loading";
import UserContext from "@lib/userContext";
import Input from "@components/Input";
import ChangeImage from "@components/Image";
import Dropdown from "@components/Dropdown";
import { ExclamationCircleIcon, PencilAltIcon } from "@heroicons/react/solid";
import { Tab, Dialog, Transition } from "@headlessui/react";
import {
	AtSymbolIcon,
	HashtagIcon,
	InboxIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/solid";
import { Fragment, useContext, useEffect, useState } from "react";
import { handleFetch } from "@lib/handleFetch";
import {
	DeleteBlog,
	DeleteUser,
	GetAllUsernames,
	GetBlogsIdsOfUser,
	GetBlogsOfUser,
	GetUser,
	CheckUsername,
	UpdateUserAvatar,
	UpdateUserProfile,
} from "@lib/queries";
import { useRouter } from "next/router";
import { removeToken } from "@lib/auth";
import { useValidate } from "@lib/useValidate";

const Profile = ({ user }) => {
	const availableTypes = ["Student", "Professor"];
	const [isAvatarLoading, setIsAvatarLoading] = useState(true);
	const [changeAvatar, setChangeAvatar] = useState(false);
	const [file, setFile] = useState(null);
	const [isFileError, setIsFileError] = useState(false);
	const [isTabContentLoading, setIsTabContentLoading] = useState(true);
	const [tabData, setTabData] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [username, setUsername] = useState(user.username);
	const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
	const [type, setType] = useState(availableTypes[availableTypes.indexOf(user.type)]);
	const firstNameDetails = useValidate({
		regex: /^[a-zA-z]+$/,
		isRequired: true,
		initialValue: user.firstName,
	});
	const lastNameDetails = useValidate({
		regex: /^[a-zA-z]+$/,
		isRequired: true,
		initialValue: user.lastName,
	});
	const branchDetails = useValidate({
		regex: /^[a-zA-z ]+$/,
		isRequired: true,
		initialValue: user.branch,
	});
	const bioDetails = useValidate({ initialValue: user.bio });
	const startYearDetails = useValidate({
		isRequired: true,
		startYear: 1900,
		endYear: 2999,
		initialValue: user.startYear,
	});
	const graduationYearDetails = useValidate({
		isRequired: true,
		startYear: 1900,
		endYear: 2999,
		initialValue: user.graduationYear,
	});
	const router = useRouter();

	const { username: queryUsername } = router.query;

	const tabs = ["Blogs", "Projects", "Events"];

	const { user: userContext, setUser } = useContext(UserContext);

	useEffect(() => {
		const fetchData = async () => {
			const data = await handleFetch({
				query: GetBlogsOfUser,
				variables: { username: queryUsername },
			});
			setTabData(data.blogs.data);
			setIsTabContentLoading(false);
		};
		fetchData();
	}, []);

	const handleEdit = async () => {
		const sendData = async () => {
			const data = await handleFetch({
				query: UpdateUserProfile,
				variables: {
					id: userContext.id,
					firstName: firstNameDetails.value,
					lastName: lastNameDetails.value,
					username: username,
					branch: branchDetails.value,
					bio: bioDetails.value,
					startYear: startYearDetails.value,
					graduationYear: graduationYearDetails.value,
					type: type,
				},
			});
			return data.updateUsersPermissionsUser.data.attributes.username;
		};

		if (isEditing) {
			if (username.trim() === "" || usernameErrorMessage) {
				if (!usernameErrorMessage.length > 0)
					setUsernameErrorMessage("This field is required");
				return;
			}
			if (firstNameDetails.value.trim() === "" || firstNameDetails.errorMessage) {
				if (!firstNameDetails.errorMessage.length > 0)
					firstNameDetails.setErrorMessage("This field is required");
				return;
			}
			if (lastNameDetails.value.trim() === "" || lastNameDetails.errorMessage) {
				if (!lastNameDetails.errorMessage.length > 0)
					lastNameDetails.setErrorMessage("This field is required");
				return;
			}
			if (branchDetails.value.trim() === "" || branchDetails.errorMessage) {
				if (!branchDetails.errorMessage.length > 0)
					branchDetails.setErrorMessage("This field is required");
				return;
			}
			if (startYearDetails.value.trim() === "" || startYearDetails.errorMessage) {
				if (!startYearDetails.errorMessage.length > 0)
					startYearDetails.setErrorMessage("This field is required");
				return;
			}
			if (graduationYearDetails.value.trim() === "" || graduationYearDetails.errorMessage) {
				if (!graduationYearDetails.errorMessage.length > 0)
					graduationYearDetails.setErrorMessage("This field is required");
				return;
			}
		}

		const newUsername = await sendData();
		setIsEditing(false);
		router.push(`/profile/${newUsername}`);
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		const blogsIds = await handleFetch({
			query: GetBlogsIdsOfUser,
			variables: { username: queryUsername },
		});
		blogsIds.blogs.data.forEach(async (blog) => {
			await handleFetch({ query: DeleteBlog, variables: { id: blog.id } });
		});
		await handleFetch({ query: DeleteUser, variables: { id: userContext.id } });
		setUser(null);
		removeToken();
		router.push("/");
		setIsDialogOpen(false);
		setIsDeleting(false);
	};

	const handleTabs = (index) => {
		console.log("Changed selected tab to:", index);
	};

	const handleUsername = async () => {
		if (username.trim() === "") return setUsernameErrorMessage("This field is required");
		const usernameData = await handleFetch({
			query: CheckUsername,
			variables: { username },
		});
		if (usernameData.usersPermissionsUsers.data.length === 1)
			return setUsernameErrorMessage("Username not available");
		return setUsernameErrorMessage("");
	};

	const handleAvatarChange = async () => {
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
		if (changeAvatar && (file === null || isFileError)) {
			setIsFileError(true);
			return;
		}
		const imageId = await uploadImage();
		await handleFetch({
			query: UpdateUserAvatar,
			variables: { userId: userContext.id, avatarId: imageId },
		});
	};

	return (
		<>
			<Head title={`${user.firstName} ${user.lastName} - ${user.username}`} />
			<main className="container space-y-10 pb-96 pt-24 lg:space-y-20 lg:pb-64 lg:pt-32">
				<section className="space-y-3 lg:space-y-5">
					<div
						className={`space-y-10 ${
							isEditing
								? "mx-auto max-w-md"
								: "lg:flex lg:items-center lg:justify-center lg:gap-10 lg:space-y-0"
						}`}>
						<div className="space-y-3 lg:space-y-5">
							{!changeAvatar ? (
								<div
									className={`mx-auto w-max rounded-full border-2 border-blue-600 p-2 ${
										isEditing ? null : "lg:mx-0"
									}`}>
									<div
										className={`h-36 w-36 rounded-full bg-zinc-300 lg:h-48 lg:w-48 ${
											isAvatarLoading && "animate-pulse"
										}`}>
										<Image
											src={`http://localhost:1337${user.avatar.data.attributes.url}`}
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
							) : (
								<div className="mx-auto max-w-sm">
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
							<div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:gap-5">
								{userContext &&
									userContext.username === queryUsername &&
									(!changeAvatar ? (
										<button
											onClick={() => setChangeAvatar(true)}
											className="rounded-lg bg-blue-600 px-2 py-1 font-semibold text-white transition-colors active:bg-blue-700">
											Change Avatar
										</button>
									) : (
										<>
											<button
												onClick={() => setChangeAvatar(false)}
												className="rounded-lg bg-zinc-200 px-2 py-1 text-zinc-600 transition-colors focus:outline-none active:bg-zinc-300">
												<span className="font-semibold">
													Cancel Avatar Changes
												</span>
											</button>
											<button
												onClick={handleAvatarChange}
												className="rounded-lg bg-blue-600 px-2 py-1 text-white transition-colors focus:outline-none active:bg-blue-700">
												<span className="font-semibold">
													Save Avatar Changes
												</span>
											</button>
										</>
									))}
							</div>
						</div>
						<div className="space-y-1">
							{!isEditing ? (
								<div className="flex items-center justify-center gap-3 lg:justify-start lg:gap-5">
									<h1 className="text-4xl font-bold tracking-tighter text-blue-600 lg:text-5xl">
										{user.firstName} {user.lastName}
									</h1>
									<p className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 lg:text-sm">
										{user.type}
									</p>
								</div>
							) : (
								<div className="space-y-3 lg:space-y-5">
									<Input
										input={firstNameDetails}
										isRequired={true}
										name="first-name"
										placeholder="First Name"
										type="text"
									/>
									<Input
										input={lastNameDetails}
										isRequired={true}
										name="last-name"
										placeholder="Last Name"
										type="text"
									/>
									<div>
										<label
											htmlFor="username"
											className="w-full text-xs font-semibold text-zinc-600 lg:text-sm">
											<span>
												Username <span className="text-red-600">*</span>
											</span>
										</label>
										<input
											type="text"
											name="username"
											placeholder="Username"
											onChange={(e) => setUsername(e.target.value)}
											onBlur={handleUsername}
											value={username}
											className="focus:ring-3 w-full truncate rounded-lg border-zinc-300 p-3 text-sm placeholder-zinc-400 ring-blue-600 transition-all focus:outline-none lg:text-base"
										/>
										{usernameErrorMessage && (
											<p className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 lg:text-sm">
												<ExclamationCircleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
												{usernameErrorMessage}
											</p>
										)}
									</div>
									<Input
										input={branchDetails}
										name="branch"
										placeholder="Branch"
										type="text"
									/>
									<div>
										<p className="w-full text-xs font-semibold text-zinc-600 lg:text-sm">
											Type <span className="text-red-600">*</span>
										</p>
										<Dropdown
											list={availableTypes}
											selected={type}
											setSelected={setType}
										/>
									</div>
									<Input
										input={startYearDetails}
										isRequired={true}
										name="start-year"
										placeholder="Start Year"
										type="text"
									/>
									<Input
										input={graduationYearDetails}
										isRequired={true}
										name="graduation-year"
										placeholder="Graduation Year"
										type="text"
									/>
									<div>
										<label
											htmlFor="bio"
											className="w-full text-xs font-semibold text-zinc-600 lg:text-sm">
											Bio
										</label>
										<textarea
											name="bio"
											rows="5"
											onChange={(e) => bioDetails.setValue(e.target.value)}
											value={bioDetails.value}
											className="focus:ring-3 w-full resize-none rounded-lg border-zinc-300 p-3 text-sm placeholder-zinc-400 ring-blue-600 transition-all focus:outline-none lg:text-base"></textarea>
									</div>
								</div>
							)}
							{!isEditing && (
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
							)}
							{!isEditing && (
								<p className="text-center text-zinc-600 lg:text-left lg:text-lg">
									{user.branch}
								</p>
							)}
							{!isEditing && (
								<div className="space-x-1 text-center text-zinc-600 lg:text-left lg:text-lg">
									<span>{user.university.data.attributes.name}</span>
									<span>
										[{user.startYear} &#8212; {user.graduationYear}]
									</span>
								</div>
							)}
							{!isEditing && (
								<div className="space-x-3 text-center text-blue-600 lg:space-x-5 lg:text-left lg:text-lg">
									{user.socialLinks.data.length > 0 &&
										user.socialLinks.data.map((socialLink, index) => (
											<a
												target="_blank"
												rel="noopener noreferrer"
												href={socialLink.attributes.url}
												key={index}>
												{socialLink.attributes.appName}
											</a>
										))}
								</div>
							)}
							{!isEditing && (
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
							)}
							{userContext && userContext.username === queryUsername && (
								<div
									className={`space-x-3 text-center text-xs lg:space-x-5 ${
										isEditing ? null : "lg:text-left"
									} lg:text-sm`}>
									{!isEditing ? (
										<button
											onClick={() => setIsEditing(true)}
											className="inline-flex items-center justify-center gap-1 rounded-lg border-2 border-blue-600 px-2 py-1 text-blue-600 transition-colors focus:outline-none active:bg-blue-600 active:text-white">
											<PencilIcon className="h-4 w-4 lg:h-5 lg:w-5" />
											<span className="font-semibold">Edit Profile</span>
										</button>
									) : (
										<>
											<button
												onClick={() => setIsEditing(false)}
												className="rounded-lg bg-zinc-200 px-2 py-1 text-zinc-600 transition-colors focus:outline-none active:bg-zinc-300">
												<span className="font-semibold">
													Cancel Changes
												</span>
											</button>
											<button
												onClick={handleEdit}
												className="rounded-lg bg-blue-600 px-2 py-1 text-white transition-colors focus:outline-none active:bg-blue-700">
												<span className="font-semibold">Save Changes</span>
											</button>
										</>
									)}
									{!isEditing && (
										<button
											onClick={() => setIsDialogOpen(true)}
											className="inline-flex items-center justify-center gap-1 rounded-lg border-2 border-red-600 px-2 py-1 text-red-600 transition-colors focus:outline-none active:bg-red-600 active:text-white">
											<TrashIcon className="h-4 w-4 lg:h-5 lg:w-5" />
											<span className="font-semibold">Delete Account</span>
										</button>
									)}
								</div>
							)}
						</div>
					</div>
					{!isEditing && user.bio.length > 0 && (
						<p className="prose prose-zinc mx-auto lg:prose-lg">{user.bio}</p>
					)}
					<Transition appear show={isDialogOpen} as={Fragment}>
						<Dialog
							open={isDialogOpen}
							onClose={() => {
								if (!isEditing) setIsDialogOpen(false);
							}}
							className="relative z-40">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="ease-in"
								leaveFrom="opacity-100"
								leaveTo="opacity-0">
								<div className="fixed inset-0 bg-black/50" aria-hidden="true" />
							</Transition.Child>
							<div className="fixed inset-0 flex items-center justify-center p-5">
								<Transition.Child
									as={Fragment}
									enter="ease-out duration-300"
									enterFrom="opacity-0 scale-95"
									enterTo="opacity-100 scale-100"
									leave="ease-in"
									leaveFrom="opacity-100 scale-100"
									leaveTo="opacity-0 scale-95">
									<Dialog.Panel className="w-full max-w-prose space-y-3 rounded-lg bg-white p-3 lg:p-5">
										<Dialog.Title className="text-3xl font-bold tracking-tighter text-red-600 lg:text-4xl">
											Delete Account
										</Dialog.Title>
										<Dialog.Description className="text-zinc-600 lg:text-lg">
											This will permanently delete your account. Are you sure
											you want to deactivate your account? All of your data
											will be permanently removed. This action cannot be
											undone.
										</Dialog.Description>
										<div className="space-x-3 text-sm font-semibold lg:space-x-5 lg:text-base">
											{!isDeleting && (
												<button
													onClick={() => setIsDialogOpen(false)}
													className="rounded-lg bg-zinc-100 px-2 py-1 text-zinc-600 transition-colors active:bg-zinc-200">
													Cancel
												</button>
											)}
											<button
												disabled={isDeleting}
												onClick={handleDelete}
												className={`rounded-lg bg-red-600 px-2 py-1 text-white transition-colors ${
													isDeleting
														? "inline-flex items-center gap-2"
														: "active:bg-red-700"
												}`}>
												{isDeleting && (
													<span>
														<Loading className="h-4 w-4 text-white" />
													</span>
												)}
												<span>{isDeleting ? "Deleting..." : "Delete"}</span>
											</button>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</Dialog>
					</Transition>
				</section>
				{!isEditing && (
					<Tab.Group
						onChange={handleTabs}
						as="section"
						className="space-y-3 lg:space-y-5"
						manual
						defaultIndex={0}>
						<Tab.List className="flex w-full items-center justify-between gap-3 lg:gap-5">
							{tabs.map((tab, index) => (
								<Tab
									key={index}
									className={({ selected }) =>
										`block flex-grow border-b-2 p-3 font-semibold transition focus:outline-none lg:text-lg ${
											selected
												? "border-blue-600 text-blue-600"
												: "border-white text-zinc-600 hover:border-blue-300 focus:border-blue-300"
										}`
									}>
									{tab}
								</Tab>
							))}
						</Tab.List>
						<Tab.Panels as={Fragment}>
							<Tab.Panel className="focus:outline-none">
								{isTabContentLoading ? (
									<div className="mt-10 flex items-center justify-center gap-1 text-lg font-semibold text-zinc-600 lg:text-xl">
										<Loading className="h-5 w-5 text-blue-600 lg:h-7 lg:w-7" />{" "}
										Loading
									</div>
								) : (
									<div className="space-y-3 lg:space-y-5">
										<div className="flex items-center justify-between gap-3">
											<h1 className="text-3xl font-bold tracking-tighter text-zinc-900 lg:text-4xl">
												Blogs
											</h1>
											{userContext && userContext.username === queryUsername && (
												<Link href="/blog/new">
													<a className="inline-flex items-center justify-center gap-1 rounded-lg border-2 border-blue-600 px-2 py-1 text-sm text-blue-600 transition-colors active:bg-blue-600 active:text-white lg:text-base">
														<span>
															<PencilAltIcon className="h-5 w-5" />
														</span>
														<span className="font-semibold">
															Create New Blog
														</span>
													</a>
												</Link>
											)}
										</div>
										<div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-10">
											{tabData.map((blog, index) => (
												<Card
													key={index}
													index={index}
													title={blog.attributes.title}
													slug={blog.attributes.slug}
													excerpt={blog.attributes.excerpt}
													image={`http://localhost:1337${
														index === 0
															? blog.attributes.cover.data.attributes
																	.formats.large.url
															: blog.attributes.cover.data.attributes
																	.formats.small.url
													}`}
													date={blog.attributes.createdAt}
													tags={blog.attributes.tags.data}
												/>
											))}
										</div>
									</div>
								)}
							</Tab.Panel>
							<Tab.Panel className="focus:outline-none">
								<div className="space-y-3 lg:space-y-5">
									<h1 className="text-3xl font-bold tracking-tighter text-zinc-900 lg:text-4xl">
										Projects
									</h1>
								</div>
							</Tab.Panel>
							<Tab.Panel className="focus:outline-none">
								<div className="space-y-3 lg:space-y-5">
									<h1 className="text-3xl font-bold tracking-tighter text-zinc-900 lg:text-4xl">
										Events
									</h1>
								</div>
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				)}
			</main>
		</>
	);
};

export default Profile;

export const getStaticPaths = async () => {
	const data = await handleFetch({ query: GetAllUsernames });
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

	const data = await handleFetch({ query: GetUser, variables: { username } });
	const user = data.usersPermissionsUsers.data[0].attributes;

	return {
		props: {
			user,
		},
	};
};
