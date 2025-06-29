import dynamic from "next/dynamic";



const PracticeMode = dynamic(
	() => import("./PracticeMode").then((mod) => mod.PracticeMode),
	{
		ssr: false,
	}
);
const PracticeModeHOC = () => {
	return <PracticeMode />;
};

export default PracticeModeHOC;
