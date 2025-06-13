import dynamic from "next/dynamic";

type Props = {};

const Login = dynamic(() => import("./Login"), {
	ssr: true,
});

const LoginHOC = (props: Props) => {
	return <Login {...props} />;
};

export default LoginHOC;
