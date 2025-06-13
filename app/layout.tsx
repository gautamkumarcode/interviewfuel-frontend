import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "InterviewFuel",
	keywords: [
		"interview",
		"interview preparation",
		"coding interview",
		"technical interview",
		"software engineering",
		"job interview",
		"career",
		"mock interview",
		"practice interview",
		"interview questions",
		"interview tips",
		"interview skills",
		"interview coaching",
		"interview feedback",
		"interview success",
		"interview strategies",
		"interview resources",
		"interview guide",
	],
	authors: [{ name: "InterviewFuel Team" }],
	creator: "InterviewFuel Team",
	openGraph: {
		title: "InterviewFuel",
		description:
			"Your ultimate platform for interview preparation and practice.",
		url: "https://interviewfuel.com",
		siteName: "InterviewFuel",
		images: [
			{
				url: "https://interviewfuel.com/og-image.png",
				width: 1200,
				height: 630,
				alt: "InterviewFuel - Your ultimate platform for interview preparation and practice.",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "InterviewFuel",
		description:
			"Your ultimate platform for interview preparation and practice.",
		images: ["https://interviewfuel.com/og-image.png"],
		creator: "@interviewfuel",
	},
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
