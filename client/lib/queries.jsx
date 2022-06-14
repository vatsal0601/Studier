export const GetAllBlogs = /* GraphQL */ `
	query {
		blogs(sort: "createdAt:desc", pagination: { limit: 4 }) {
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

export const GetBlog = /* GraphQL */ `
	query ($slug: String!) {
		blogs(filters: { slug: { eq: $slug } }) {
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
								url
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

export const GetLoggedInUserData = /* GraphQL */ `
	query ($username: String!) {
		usersPermissionsUsers(filters: { username: { eq: $username } }) {
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

export const LoginUser = /* GraphQL */ `
	mutation ($identifier: String!, $password: String!) {
		login(input: { identifier: $identifier, password: $password }) {
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

export const GetUser = /* GraphQL */ `
	query ($username: String!) {
		usersPermissionsUsers(filters: { username: { eq: $username } }) {
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
								url
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
				id
				attributes {
					name
					domain
				}
			}
		}
	}
`;

export const GetUserDataOfBlog = /* GraphQL */ `
	query ($slug: String!, $username: String!) {
		blogs(filters: { slug: { eq: $slug } }) {
			data {
				attributes {
					likes(filters: { user: { username: { eq: $username } } }) {
						data {
							id
						}
					}
					bookmarks(filters: { user: { username: { eq: $username } } }) {
						data {
							id
						}
					}
				}
			}
		}
	}
`;

export const CreateBookmark = /* GraphQL */ `
	mutation ($blogId: ID!, $userId: ID!) {
		createBookmark(data: { blog: $blogId, user: $userId }) {
			data {
				id
			}
		}
	}
`;

export const DeleteBookmark = /* GraphQL */ `
	mutation ($bookmarkId: ID!) {
		deleteBookmark(id: $bookmarkId) {
			data {
				id
			}
		}
	}
`;

export const CreateLike = /* GraphQL */ `
	mutation ($blogId: ID!, $userId: ID!) {
		createLike(data: { blog: $blogId, user: $userId }) {
			data {
				id
			}
		}
	}
`;

export const DeleteLike = /* GraphQL */ `
	mutation ($likeId: ID!) {
		deleteLike(id: $likeId) {
			data {
				id
			}
		}
	}
`;

export const CheckUsername = /* GraphQL */ `
	query ($username: String!) {
		usersPermissionsUsers(filters: { username: { eq: $username } }) {
			data {
				attributes {
					username
				}
			}
		}
	}
`;

export const CheckEmail = /* GraphQL */ `
	query ($email: String) {
		usersPermissionsUsers(filters: { email: { eq: $email } }) {
			data {
				attributes {
					email
				}
			}
		}
	}
`;

export const UploadImage = /* GraphQL */ `
	mutation ($file: Upload!) {
		upload(file: $file) {
			data {
				id
			}
		}
	}
`;

export const CreateUser = /* GraphQL */ `
	mutation (
		$username: String!
		$email: String!
		$password: String!
		$firstName: String!
		$lastName: String!
		$enrollmentNumber: String!
		$branch: String!
		$bio: String!
		$startYear: String!
		$graduationYear: String!
		$university: ID!
		$type: ENUM_USERSPERMISSIONSUSER_TYPE!
		$confirmed: Boolean!
		$avatar: ID!
	) {
		createUsersPermissionsUser(
			data: {
				username: $username
				email: $email
				password: $password
				firstName: $firstName
				lastName: $lastName
				enrollmentNumber: $enrollmentNumber
				branch: $branch
				bio: $bio
				startYear: $startYear
				graduationYear: $graduationYear
				university: $university
				type: $type
				confirmed: $confirmed
				avatar: $avatar
			}
		) {
			data {
				id
				attributes {
					username
				}
			}
		}
	}
`;
