import { Provider } from "@/common/provider";
import type { Metadata } from "next";
import "./globals.css";

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
		<html lang="en">
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
