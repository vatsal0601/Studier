import { handleFetch } from "@lib/handleFetch";
import { LoginUser, GetLoggedInUserData } from "@lib/queries";

export const getUserData = async (id) => {
	const { usersPermissionsUser } = await handleFetch({
		query: GetLoggedInUserData,
		variables: { id },
	});
	return {
		...usersPermissionsUser.data.attributes,
		avatar: usersPermissionsUser.data.attributes.avatar.data.attributes.formats.thumbnail.url,
		id,
	};
};

export const login = async (req) => {
	const { login } = await handleFetch({
		query: LoginUser,
		variables: { identifier: req.body.identifier, password: req.body.password },
	});
	return { jwt: login.jwt, id: login.user.id };
};
