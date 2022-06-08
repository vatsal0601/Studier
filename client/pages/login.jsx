import Head from "@components/Header";
import Input from "@components/Input";
import Link from "next/link";
import UserContext from "@lib/userContext";
import Loading from "@components/Loading";
import { useState, useContext } from "react";
import { handleFetch } from "@lib/handleFetch";
import { LoginUser } from "@lib/queries";
import { getUserFromLocalCookie, setToken } from "@lib/auth";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

const Login = () => {
	const [identifier, setIdentifier] = useState(null);
	const [password, setPassword] = useState(null);
	const [isIdentifierError, setIsIdentifierError] = useState(false);
	const [isPasswordError, setIsPasswordError] = useState(false);
	const [isLoginError, setIsLoginError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { user, setUser } = useContext(UserContext);
	const router = useRouter();

	const handleSubmit = (e) => {
		e.preventDefault();

		if (password === null || password === "") {
			setIsPasswordError(true);
		}
		if (identifier === null || identifier === "") {
			setIsIdentifierError(true);
		}

		const sendData = async () => {
			const jwtData = await handleFetch(LoginUser(identifier, password));
			if (jwtData) {
				setToken(jwtData.login.jwt);
				const userData = await getUserFromLocalCookie();
				setUser({
					id: userData.usersPermissionsUsers.data[0].id,
					...userData.usersPermissionsUsers.data[0].attributes,
				});
				router.push("/");
			} else {
				setIsLoginError(true);
			}
			setIsLoading(false);
		};
		sendData();
	};

	return (
		<>
			<Head title="Login" />
			<main className="container pb-96 pt-24 lg:pb-64 lg:pt-32">
				<div className="space-y-5 lg:space-y-10">
					<h1 className="text-4xl font-bold tracking-tighter text-zinc-900 lg:text-5xl">
						Login
					</h1>
					<div className="space-y-1">
						{isLoginError && (
							<p className="inline-flex items-center gap-1 text-red-600 lg:text-lg">
								<ExclamationCircleIcon className="h-5 w-5 lg:h-7 lg:w-7" /> Invalid
								Credentials
							</p>
						)}
						<form className="space-y-3 lg:w-2/5 lg:space-y-5" onSubmit={handleSubmit}>
							<Input
								name="identifier"
								type="text"
								isRequired={false}
								setInput={setIdentifier}
								isInputError={isIdentifierError}
								placeholder="Email or Username"
							/>
							<Input
								name="password"
								type="password"
								isRequired={false}
								setInput={setPassword}
								isInputError={isPasswordError}
								placeholder="Password"
								isLogin={true}
							/>
							<button
								disabled={isLoading}
								className={`w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors active:bg-blue-700 disabled:bg-zinc-600 lg:text-base ${
									isLoading ? "inline-flex items-center justify-center gap-3" : ""
								}`}>
								{isLoading && (
									<Loading className="h-5 w-5 text-white lg:h-7 lg:w-7" />
								)}
								{isLoading ? "Submitting..." : "Submit"}{" "}
							</button>
							<p className="text-sm text-zinc-600 lg:text-base">
								Don't have an account?{" "}
								<Link href="/register">
									<a className="font-medium text-blue-600 hover:underline">
										Register here
									</a>
								</Link>
							</p>
						</form>
					</div>
				</div>
			</main>
		</>
	);
};

export default Login;
