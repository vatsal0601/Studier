import Input from "@components/Input";
import Image from "@components/Image";
import Dropdown from "@components/Dropdown";
import { ExclamationCircleIcon } from "@heroicons/react/solid";

const PersonalDetails = ({
	avatarDetails,
	branchDetails,
	bioDetails,
	typeDetails,
	startYearDetails,
	graduationYearDetails,
}) => {
	const { file, setFile, isFileError, setIsFileError } = avatarDetails;
	const { value: bio, setValue: setBio } = bioDetails;
	const { availableTypes, type, setType } = typeDetails;

	return (
		<>
			<div className="space-y-3 lg:space-y-5">
				<div>
					<p className="w-full text-xs font-semibold text-zinc-600 lg:text-sm">
						Avatar <span className="text-red-600">*</span>
					</p>
					<Image
						file={file}
						setFile={setFile}
						fileError={isFileError}
						setIsFileError={setIsFileError}
					/>
					{isFileError && (
						<p className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 lg:text-sm">
							<ExclamationCircleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
							This field is required
						</p>
					)}
				</div>
				<Input input={branchDetails} name="branch" placeholder="Branch" type="text" />
				<div>
					<label
						htmlFor="bio"
						className="w-full text-xs font-semibold text-zinc-600 lg:text-sm">
						Bio
					</label>
					<textarea
						name="bio"
						rows="5"
						onChange={(e) => setBio(e.target.value)}
						value={bio}
						className="focus:ring-3 w-full resize-none rounded-lg border-zinc-300 p-3 text-sm placeholder-zinc-400 ring-blue-600 transition-all focus:outline-none lg:text-base"></textarea>
				</div>
				<div>
					<p className="w-full text-xs font-semibold text-zinc-600 lg:text-sm">
						Type <span className="text-red-600">*</span>
					</p>
					<Dropdown list={availableTypes} selected={type} setSelected={setType} />
				</div>
				<Input
					input={startYearDetails}
					isRequired={true}
					name="start-year"
					placeholder="Start Year"
					type="text"
				/>
				<Input
					input={graduationYearDetails}
					isRequired={true}
					name="graduation-year"
					placeholder="Graduation Year"
					type="text"
				/>
			</div>
		</>
	);
};

export default PersonalDetails;
