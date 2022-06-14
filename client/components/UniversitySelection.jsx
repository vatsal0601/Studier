import Dropdown from "@components/Dropdown";

const UniversitySelection = ({ listOfUniversities, university, setUniversity }) => {
	return (
		<div>
			<p className="w-full text-xs font-semibold text-zinc-600 lg:text-sm">
				University Name<span className="text-red-600">*</span>
			</p>
			<Dropdown list={listOfUniversities} selected={university} setSelected={setUniversity} />
		</div>
	);
};

export default UniversitySelection;
