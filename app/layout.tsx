import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "InterviewFuel",

	description:
		"Generate interview questions and practice mock interviews with AI.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="transition-colors duration-300">
			<body className="transition-colors duration-300">
				<Toaster richColors position="top-right" />
				<NextTopLoader />
				{children}
			</body>
		</html>
	);
}
