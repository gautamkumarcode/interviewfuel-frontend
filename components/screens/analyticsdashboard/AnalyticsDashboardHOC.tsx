import dynamic from "next/dynamic";

type AnalyticsDashboardHOCProps = {
	onExit: () => void;
	// add other props here if needed
};

const AnalyticsDashboard = dynamic(
	() => import("./AnalyticsDashboard").then((mod) => mod.AnalyticsDashboard),
	{
		ssr: false,
	}
);
const AnalyticsDashboardHOC = (props: AnalyticsDashboardHOCProps) => {
	return <AnalyticsDashboard onExit={props.onExit} />;
};

export default AnalyticsDashboardHOC;
