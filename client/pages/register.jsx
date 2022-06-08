import Head from "@components/Header";
import Link from "next/link";
import Input from "@components/Input";
import Dropdown from "@components/Dropdown";
import { useState } from "react";
import { handleFetch } from "@lib/handleFetch";
import { GetListOfUniversities } from "@lib/queries";

const Register = ({ universities }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState(3);
	const listOfUniversities = universities.data.map((university) => university.attributes.name);
	const [university, setUniversity] = useState(listOfUniversities[0]);
	const [firstName, setFirstName] = useState(null);
	const [isFirstNameError, setIsFirstNameError] = useState(false);
	const [lastName, setLastName] = useState(null);
	const [isLastNameError, setIsLastNameError] = useState(false);
	const [username, setUsername] = useState(null);
	const [isUsernameError, setIsUsernameError] = useState(null);
	const [email, setEmail] = useState(null);
	const [isEmailError, setIsEmailError] = useState(false);
	const [password, setPassword] = useState(null);
	const [isPasswordError, setIsPasswordError] = useState(false);
	const [confirmPassword, setComfirmPassword] = useState(null);
	const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);
	const [enrollmentNumber, setEnrollmentNumber] = useState(null);
	const [isEnrollmentNumber, setIsEnrollmentNumber] = useState(false);
	const [branch, setBranch] = useState(null);
	const [isBranchError, setIsBranchError] = useState(false);
	const [bio, setBio] = useState(null);
	const MaxSteps = 3;

	const handleNext = () => {
		setStep((step) => (step += 1));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<>
			<Head title="Register" />
			<main className="container space-y-5 pb-96 pt-24 lg:space-y-10 lg:pb-64 lg:pt-32">
				<h1 className="text-4xl font-bold tracking-tighter text-zinc-900 lg:text-5xl">
					Register
				</h1>
				<form className="space-y-3 lg:w-2/5 lg:space-y-5" onSubmit={handleSubmit}>
					<p className="font-light text-zinc-600">
						Step {step} of {MaxSteps}
					</p>
					{step === 1 && (
						<div>
							<p className="w-full text-xs font-semibold text-zinc-600 lg:text-sm">
								University Name<span className="text-red-600">*</span>
							</p>
							<Dropdown
								list={listOfUniversities}
								selected={university}
								setSelected={setUniversity}
							/>
						</div>
					)}
					{step === 2 && (
						<div className="space-y-3 lg:space-y-5">
							<Input
								isInputError={isUsernameError}
								isRequired={true}
								name="username"
								placeholder="Username"
								setInput={setUsername}
								type="text"
							/>
							<Input
								isInputError={isFirstNameError}
								isRequired={true}
								name="first-name"
								placeholder="First Name"
								setInput={setFirstName}
								type="text"
							/>
							<Input
								isInputError={isLastNameError}
								isRequired={true}
								name="last-name"
								placeholder="Last Name"
								setInput={setLastName}
								type="text"
							/>
							<Input
								isInputError={isEmailError}
								isRequired={true}
								name="email"
								placeholder="Email"
								setInput={setEmail}
								type="email"
							/>
							<Input
								isInputError={isPasswordError}
								isRequired={true}
								name="password"
								placeholder="Password"
								setInput={setPassword}
								type="password"
							/>
							<Input
								isInputError={isConfirmPasswordError}
								isRequired={true}
								name="confirm-password"
								placeholder="Confirm Password"
								setInput={setComfirmPassword}
								type="password"
							/>
						</div>
					)}
					{step === 3 && (
						<div className="space-y-3 lg:space-y-5">
							<Input
								isInputError={isEnrollmentNumber}
								isRequired={true}
								name="enrollment-number"
								placeholder="Enrollment Number"
								setInput={setEnrollmentNumber}
								type="text"
							/>
							<Input
								isInputError={isBranchError}
								isRequired={true}
								name="branch"
								placeholder="Branch"
								setInput={setBranch}
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
									className="focus:ring-3 w-full resize-none truncate rounded-lg border-zinc-300 p-3 text-sm placeholder-zinc-400 ring-blue-600 transition-all focus:outline-none lg:text-base"></textarea>
							</div>
						</div>
					)}
					{step !== MaxSteps ? (
						<button
							onClick={handleNext}
							className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors active:bg-blue-700  lg:text-base">
							Next
						</button>
					) : (
						<button
							disabled={isLoading}
							className={`w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors active:bg-blue-700 disabled:bg-zinc-600 lg:text-base ${
								isLoading ? "inline-flex items-center justify-center gap-3" : ""
							}`}>
							{isLoading && <Loading className="h-5 w-5 text-white lg:h-7 lg:w-7" />}
							{isLoading ? "Submitting..." : "Submit"}{" "}
						</button>
					)}
					<p className="text-sm text-zinc-600 lg:text-base">
						Already have an account?{" "}
						<Link href="/login">
							<a className="font-medium text-blue-600 hover:underline">Login here</a>
						</Link>
					</p>
				</form>
			</main>
		</>
	);
};

export default Register;

export const getStaticProps = async () => {
	const data = await handleFetch(GetListOfUniversities);

	return {
		props: {
			universities: data.universities,
		},
		revalidate: 60,
	};
};
