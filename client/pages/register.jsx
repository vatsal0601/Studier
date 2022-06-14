import Head from "@components/Header";
import Loading from "@components/Loading";
import UniversitySelection from "@components/UniversitySelection";
import UserRegistrationDetails from "@components/UserRegistrationDetails";
import PersonalDetails from "@components/PersonalDetails";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import { useState, Fragment, useEffect } from "react";
import { ArrowSmLeftIcon } from "@heroicons/react/solid";
import { handleFetch } from "@lib/handleFetch";
import { CheckEmail, CheckUsername, CreateUser, GetListOfUniversities } from "@lib/queries";
import { useValidate } from "@lib/useValidate";
import { useRouter } from "next/router";

const Register = ({ universities }) => {
	const availableTypes = ["Student", "Professor"];
	const listOfUniversities = universities.data.map((university) => university.attributes.name);
	const MaxSteps = 3;
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState(1);
	const [transitionEnterClass, setTransitionEnterClass] = useState("translate-x-full");
	const [transitionLeaveClass, setTransitionLeaveClass] = useState("-translate-x-full");
	const [university, setUniversity] = useState(listOfUniversities[0]);
	const [universityId, setUniversityId] = useState(null);
	const [type, setType] = useState(availableTypes[0]);
	const [username, setUsername] = useState("");
	const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
	const [file, setFile] = useState(null);
	const [isFileError, setIsFileError] = useState(false);

	const firstNameDetails = useValidate({ regex: /^[a-zA-z]+$/, isRequired: true });
	const lastNameDetails = useValidate({ regex: /^[a-zA-z]+$/, isRequired: true });
	const emailDetails = useValidate({
		regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		isRequired: true,
	});
	const passwordDetails = useValidate({
		regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
		isRequired: true,
	});
	const confirmPasswordDetails = useValidate({
		isRequired: true,
		password: passwordDetails.value,
	});
	const enrollmentNumberDetails = useValidate({ isRequired: true });
	const branchDetails = useValidate({ regex: /^[a-zA-z ]+$/, isRequired: true });
	const bioDetails = useValidate({});
	const startYearDetails = useValidate({ isRequired: true, startYear: 1900, endYear: 2999 });
	const graduationYearDetails = useValidate({ isRequired: true, startYear: 1900, endYear: 2999 });

	useEffect(() => {
		universities.data.forEach((element) => {
			if (element.attributes.name === university) setUniversityId(element.id);
		});
	}, [university]);

	const handleNext = () => {
		if (step === 2) {
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

			if (emailDetails.value.trim() === "" || emailDetails.errorMessage) {
				if (!emailDetails.errorMessage.length > 0)
					emailDetails.setErrorMessage("This field is required");
				return;
			}
			if (passwordDetails.value.trim() === "" || passwordDetails.errorMessage) {
				if (!passwordDetails.errorMessage.length > 0)
					passwordDetails.setErrorMessage("This field is required");
				return;
			}
			if (confirmPasswordDetails.value.trim() === "" || confirmPasswordDetails.errorMessage) {
				if (!confirmPasswordDetails.errorMessage.length > 0)
					confirmPasswordDetails.setErrorMessage("This field is required");
				return;
			}
		}
		setTransitionEnterClass("translate-x-full");
		setTransitionLeaveClass("-translate-x-full");
		setStep((step) => (step += 1));
	};

	const handleSubmit = async () => {
		if (file === null || isFileError) {
			setIsFileError(true);
			return;
		}
		if (enrollmentNumberDetails.value.trim() === "" || enrollmentNumberDetails.errorMessage) {
			if (!enrollmentNumberDetails.errorMessage.length > 0)
				enrollmentNumberDetails.setErrorMessage("This field is required");
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

		const sendData = async (imageId) => {
			const data = await handleFetch({
				query: CreateUser,
				variables: {
					username: username,
					email: emailDetails.value,
					password: passwordDetails.value,
					firstName: firstNameDetails.value,
					lastName: lastNameDetails.value,
					enrollmentNumber: enrollmentNumberDetails.value,
					branch: branchDetails.value,
					bio: bioDetails.value,
					startYear: startYearDetails.value,
					graduationYear: graduationYearDetails.value,
					university: universityId,
					type: type,
					confirmed: true,
					avatar: imageId,
				},
			});
			console.log(data);
		};

		setIsLoading(true);
		const imageId = await uploadImage();
		await sendData(imageId);
		router.push("/login");
	};

	const handleUsername = async () => {
		if (username.trim() === "") return setUsernameErrorMessage("This field is required");
		const usernameData = await handleFetch({ query: CheckUsername, variables: { username } });
		if (usernameData.usersPermissionsUsers.data.length === 1)
			return setUsernameErrorMessage("Username not available");
		return setUsernameErrorMessage("");
	};

	const handleEmail = async () => {
		if (emailDetails.value.trim() === "")
			return emailDetails.setErrorMessage("This field is required");
		const emailData = await handleFetch({
			query: CheckEmail,
			variables: { email: emailDetails.value },
		});
		if (emailData.usersPermissionsUsers.data.length === 1)
			return emailDetails.setErrorMessage("Email already exists");
		return emailDetails.setErrorMessage("");
	};

	return (
		<>
			<Head title="Register" />
			<main className="container space-y-10 pb-96 pt-24 lg:flex lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-10 lg:space-y-0 lg:pb-64 lg:pt-32">
				<svg
					className="mx-auto h-full w-full lg:mx-0 xl:h-2/5 xl:w-2/5"
					viewBox="0 0 840 524"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<g clipPath="url(#clip0_2_2)">
						<path
							d="M79.2003 506.814C82.9165 511.823 87.5232 516.104 92.7902 519.444C93.9103 520.154 95.0602 520.824 96.2301 521.444H123.76C123.43 520.784 123.11 520.114 122.8 519.444C114.264 501.432 111.587 481.197 115.146 461.585C118.705 441.973 128.32 423.969 142.64 410.104C126 415.244 110.62 425.264 100.56 439.474C95.672 446.394 92.1957 454.21 90.3301 462.474C88.6676 445.946 91.3099 429.269 98.0001 414.064C84.4903 425.054 73.9698 440.104 69.9601 457.044C65.9503 473.994 68.86 492.804 79.2003 506.814Z"
							fill="#F0F0F0"
						/>
						<path
							d="M835.444 280.989H648.276C647.122 280.988 646.015 280.529 645.199 279.713C644.383 278.897 643.924 277.79 643.923 276.636V160.853C643.924 159.699 644.383 158.592 645.199 157.776C646.015 156.96 647.122 156.501 648.276 156.5H835.444C836.598 156.501 837.705 156.96 838.521 157.776C839.337 158.592 839.796 159.699 839.797 160.853V276.636C839.796 277.79 839.337 278.897 838.521 279.713C837.705 280.529 836.598 280.988 835.444 280.989Z"
							fill="white"
						/>
						<path
							d="M835.444 280.989H648.276C647.122 280.988 646.015 280.529 645.199 279.713C644.383 278.897 643.924 277.79 643.923 276.636V160.853C643.924 159.699 644.383 158.592 645.199 157.776C646.015 156.96 647.122 156.501 648.276 156.5H835.444C836.598 156.501 837.705 156.96 838.521 157.776C839.337 158.592 839.796 159.699 839.797 160.853V276.636C839.796 277.79 839.337 278.897 838.521 279.713C837.705 280.529 836.598 280.988 835.444 280.989ZM648.276 158.241C647.583 158.242 646.919 158.517 646.43 159.007C645.94 159.496 645.665 160.16 645.664 160.853V276.636C645.665 277.329 645.94 277.992 646.43 278.482C646.919 278.972 647.583 279.247 648.276 279.248H835.444C836.137 279.247 836.8 278.972 837.29 278.482C837.78 277.992 838.055 277.329 838.056 276.636V160.853C838.055 160.16 837.78 159.496 837.29 159.007C836.8 158.517 836.137 158.242 835.444 158.241H648.276Z"
							fill="#3F3D56"
						/>
						<path
							d="M798.446 195.168H685.274C684.235 195.168 683.239 194.756 682.504 194.021C681.769 193.286 681.357 192.29 681.357 191.251C681.357 190.212 681.769 189.215 682.504 188.481C683.239 187.746 684.235 187.333 685.274 187.333H798.446C799.485 187.333 800.481 187.746 801.216 188.481C801.951 189.215 802.363 190.212 802.363 191.251C802.363 192.29 801.951 193.286 801.216 194.021C800.481 194.756 799.485 195.168 798.446 195.168V195.168Z"
							fill="#CCCCCC"
						/>
						<path
							d="M798.446 222.155H685.274C684.235 222.155 683.239 221.743 682.504 221.008C681.769 220.273 681.357 219.277 681.357 218.238C681.357 217.199 681.769 216.203 682.504 215.468C683.239 214.733 684.235 214.32 685.274 214.32H798.446C799.485 214.32 800.481 214.733 801.216 215.468C801.951 216.203 802.363 217.199 802.363 218.238C802.363 219.277 801.951 220.273 801.216 221.008C800.481 221.743 799.485 222.155 798.446 222.155V222.155Z"
							fill="#CCCCCC"
						/>
						<path
							d="M788.363 264.944C796.095 264.944 802.363 258.676 802.363 250.944C802.363 243.212 796.095 236.944 788.363 236.944C780.631 236.944 774.363 243.212 774.363 250.944C774.363 258.676 780.631 264.944 788.363 264.944Z"
							fill="#2563EB"
						/>
						<path
							d="M707.944 203.489H520.776C519.622 203.488 518.515 203.029 517.699 202.213C516.883 201.397 516.424 200.29 516.423 199.136V83.3528C516.424 82.1987 516.883 81.0924 517.699 80.2764C518.515 79.4604 519.622 79.0013 520.776 79H707.944C709.098 79.0013 710.205 79.4604 711.021 80.2764C711.837 81.0924 712.296 82.1987 712.297 83.3528V199.136C712.296 200.29 711.837 201.397 711.021 202.213C710.205 203.029 709.098 203.488 707.944 203.489V203.489Z"
							fill="white"
						/>
						<path
							d="M707.944 203.489H520.776C519.622 203.488 518.515 203.029 517.699 202.213C516.883 201.397 516.424 200.29 516.423 199.136V83.3528C516.424 82.1987 516.883 81.0924 517.699 80.2764C518.515 79.4604 519.622 79.0013 520.776 79H707.944C709.098 79.0013 710.205 79.4604 711.021 80.2764C711.837 81.0924 712.296 82.1987 712.297 83.3528V199.136C712.296 200.29 711.837 201.397 711.021 202.213C710.205 203.029 709.098 203.488 707.944 203.489V203.489ZM520.776 80.7411C520.083 80.7419 519.419 81.0172 518.93 81.5069C518.44 81.9965 518.165 82.6603 518.164 83.3528V199.136C518.165 199.829 518.44 200.492 518.93 200.982C519.419 201.472 520.083 201.747 520.776 201.748H707.944C708.637 201.747 709.3 201.472 709.79 200.982C710.28 200.492 710.555 199.829 710.556 199.136V83.3528C710.555 82.6603 710.28 81.9965 709.79 81.5069C709.3 81.0172 708.637 80.7419 707.944 80.7411H520.776Z"
							fill="#3F3D56"
						/>
						<path
							d="M670.946 117.668H557.774C556.735 117.668 555.739 117.256 555.004 116.521C554.269 115.786 553.857 114.79 553.857 113.751C553.857 112.712 554.269 111.715 555.004 110.981C555.739 110.246 556.735 109.833 557.774 109.833H670.946C671.985 109.833 672.981 110.246 673.716 110.981C674.451 111.715 674.863 112.712 674.863 113.751C674.863 114.79 674.451 115.786 673.716 116.521C672.981 117.256 671.985 117.668 670.946 117.668V117.668Z"
							fill="#CCCCCC"
						/>
						<path
							d="M670.946 144.655H557.774C556.735 144.655 555.739 144.243 555.004 143.508C554.269 142.773 553.857 141.777 553.857 140.738C553.857 139.699 554.269 138.703 555.004 137.968C555.739 137.233 556.735 136.82 557.774 136.82H670.946C671.985 136.82 672.981 137.233 673.716 137.968C674.451 138.703 674.863 139.699 674.863 140.738C674.863 141.777 674.451 142.773 673.716 143.508C672.981 144.243 671.985 144.655 670.946 144.655V144.655Z"
							fill="#CCCCCC"
						/>
						<path
							d="M660.863 187.444C668.595 187.444 674.863 181.176 674.863 173.444C674.863 165.712 668.595 159.444 660.863 159.444C653.131 159.444 646.863 165.712 646.863 173.444C646.863 181.176 653.131 187.444 660.863 187.444Z"
							fill="#2563EB"
						/>
						<path
							d="M319.946 186.212C318.315 186.095 316.678 186.336 315.151 186.919C313.624 187.502 312.243 188.413 311.105 189.587C309.968 190.762 309.102 192.171 308.569 193.717C308.035 195.262 307.847 196.906 308.017 198.532L272.035 215.401L289.647 226.184L321.116 208.512C323.829 208.045 326.276 206.599 327.993 204.448C329.711 202.297 330.58 199.591 330.436 196.842C330.291 194.094 329.144 191.493 327.21 189.534C325.277 187.575 322.692 186.393 319.946 186.212V186.212Z"
							fill="#FFB6B6"
						/>
						<path
							d="M171.049 510.77L183.476 510.769L189.388 462.837L171.047 462.838L171.049 510.77Z"
							fill="#FFB6B6"
						/>
						<path
							d="M167.879 506.713L192.352 506.712H192.353C196.49 506.712 200.456 508.355 203.381 511.28C206.306 514.205 207.949 518.171 207.949 522.307V522.814L167.88 522.816L167.879 506.713Z"
							fill="#2F2E41"
						/>
						<path
							d="M234.459 510.77L246.886 510.769L252.798 462.837L234.457 462.838L234.459 510.77Z"
							fill="#FFB6B6"
						/>
						<path
							d="M231.289 506.713L255.762 506.712H255.763C259.9 506.712 263.866 508.355 266.791 511.28C269.716 514.205 271.359 518.171 271.359 522.307V522.814L231.29 522.816L231.289 506.713Z"
							fill="#2F2E41"
						/>
						<path
							d="M242.76 262.159L249.067 275.738L260.438 397.176L251.599 501.554H230.926L206.532 337.03L195.074 497.764L167.18 496.638L161.825 278.718L242.76 262.159Z"
							fill="#2F2E41"
						/>
						<path
							d="M142.249 150.094L168.398 139.456L205.307 141.526L238.12 153.483L249.067 275.738C220.521 291.326 191.605 295.581 162.185 284.435L134.881 204.807L142.249 150.094Z"
							fill="#E4E4E4"
						/>
						<path
							d="M227.911 156.715L239.515 153.483C239.515 153.483 248.292 147.776 251.18 164.741C254.068 181.705 268.927 208.093 268.927 208.093L294.364 194.536L306.14 220.255L265.97 244.589L223.666 201.964L227.911 156.715Z"
							fill="#E4E4E4"
						/>
						<path
							d="M164.26 116.805C162.851 113.608 162.085 110.164 162.007 106.67C161.929 103.177 162.539 99.702 163.804 96.4445C165.068 93.187 166.962 90.2105 169.377 87.6849C171.792 85.1593 174.681 83.1341 177.878 81.7249C181.076 80.3157 184.52 79.5501 188.013 79.4719C191.507 79.3936 194.982 80.0042 198.239 81.2688C201.497 82.5335 204.473 84.4273 206.999 86.8422C209.524 89.2572 211.55 92.1459 212.959 95.3435L213.111 95.6955C215.911 102.175 216.022 109.501 213.42 116.063C212.132 119.311 210.216 122.275 207.783 124.783C205.349 127.292 202.446 129.297 199.237 130.683C192.758 133.483 185.432 133.594 178.87 130.992C172.309 128.391 167.05 123.289 164.25 116.809L164.26 116.805Z"
							fill="#FFB6B6"
						/>
						<path
							d="M200.385 92.4517C205.918 93.4556 214.48 96.939 219.232 92.8524C216.886 90.1103 213.934 87.951 210.609 86.5451C209.955 86.3279 209.348 85.9853 208.824 85.5364C207.204 83.8991 208.456 81.078 207.715 78.8644C207.355 78.0555 206.812 77.3412 206.129 76.778C205.446 76.2147 204.641 75.8177 203.778 75.6185C202.129 75.125 200.401 75.0449 198.78 74.4465C194.946 73.0055 192.22 68.8817 188.29 67.7611C184.866 66.7706 181.421 68.31 178.465 70.1064C175.51 71.9028 172.587 74.0342 169.129 74.3751C166.546 74.6108 164.91 78.8603 162.317 78.9848C156.882 79.2492 157.183 75.6669 156.781 81.3768C156.549 84.7841 151.681 91.5626 151.76 94.9996C151.84 97.2516 151.442 99.4821 151.506 101.741C151.652 106.044 153.378 110.142 156.354 113.253C158.828 115.797 162.047 117.514 164.13 120.414C165.213 121.954 165.964 123.751 167.225 125.145C168.486 126.538 170.622 127.376 172.029 126.382C173.437 125.387 173.463 123.234 174.161 121.596C174.589 120.592 175.321 119.747 176.254 119.179C177.186 118.611 178.273 118.35 179.362 118.43C180.493 118.578 181.56 119.039 182.443 119.76C183.327 120.481 183.992 121.434 184.363 122.513C183.704 118.893 181.966 115.501 181.306 111.878C180.646 108.255 181.506 103.927 184.626 102.513C185.965 101.89 187.775 101.722 188.313 100.286C188.643 99.4209 188.341 98.3987 188.468 97.4631C189.154 92.8782 196.777 91.7438 200.385 92.4517Z"
							fill="#2F2E41"
						/>
						<path
							d="M165.32 283.021C165.082 281.404 164.492 279.858 163.591 278.494C162.691 277.129 161.502 275.978 160.109 275.123C158.716 274.267 157.152 273.728 155.528 273.542C153.904 273.356 152.259 273.529 150.708 274.047L126.44 242.578L119.73 262.109L143.805 288.998C144.849 291.545 146.791 293.62 149.263 294.831C151.735 296.041 154.565 296.303 157.218 295.566C159.87 294.83 162.159 293.146 163.653 290.833C165.146 288.521 165.739 285.742 165.32 283.021V283.021Z"
							fill="#FFB6B6"
						/>
						<path
							d="M150.631 156.03L142.249 150.094C142.249 150.094 123.072 148.996 120.282 164.741L85.1187 222.586L128.717 282.734L149.854 260.483L123.183 229.315L145.576 188.199L150.631 156.03Z"
							fill="#E4E4E4"
						/>
						<path
							d="M354.854 165.196H354.415V153.149C354.415 152.233 354.234 151.326 353.884 150.48C353.533 149.635 353.02 148.866 352.372 148.218C351.725 147.571 350.956 147.057 350.11 146.707C349.264 146.357 348.358 146.176 347.442 146.176H321.919C321.003 146.176 320.096 146.357 319.25 146.707C318.405 147.057 317.636 147.571 316.988 148.218C316.341 148.866 315.827 149.635 315.477 150.48C315.127 151.326 314.946 152.233 314.946 153.149V219.24C314.946 220.155 315.127 221.062 315.477 221.908C315.827 222.754 316.341 223.523 316.988 224.17C317.636 224.818 318.405 225.331 319.25 225.682C320.096 226.032 321.003 226.212 321.919 226.212H347.442C348.358 226.212 349.264 226.032 350.11 225.682C350.956 225.331 351.725 224.818 352.372 224.17C353.02 223.523 353.533 222.754 353.884 221.908C354.234 221.062 354.415 220.156 354.415 219.24V173.771H354.854V165.196Z"
							fill="#3F3D56"
						/>
						<path
							d="M347.723 147.99H344.392C344.545 148.366 344.603 148.773 344.562 149.177C344.521 149.581 344.381 149.968 344.154 150.304C343.928 150.641 343.622 150.917 343.264 151.108C342.906 151.299 342.507 151.398 342.101 151.398H327.479C327.074 151.398 326.674 151.299 326.316 151.108C325.958 150.917 325.653 150.641 325.426 150.304C325.2 149.968 325.06 149.58 325.019 149.177C324.977 148.773 325.036 148.366 325.189 147.99H322.077C320.696 147.99 319.372 148.539 318.395 149.515C317.419 150.492 316.87 151.816 316.87 153.197V219.191C316.87 220.572 317.419 221.897 318.395 222.873C319.372 223.85 320.696 224.398 322.077 224.398H347.723C349.104 224.398 350.429 223.85 351.405 222.873C352.382 221.897 352.93 220.572 352.93 219.191V153.197C352.93 151.816 352.382 150.492 351.405 149.515C350.429 148.539 349.104 147.99 347.723 147.99Z"
							fill="#2563EB"
						/>
						<path
							d="M577.944 124.489H390.776C389.622 124.488 388.515 124.029 387.699 123.213C386.883 122.397 386.424 121.29 386.423 120.136V4.35277C386.424 3.19875 386.883 2.09237 387.699 1.27635C388.515 0.460337 389.622 0.0013207 390.776 0H577.944C579.098 0.0013207 580.205 0.460337 581.021 1.27635C581.837 2.09237 582.296 3.19875 582.297 4.35277V120.136C582.296 121.29 581.837 122.397 581.021 123.213C580.205 124.029 579.098 124.488 577.944 124.489V124.489Z"
							fill="white"
						/>
						<path
							d="M577.944 124.489H390.776C389.622 124.488 388.515 124.029 387.699 123.213C386.883 122.397 386.424 121.29 386.423 120.136V4.35277C386.424 3.19875 386.883 2.09237 387.699 1.27635C388.515 0.460337 389.622 0.0013207 390.776 0H577.944C579.098 0.0013207 580.205 0.460337 581.021 1.27635C581.837 2.09237 582.296 3.19875 582.297 4.35277V120.136C582.296 121.29 581.837 122.397 581.021 123.213C580.205 124.029 579.098 124.488 577.944 124.489V124.489ZM390.776 1.7411C390.083 1.74186 389.419 2.01726 388.93 2.50688C388.44 2.9965 388.165 3.66035 388.164 4.35277V120.136C388.165 120.829 388.44 121.492 388.93 121.982C389.419 122.472 390.083 122.747 390.776 122.748H577.944C578.637 122.747 579.3 122.472 579.79 121.982C580.28 121.492 580.555 120.829 580.556 120.136V4.35277C580.555 3.66035 580.28 2.9965 579.79 2.50688C579.3 2.01726 578.637 1.74186 577.944 1.7411H390.776Z"
							fill="#3F3D56"
						/>
						<path
							d="M540.946 38.6684H427.774C426.735 38.6684 425.739 38.2556 425.004 37.521C424.269 36.7863 423.857 35.7899 423.857 34.7509C423.857 33.7119 424.269 32.7155 425.004 31.9808C425.739 31.2461 426.735 30.8334 427.774 30.8334H540.946C541.985 30.8334 542.981 31.2461 543.716 31.9808C544.451 32.7155 544.863 33.7119 544.863 34.7509C544.863 35.7899 544.451 36.7863 543.716 37.521C542.981 38.2556 541.985 38.6684 540.946 38.6684V38.6684Z"
							fill="#CCCCCC"
						/>
						<path
							d="M540.946 65.6554H427.774C426.735 65.6554 425.739 65.2427 425.004 64.508C424.269 63.7734 423.857 62.7769 423.857 61.7379C423.857 60.6989 424.269 59.7025 425.004 58.9678C425.739 58.2332 426.735 57.8204 427.774 57.8204H540.946C541.985 57.8204 542.981 58.2332 543.716 58.9678C544.451 59.7025 544.863 60.6989 544.863 61.7379C544.863 62.7769 544.451 63.7734 543.716 64.508C542.981 65.2427 541.985 65.6554 540.946 65.6554Z"
							fill="#CCCCCC"
						/>
						<path
							d="M530.863 108.444C538.595 108.444 544.863 102.176 544.863 94.4441C544.863 86.7121 538.595 80.4441 530.863 80.4441C523.131 80.4441 516.863 86.7121 516.863 94.4441C516.863 102.176 523.131 108.444 530.863 108.444Z"
							fill="#2563EB"
						/>
						<path
							d="M382 523.444H0.999996C0.73478 523.444 0.480425 523.339 0.292889 523.151C0.105352 522.964 -3.8147e-06 522.709 -3.8147e-06 522.444C-3.8147e-06 522.179 0.105352 521.925 0.292889 521.737C0.480425 521.549 0.73478 521.444 0.999996 521.444H382C382.265 521.444 382.52 521.549 382.707 521.737C382.895 521.925 383 522.179 383 522.444C383 522.709 382.895 522.964 382.707 523.151C382.52 523.339 382.265 523.444 382 523.444Z"
							fill="#CACACA"
						/>
						<path
							d="M532.477 89.3636V101H529.318V92.2727H529.25L526.705 93.7955V91.1136L529.568 89.3636H532.477Z"
							fill="white"
						/>
						<path
							d="M656.773 179V176.727L661.114 173.136C661.402 172.898 661.648 172.674 661.852 172.466C662.061 172.254 662.22 172.036 662.33 171.812C662.443 171.589 662.5 171.341 662.5 171.068C662.5 170.769 662.436 170.513 662.307 170.301C662.182 170.089 662.008 169.926 661.784 169.812C661.561 169.695 661.303 169.636 661.011 169.636C660.72 169.636 660.462 169.695 660.239 169.812C660.019 169.93 659.848 170.102 659.727 170.33C659.606 170.557 659.545 170.833 659.545 171.159H656.545C656.545 170.341 656.729 169.636 657.097 169.045C657.464 168.455 657.983 168 658.653 167.682C659.324 167.364 660.11 167.205 661.011 167.205C661.943 167.205 662.75 167.354 663.432 167.653C664.117 167.949 664.646 168.366 665.017 168.903C665.392 169.441 665.58 170.072 665.58 170.795C665.58 171.242 665.487 171.687 665.301 172.131C665.116 172.57 664.782 173.057 664.301 173.591C663.82 174.125 663.136 174.761 662.25 175.5L661.159 176.409V176.477H665.705V179H656.773Z"
							fill="white"
						/>
						<path
							d="M788.318 256.159C787.402 256.159 786.587 256.002 785.875 255.688C785.167 255.369 784.61 254.932 784.205 254.375C783.799 253.818 783.595 253.178 783.591 252.455H786.773C786.777 252.678 786.845 252.879 786.977 253.057C787.114 253.231 787.299 253.367 787.534 253.466C787.769 253.564 788.038 253.614 788.341 253.614C788.633 253.614 788.89 253.562 789.114 253.46C789.337 253.354 789.511 253.208 789.636 253.023C789.761 252.837 789.822 252.625 789.818 252.386C789.822 252.152 789.75 251.943 789.602 251.761C789.458 251.58 789.256 251.437 788.994 251.335C788.733 251.233 788.432 251.182 788.091 251.182H786.909V249H788.091C788.405 249 788.682 248.949 788.92 248.847C789.163 248.744 789.35 248.602 789.483 248.42C789.619 248.239 789.686 248.03 789.682 247.795C789.686 247.568 789.631 247.367 789.517 247.193C789.403 247.019 789.244 246.883 789.04 246.784C788.839 246.686 788.606 246.636 788.341 246.636C788.053 246.636 787.795 246.687 787.568 246.79C787.345 246.892 787.169 247.034 787.04 247.216C786.911 247.398 786.845 247.606 786.841 247.841H783.818C783.822 247.129 784.017 246.5 784.403 245.955C784.794 245.409 785.328 244.981 786.006 244.67C786.684 244.36 787.462 244.205 788.341 244.205C789.201 244.205 789.96 244.35 790.619 244.642C791.282 244.934 791.799 245.335 792.17 245.847C792.545 246.354 792.731 246.936 792.727 247.591C792.735 248.242 792.511 248.777 792.057 249.193C791.606 249.61 791.034 249.856 790.341 249.932V250.023C791.28 250.125 791.987 250.413 792.46 250.886C792.934 251.356 793.167 251.947 793.159 252.659C793.163 253.341 792.958 253.945 792.545 254.472C792.136 254.998 791.566 255.411 790.835 255.71C790.108 256.009 789.269 256.159 788.318 256.159Z"
							fill="white"
						/>
					</g>
					<defs>
						<clipPath id="clip0_2_2">
							<rect width="839.797" height="523.444" fill="white" />
						</clipPath>
					</defs>
				</svg>
				<div className="space-y-5 lg:space-y-10">
					<h1 className="text-4xl font-bold tracking-tighter text-zinc-900 lg:text-5xl">
						Register
					</h1>
					<form
						className="space-y-3 lg:w-96 lg:space-y-5 xl:w-[30rem]"
						onSubmit={(e) => e.preventDefault()}>
						<div className="flex items-center gap-3 lg:gap-5">
							{step > 1 && (
								<button
									onClick={() => {
										setTransitionEnterClass("-translate-x-full");
										setTransitionLeaveClass("translate-x-full");
										setStep((step) => (step -= 1));
									}}
									className="inline-flex items-center gap-1 text-blue-600 active:text-blue-700">
									<span>
										<ArrowSmLeftIcon className="h-5 w-5" />
									</span>
									<span>Go Back</span>
								</button>
							)}
							<p className="font-light text-zinc-600">
								Step {step} of {MaxSteps}
							</p>
						</div>
						<Transition
							show={step === 1}
							as={Fragment}
							enter="transition transform"
							enterFrom="-translate-x-full opacity-0"
							enterTo="translate-x-0 opacity-100"
							leave="transition transform"
							leaveFrom="translate-x-0 opacity-100"
							leaveTo="-translate-x-full opacity-0">
							<div className="space-y-3 lg:space-y-5">
								<h1 className="text-3xl font-bold tracking-tighter text-zinc-900 lg:text-4xl">
									Select University
								</h1>
								<UniversitySelection
									listOfUniversities={listOfUniversities}
									university={university}
									setUniversity={setUniversity}
								/>
							</div>
						</Transition>
						<Transition
							show={step === 2}
							as={Fragment}
							enter="transition transform"
							enterFrom={`${transitionEnterClass} opacity-0`}
							enterTo="translate-x-0 opacity-100"
							leave="transition transform"
							leaveFrom="translate-x-0 opacity-100"
							leaveTo={`${transitionLeaveClass} opacity-0`}>
							<div className="space-y-3 lg:space-y-5">
								<h1 className="text-3xl font-bold tracking-tighter text-zinc-900 lg:text-4xl">
									Registration Details
								</h1>
								<UserRegistrationDetails
									usernameDetails={{
										username,
										setUsername,
										usernameErrorMessage,
									}}
									handleUsername={handleUsername}
									firstNameDetails={firstNameDetails}
									lastNameDetails={lastNameDetails}
									emailDetails={emailDetails}
									handleEmail={handleEmail}
									passwordDetails={passwordDetails}
									confirmPasswordDetails={confirmPasswordDetails}
								/>
							</div>
						</Transition>
						<Transition
							show={step === 3}
							as={Fragment}
							enter="transition transform"
							enterFrom={`${transitionEnterClass} opacity-0`}
							enterTo="translate-x-0 opacity-100"
							leave="transition transform"
							leaveFrom="translate-x-0 opacity-100"
							leaveTo="translate-x-full opacity-0">
							<div className="space-y-3 lg:space-y-5">
								<h1 className="text-3xl font-bold tracking-tighter text-zinc-900 lg:text-4xl">
									Personal Details
								</h1>
								<PersonalDetails
									avatarDetails={{
										file,
										setFile,
										isFileError,
										setIsFileError,
									}}
									enrollmentNumberDetails={enrollmentNumberDetails}
									branchDetails={branchDetails}
									bioDetails={bioDetails}
									typeDetails={{ availableTypes, type, setType }}
									startYearDetails={startYearDetails}
									graduationYearDetails={graduationYearDetails}
								/>
							</div>
						</Transition>
						{step !== MaxSteps ? (
							<button
								onClick={handleNext}
								className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors active:bg-blue-700  lg:text-base">
								Next
							</button>
						) : (
							<button
								disabled={isLoading}
								onClick={handleSubmit}
								className={`w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors active:bg-blue-700 disabled:bg-zinc-600 lg:text-base ${
									isLoading ? "inline-flex items-center justify-center gap-3" : ""
								}`}>
								{isLoading && (
									<Loading className="h-5 w-5 text-white lg:h-7 lg:w-7" />
								)}
								{isLoading ? "Creating Account..." : "Create Account"}
							</button>
						)}
						<p className="text-sm text-zinc-600 lg:text-base">
							Already have an account?{" "}
							<Link href="/login">
								<a className="font-medium text-blue-600 hover:underline">
									Login here
								</a>
							</Link>
						</p>
					</form>
				</div>
			</main>
		</>
	);
};

export default Register;

export const getStaticProps = async () => {
	const data = await handleFetch({ query: GetListOfUniversities });

	return {
		props: {
			universities: data.universities,
		},
		revalidate: 60,
	};
};
