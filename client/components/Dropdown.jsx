import { Fragment } from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";

const Dropdown = ({ list, selected, setSelected }) => {
	return (
		<div>
			<Listbox value={selected} onChange={setSelected}>
				<div className="relative">
					<Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-zinc-300 bg-white py-3 pl-3 pr-10 text-left ring-blue-600 focus:outline-none focus:ring-2">
						<span className="block truncate text-sm lg:text-base">{selected}</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<SelectorIcon className="h-5 w-5 text-zinc-400" />
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave="transition-opacity duration-75"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg border border-zinc-300 bg-white py-2 focus:outline-none">
							{list.map((value, index) => (
								<Listbox.Option
									key={index}
									className={({ active }) =>
										`${active ? "bg-blue-100 text-blue-600" : "text-zinc-900"}
												  relative cursor-pointer select-none py-2 pl-3`
									}
									value={value}>
									{({ selected, active }) => (
										<>
											<span
												className={`${
													selected ? "font-medium" : "font-normal"
												} block truncate text-sm lg:text-base`}>
												{value}
											</span>
											{selected ? (
												<span
													className={`${
														active ? "text-blue-600" : "text-blue-600"
													}
														absolute inset-y-0 right-0 flex items-center pr-3`}>
													<CheckIcon className="h-5 w-5" />
												</span>
											) : null}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
};

export default Dropdown;
