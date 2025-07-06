import dynamic from "next/dynamic";

// type Props = {};

const ForgotPassword = dynamic(() => import("./ForgotPassword"), {
    ssr: true,
});
const ForgotPasswordHOC = () => {
    return <ForgotPassword />;
};

export default ForgotPasswordHOC;
