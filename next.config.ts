import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Enable React Strict Mode
	reactStrictMode: true,

	// Configure page extensions to include TypeScript
	pageExtensions: ["ts", "tsx", "js", "jsx"],

	// Enable the App Router (if you're using it)

	// Optional: TypeScript configuration
	typescript: {
		// Enable TypeScript during production build
		ignoreBuildErrors: false,
	},
	turbopack: {},
};

export default nextConfig;