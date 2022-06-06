import { useState, createContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ value, children }) => {
	const [user, setUser] = useState(value);

	const context = {
		user,
		setUser,
	};

	return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
};

export default UserContext;
