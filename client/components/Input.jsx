import Link from "next/link";
import { useState } from "react";
import { ExclamationCircleIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/solid";

const Input = ({
	type,
	name,
	placeholder,
	isRequired,
	forgotPassword,
	input,
	handleEmail,
	handleTitle,
}) => {
	const { value, setValue, errorMessage } = input;
	const [passwordType, setPasswordType] = useState("password");
	let validator;

	if (handleEmail) validator = handleEmail;
	if (handleTitle) validator = handleTitle;

	return (
		<div>
			<label
				htmlFor={name}
				className={`${
					forgotPassword ? "flex justify-between" : "block"
				} w-full text-xs font-semibold text-zinc-600 lg:text-sm`}>
				<span>
					{placeholder} {isRequired && <span className="text-red-600">*</span>}
				</span>
				{forgotPassword && (
					<span className="font-normal">
						<Link href="/forgot">
							<a tabIndex={-1} className="font-medium text-blue-600 hover:underline">
								Forgot Password?
							</a>
						</Link>
					</span>
				)}
			</label>
			<div className={forgotPassword ? "relative" : null}>
				<input
					type={forgotPassword ? passwordType : type}
					name={name}
					placeholder={placeholder}
					onChange={(e) => setValue(e.target.value)}
					value={value}
					onBlur={validator ? validator : () => {}}
					className="focus:ring-3 w-full truncate rounded-lg border-zinc-300 p-3 text-sm placeholder-zinc-400 ring-blue-600 transition-all focus:outline-none lg:text-base"
				/>
				{forgotPassword &&
					(passwordType === "password" ? (
						<EyeIcon
							onClick={() => setPasswordType("text")}
							className="absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-zinc-900 transition-colors active:text-blue-600 lg:h-5 lg:w-5"
						/>
					) : (
						<EyeOffIcon
							onClick={() => setPasswordType("password")}
							className="absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-zinc-900 transition-colors active:text-blue-600 lg:h-5 lg:w-5"
						/>
					))}
			</div>
			{errorMessage && (
				<p className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 lg:text-sm">
					<ExclamationCircleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
					{errorMessage}
				</p>
			)}
		</div>
	);
};

export default Input;
