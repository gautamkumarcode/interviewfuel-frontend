"use client";

import LoginForm from "./components/Form";


const Login = () => {
	return (
		<div className="flex flex-col items-center justify-center  px-4 py-8 bg-gray-100 h-screen">
			<h1 className="text-2xl font-bold mb-6">Welcome back</h1>{" "}
			<p className="text-sm text-gray-600 mb-4">
				Please Enter your email and password to continue.
			</p>
			<LoginForm />
		</div>
	);
};

export default Login;
