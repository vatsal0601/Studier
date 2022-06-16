import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, XIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";

const Toast = ({ type, message }) => {
	const [isShowing, setIsShowing] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setIsShowing(false);
		}, 5000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	const renderIcon = (type) => {
		if (type === "success")
			return <CheckCircleIcon className="h-5 w-5 text-green-600 lg:h-7 lg:w-7" />;
		if (type === "error") return <XCircleIcon className="h-5 w-5 text-red-600 lg:h-7 lg:w-7" />;
		if (type === "info")
			return <ExclamationCircleIcon className="h-5 w-5 text-blue-600 lg:h-7 lg:w-7" />;
	};

	const getBorderColor = (type) => {
		if (type === "success") return "border-green-600";
		if (type === "error") return "border-red-600";
		if (type === "info") return "border-blue-600";
	};

	const deleteToast = () => {
		setIsShowing(false);
	};

	return (
		<>
			<div className="fixed right-0 top-16 z-40 w-full space-y-3 px-5 md:right-5 md:top-24 md:w-96 md:px-0">
				<Transition
					as="button"
					show={isShowing}
					enter="transition transform"
					enterFrom="translate-x-full opacity-0"
					enterTo="translate-x-0 opacity-100"
					leave="transition transform"
					leaveFrom="translate-x-0 opacity-100"
					leaveTo="translate-x-full opacity-0"
					onClick={() => deleteToast()}
					className={`relative flex w-full cursor-pointer items-center gap-1 rounded-lg border-2 bg-white p-3 text-xs text-zinc-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600/80 focus:ring-offset-2 lg:gap-3 lg:text-sm ${getBorderColor(
						type
					)}`}>
					<span>{renderIcon(type)}</span>
					<span>{message}</span>
					<XIcon className="absolute top-1 right-1 h-4 w-4 text-zinc-900" />
				</Transition>
			</div>
		</>
	);
};

export default Toast;
