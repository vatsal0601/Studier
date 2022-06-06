import Head from "@components/Header";
import Card from "@components/BlogCard";
import { useEffect, useState } from "react";
import { handleFetch } from "@lib/handleFetch";
import { GetAllBlogs } from "@lib/queries";

const Blogs = ({ data }) => {
	const [windowWidth, setWindowWidth] = useState(0);
	const blogs = data.blogs.data;

	useEffect(() => {
		setWindowWidth(window.innerWidth);
	}, []);

	useEffect(() => {
		window.addEventListener("resize", () => {
			setWindowWidth(window.innerWidth);
		});
		return () =>
			window.removeEventListener("resize", () => {
				setWindowWidth(window.innerWidth);
			});
	});

	return (
		<>
			<Head title="Blog" />
			<main className="container space-y-5 pb-96 pt-24 lg:space-y-10 lg:pb-64 lg:pt-32">
				<h1 className="text-4xl font-bold tracking-tighter text-zinc-900 lg:text-5xl">
					Recent Blogs
				</h1>
				<div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-10">
					{blogs.map((blog, index) => {
						return (
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
								avatar={`http://localhost:1337${blog.attributes.user.data.attributes.avatar.data.attributes.formats.thumbnail.url}`}
								firstName={blog.attributes.user.data.attributes.firstName}
								lastName={blog.attributes.user.data.attributes.lastName}
								username={blog.attributes.user.data.attributes.username}
								windowWidth={windowWidth}
							/>
						);
					})}
				</div>
			</main>
		</>
	);
};

export default Blogs;

export const getStaticProps = async () => {
	const data = await handleFetch(GetAllBlogs);
	return {
		props: {
			data,
		},
		revalidate: 60,
	};
};
