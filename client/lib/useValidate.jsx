import { useState, useEffect, useRef } from "react";

export const useValidate = ({ regex, isRequired, password, startYear, endYear }) => {
	const [value, setValue] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const didMount = useRef(false); // Used to make use effect run only after initial render (note: disable strict mode in react to see it in action)

	useEffect(() => {
		if (didMount.current) {
			if (isRequired && value.trim() === "") return setErrorMessage("This field is required");
			if (regex) {
				const validator = regex;
				if (!validator.test(value)) return setErrorMessage("Please enter a valid value");
			}
			if (password && password !== value) return setErrorMessage("Password doesn't match");
			if (startYear && endYear && (+value < startYear || +value > endYear))
				return setErrorMessage("Please enter a valid value");
			return setErrorMessage("");
		} else didMount.current = true;
	}, [value]);

	return { value, setValue, errorMessage, setErrorMessage };
};
