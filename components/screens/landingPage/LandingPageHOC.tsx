import dynamic from "next/dynamic";

const LandingPage = dynamic(() => import("./LandingPage"), {
	ssr: true,
});

const LandingPageHOC = () => {
	return <LandingPage />;
};

export default LandingPageHOC;
