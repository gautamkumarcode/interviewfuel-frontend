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
		// Core interview keywords
		"interview questions",
		"interview preparation",
		"coding interview questions",
		"technical interview questions",
		"programming interview questions",
		"software engineer interview questions",
		"developer interview questions",

		// Interview types
		"coding interview",
		"technical interview",
		"mock interview",
		"behavioral interview questions",
		"system design interview",
		"system design questions",

		// Practice & preparation
		"coding practice",
		"interview practice",
		"leetcode alternative",
		"hackerrank alternative",
		"coding challenges",
		"practice coding problems",

		// Technical topics
		"data structures interview questions",
		"algorithms interview questions",
		"javascript interview questions",
		"react interview questions",
		"python interview questions",
		"java interview questions",
		"node.js interview questions",
		"sql interview questions",
		"database interview questions",
		"api interview questions",
		"frontend interview questions",
		"backend interview questions",
		"full stack interview questions",

		// Company-specific
		"FAANG interview questions",
		"Google interview questions",
		"Amazon interview questions",
		"Microsoft interview questions",
		"Meta interview questions",
		"Apple interview questions",

		// Career & job search
		"software engineering interview",
		"job interview preparation",
		"tech interview prep",
		"get hired as developer",
		"crack coding interview",
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
			google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
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

export function generateArticleSchema(article: {
	title: string;
	description: string;
	author?: string;
	datePublished: string;
	dateModified?: string;
	image?: string;
	category?: string;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.title,
		description: article.description,
		image: article.image || siteConfig.ogImage,
		datePublished: article.datePublished,
		dateModified: article.dateModified || article.datePublished,
		author: {
			"@type": "Person",
			name: article.author || siteConfig.name,
		},
		publisher: {
			"@type": "Organization",
			name: siteConfig.name,
			logo: {
				"@type": "ImageObject",
				url: `${siteConfig.url}/logo.png`,
			},
		},
		articleSection: article.category || "Interview Questions",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": siteConfig.url,
		},
	};
}

export function generateItemListSchema(
	items: {
		name: string;
		url: string;
		description?: string;
	}[]
) {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Thing",
				name: item.name,
				url: item.url,
				description: item.description,
			},
		})),
	};
}
