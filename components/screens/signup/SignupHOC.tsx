import dynamic from "next/dynamic";


const Signup = dynamic(() => import("./Signup"), {
	ssr: true,
});
const SignupHOC = () => {
	return <Signup />;
};

export default SignupHOC;
