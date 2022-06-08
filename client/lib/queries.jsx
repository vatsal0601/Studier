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

export const GetBlog = (slug) => /* GraphQL */ `
		query {
			blogs(filters: { slug: { eq: "${slug}" } }) {
				data {
					id
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
						likes {
							data {
								id
							}
						}
					}
				}
			}
		}
	`;

export const GetLoggedInUserUsername = /* GraphQL */ `
	query {
		me {
			username
		}
	}
`;

export const GetLoggedInUserData = (username) => /* GraphQL */ `
	query {
		usersPermissionsUsers(filters: { username: { eq: "${username}" } }) {
			data {
				id
				attributes {
					firstName
					lastName
					username
					email
					type
					avatar {
						data {
							attributes {
								formats
							}
						}
					}
				}
			}
		}
	}
`;

export const LoginUser = (identifier, password) => /* GraphQL */ `
	mutation {
		login(input: { identifier: "${identifier}", password: "${password}" }) {
			jwt
		}
	}
`;

export const GetAllUsernames = /* GraphQL */ `
	query {
		usersPermissionsUsers {
			data {
				attributes {
					username
				}
			}
		}
	}
`;

export const GetUser = (username) => /* GraphQL */ `
	query {
		usersPermissionsUsers(filters: { username: { eq: "${username}" } }) {
			data {
				attributes {
					firstName
					lastName
					username
					email
					type
					startYear
					graduationYear
					branch
					bio
					university {
						data {
							attributes {
								name
							}
						}
					}
					avatar {
						data {
							attributes {
								formats
							}
						}
					}
					socialLinks {
						data {
							attributes {
								appName
								url
							}
						}
					}
					interests {
						data {
							attributes {
								interest
							}
						}
					}
					blogs {
						data {
							attributes {
								title
								slug
								excerpt
								createdAt
								tags {
									data {
										attributes {
											tag
										}
									}
								}
								cover {
									data {
										attributes {
											formats
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const GetListOfUniversities = /* GraphQL */ `
	query {
		universities {
			data {
				attributes {
					name
					domain
				}
			}
		}
	}
`;

export const GetUserDataOfBlog = (slug, username) => /* GraphQL */ `
	query {
		blogs(filters: { slug: { eq: "${slug}" } }) {
			data {
				attributes {
					likes(filters: { user: { username: { eq: "${username}" } } }) {
						data {
							id
						}
					}
					bookmarks(filters: { user: { username: { eq: "${username}" } } }) {
						data {
							id
						}
					}
				}
			}
		}
	}
`;

export const CreateBookmark = (blogId, userId) => /* GraphQL */ `
	mutation {
		createBookmark(data: { blog: ${blogId}, user: ${userId} }) {
			data {
				id
			}
		}
	}
`;

export const DeleteBookmark = (bookmarkId) => /* GraphQL */ `
	mutation {
		deleteBookmark(id: ${bookmarkId}) {
			data {
				id
			}
		}
	}
`;

export const CreateLike = (blogId, userId) => /* GraphQL */ `
	mutation {
		createLike(data: { blog: ${blogId}, user: ${userId} }) {
			data {
				id
			}
		}
	}
`;

export const DeleteLike = (likeId) => /* GraphQL */ `
	mutation {
		deleteLike(id: ${likeId}) {
			data {
				id
			}
		}
	}
`;
