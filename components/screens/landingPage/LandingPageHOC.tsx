import dynamic from "next/dynamic";
import React from "react";

const LandingPage = dynamic(() => import("./LandingPage"), {
  ssr: true,
});

const LandingPageHOC = () => {
  return <LandingPage />;
};

export default LandingPageHOC;
