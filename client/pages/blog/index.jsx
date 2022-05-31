import Head from "@components/Header";
import Card from "@components/Card";

const Blogs = () => {
	return (
		<>
			<Head title={"Blog"} />
			<main className="container space-y-10">
				<h1>Blogs</h1>
				<div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
					<Card
						id="1"
						title="My Title"
						excerpt="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, consequuntur?"
						image="https://images.unsplash.com/photo-1653856289645-8601ab0e422f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
						date="31st May, 2022"
						type="blog"
						avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
						firstName="John"
						lastName="Doe"
						username="johndoe"
					/>
				</div>
			</main>
		</>
	);
};

export default Blogs;
