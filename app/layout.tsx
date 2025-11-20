import { Provider } from "@/common/provider";
import { generateMetadata, siteConfig } from "@/lib/seo";
import logo from "@/public/logo2.png";
import type { Metadata } from "next";
import "../styles/force-lists.css";
import "../styles/rich-content.css";
import "../styles/tiptap-editor.css";
import "./globals.css";

export const metadata: Metadata = {
	...generateMetadata({}),
	metadataBase: new URL(siteConfig.url),
	icons: {
		icon: logo.src,
		shortcut: logo.src,
		apple: logo.src,
	},
	manifest: "/manifest.json",
	viewport: {
		width: "device-width",
		initialScale: 1,
		maximumScale: 5,
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href={logo.src} />
				<link rel="apple-touch-icon" href={logo.src} />
				<meta name="theme-color" content="#13b154" />
			</head>
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
