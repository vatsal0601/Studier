import Input from "@components/Input";
import { ExclamationCircleIcon } from "@heroicons/react/solid";

const UserRegistrationDetails = ({
	usernameDetails,
	handleUsername,
	firstNameDetails,
	lastNameDetails,
	emailDetails,
	handleEmail,
	passwordDetails,
	confirmPasswordDetails,
}) => {
	const { username, setUsername, usernameErrorMessage } = usernameDetails;

	return (
		<div className="space-y-3 lg:space-y-5">
			<div>
				<label
					htmlFor="username"
					className="w-full text-xs font-semibold text-zinc-600 lg:text-sm">
					<span>
						Username <span className="text-red-600">*</span>
					</span>
				</label>
				<input
					type="text"
					name="username"
					placeholder="Username"
					onChange={(e) => setUsername(e.target.value)}
					onBlur={handleUsername}
					value={username}
					className="focus:ring-3 w-full truncate rounded-lg border-zinc-300 p-3 text-sm placeholder-zinc-400 ring-blue-600 transition-all focus:outline-none lg:text-base"
				/>
				{usernameErrorMessage && (
					<p className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 lg:text-sm">
						<ExclamationCircleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
						{usernameErrorMessage}
					</p>
				)}
			</div>
			<Input
				input={firstNameDetails}
				isRequired={true}
				name="first-name"
				placeholder="First Name"
				type="text"
			/>
			<Input
				input={lastNameDetails}
				isRequired={true}
				name="last-name"
				placeholder="Last Name"
				type="text"
			/>
			<Input
				input={emailDetails}
				isRequired={true}
				handleEmail={handleEmail}
				name="email"
				placeholder="Email"
				type="email"
			/>
			<Input
				input={passwordDetails}
				isRequired={true}
				name="password"
				placeholder="Password"
				type="password"
			/>
			<Input
				input={confirmPasswordDetails}
				isRequired={true}
				name="confirm-password"
				placeholder="Confirm Password"
				type="password"
			/>
		</div>
	);
};

export default UserRegistrationDetails;
