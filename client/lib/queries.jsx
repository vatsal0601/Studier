export const GetAllBlogs = /* GraphQL */ `
	query {
		blogs(sort: "createdAt:desc") {
			data {
				attributes {
					title
					excerpt
					slug
					cover {
						data {
							attributes {
								name
								formats
							}
						}
					}
					createdAt
					user {
						data {
							attributes {
								firstName
								lastName
								username
								avatar {
									data {
										attributes {
											name
											formats
										}
									}
								}
							}
						}
					}
					tags {
						data {
							attributes {
								tag
							}
						}
					}
				}
			}
		}
	}
`;

export const GetAllBlogSlugs = /* GraphQL */ `
	query {
		blogs {
			data {
				attributes {
					slug
				}
			}
		}
	}
`;

export const GetBlog = (slug) => {
	return /* GraphQL */ `
		query {
			blogs(filters: { slug: { eq: "${slug}" } }) {
				data {
					attributes {
						title
						excerpt
						slug
						content
						cover {
							data {
								attributes {
									name
									formats
								}
							}
						}
						createdAt
						user {
							data {
								attributes {
									firstName
									lastName
									username
									avatar {
										data {
											attributes {
												name
												formats
											}
										}
									}
								}
							}
						}
						tags {
							data {
								attributes {
									tag
								}
							}
						}
					}
				}
			}
		}
	`;
};
