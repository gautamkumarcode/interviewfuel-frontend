import { Metadata } from "next";

export const siteConfig = {
	name: "InterviewFuel",
	description:
		"Master your technical interviews with AI-powered mock interviews, practice questions, and instant feedback. From coding challenges to system design - we've got you covered.",
	url: "https://interviewfuel.dev",
	ogImage: "https://interviewfuel.dev/og-image.png",
	links: {
		twitter: "https://twitter.com/interviewfuel",
		github: "https://github.com/interviewfuel",
	},
	keywords: [
		"interview preparation",
		"coding interview",
		"technical interview",
		"mock interview",
		"interview questions",
		"coding practice",
		"system design",
		"data structures",
		"algorithms",
		"software engineering",
		"job interview",
		"career development",
	],
};

export function generateMetadata({
	title,
	description,
	image,
	keywords,
	noIndex = false,
	canonical,
}: {
	title?: string;
	description?: string;
	image?: string;
	keywords?: string[];
	noIndex?: boolean;
	canonical?: string;
}): Metadata {
	const metaTitle = title
		? `${title} | ${siteConfig.name}`
		: `${siteConfig.name} - Master Your Technical Interviews`;
	const metaDescription = description || siteConfig.description;
	const metaImage = image || siteConfig.ogImage;
	const metaKeywords = keywords
		? [...siteConfig.keywords, ...keywords]
		: siteConfig.keywords;

	return {
		title: metaTitle,
		description: metaDescription,
		keywords: metaKeywords,
		authors: [{ name: siteConfig.name }],
		creator: siteConfig.name,
		publisher: siteConfig.name,
		robots: noIndex
			? {
					index: false,
					follow: false,
			  }
			: {
					index: true,
					follow: true,
					googleBot: {
						index: true,
						follow: true,
						"max-video-preview": -1,
						"max-image-preview": "large",
						"max-snippet": -1,
					},
			  },
		openGraph: {
			type: "website",
			locale: "en_US",
			url: canonical || siteConfig.url,
			title: metaTitle,
			description: metaDescription,
			siteName: siteConfig.name,
			images: [
				{
					url: metaImage,
					width: 1200,
					height: 630,
					alt: metaTitle,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: metaTitle,
			description: metaDescription,
			images: [metaImage],
			creator: "@interviewfuel",
		},
		alternates: {
			canonical: canonical || siteConfig.url,
		},
		verification: {
			google: "your-google-verification-code",
			// yandex: "your-yandex-verification-code",
			// yahoo: "your-yahoo-verification-code",
		},
	};
}

// JSON-LD Schema generators
export function generateOrganizationSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: siteConfig.name,
		url: siteConfig.url,
		logo: `${siteConfig.url}/logo.png`,
		description: siteConfig.description,
		sameAs: [siteConfig.links.twitter, siteConfig.links.github],
	};
}

export function generateWebsiteSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteConfig.name,
		url: siteConfig.url,
		description: siteConfig.description,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};
}

export function generateBreadcrumbSchema(
	items: { name: string; url: string }[]
) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: `${siteConfig.url}${item.url}`,
		})),
	};
}

export function generateQuestionSchema(question: {
	title: string;
	content: string;
	category: string;
	difficulty: string;
	tags: string[];
	author: string;
	datePublished: string;
	dateModified?: string;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "Question",
		name: question.title,
		text: question.content,
		dateCreated: question.datePublished,
		dateModified: question.dateModified || question.datePublished,
		author: {
			"@type": "Person",
			name: question.author,
		},
		keywords: question.tags.join(", "),
		about: {
			"@type": "Thing",
			name: question.category,
		},
	};
}

export function generateFAQSchema(
	faqs: { question: string; answer: string }[]
) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}

export function generateCourseSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "Course",
		name: "Technical Interview Preparation",
		description: siteConfig.description,
		provider: {
			"@type": "Organization",
			name: siteConfig.name,
			sameAs: siteConfig.url,
		},
		educationalLevel: "Intermediate to Advanced",
		about: [
			"Software Engineering",
			"Data Structures",
			"Algorithms",
			"System Design",
		],
	};
}
