import dynamic from "next/dynamic";

type PracticeModeProps = {
	onExit: () => void;
};

const PracticeMode = dynamic(
	() => import("./PracticeMode").then((mod) => mod.PracticeMode),
	{
		ssr: false,
	}
);
const PracticeModeHOC = (props: PracticeModeProps) => {
	return <PracticeMode onExit={() => window.history.back()} />;
};

export default PracticeModeHOC;
