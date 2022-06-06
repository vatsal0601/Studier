import { ExclamationCircleIcon } from "@heroicons/react/solid";
import Link from "next/link";

const Input = ({ setInput, isInputError, type, name, placeholder, isRequired, isLogin }) => {
	return (
		<div>
			<label
				htmlFor={name}
				className={`${
					isLogin ? "flex justify-between" : "block"
				} w-full text-xs font-semibold text-zinc-600 lg:text-sm`}>
				<span>
					{placeholder} {isRequired && <span className="text-red-600">*</span>}
				</span>
				{isLogin && (
					<span className="font-normal">
						<Link href="/forgot">
							<a className="font-medium text-blue-600 hover:underline">
								Forgot Password?
							</a>
						</Link>
					</span>
				)}
			</label>
			<input
				type={type}
				name={name}
				placeholder={placeholder}
				onChange={(e) => setInput(e.target.value)}
				className="focus:ring-3 w-full truncate rounded-lg border-zinc-300 p-3 text-sm placeholder-zinc-400 ring-blue-600 transition-all focus:outline-none lg:text-base"
			/>
			{isInputError && (
				<p className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 lg:text-sm">
					<ExclamationCircleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
					Please enter a valid value
				</p>
			)}
		</div>
	);
};

export default Input;
