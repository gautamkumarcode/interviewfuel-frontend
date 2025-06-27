"use client";

export const SignupForm = () => {
	return (
		<div className="flex flex-col items-center justify-center px-4 py-8 bg-gray-100 h-screen">
			<h1 className="text-2xl font-bold mb-6">Create an account</h1>
			<p className="text-sm text-gray-600 mb-4">
				Please enter your email and password to create an account.
			</p>
			<form className="w-full max-w-md space-y-4">
				<input
					type="email"
					placeholder="Email"
					className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<input
					type="password"
					placeholder="Password"
					className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
					Create Account
				</button>
			</form>
		</div>
	);
};
