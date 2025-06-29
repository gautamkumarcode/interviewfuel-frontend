import dynamic from "next/dynamic";

type Props = {};

const Signup = dynamic(() => import("./Signup"), {
	ssr: true,
});
const SignupHOC = (props: Props) => {
	return <Signup />;
};

export default SignupHOC;
