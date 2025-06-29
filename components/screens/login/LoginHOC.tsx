import dynamic from "next/dynamic";


const Login = dynamic(() => import("./Login"), {
	ssr: true,
});

const LoginHOC = () => {
	return <Login  />;
};

export default LoginHOC;
