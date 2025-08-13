import dynamic from "next/dynamic";

const HistroyPage = dynamic(() => import("./Histroy"), {
	ssr: true,
});
const HistroyHOC = () => {
	return <HistroyPage />;
};

export default HistroyHOC;
