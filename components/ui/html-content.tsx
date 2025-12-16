"use client";

import { SafeHtml } from "./safe-html";

interface HtmlContentProps {
	content: string;
	className?: string;
}

/**
 * Component to safely render HTML content with fallback for plain text
 * Detects if content is HTML or plain text and renders accordingly
 */
export function HtmlContent({ content, className = "" }: HtmlContentProps) {
	if (!content) return null;

	// Decode HTML entities - handles both single and double encoding
	const decodeHtml = (html: string) => {
		const txt = document.createElement("textarea");
		txt.innerHTML = html;
		let decoded = txt.value;

		// Check if still encoded (double encoding case)
		if (decoded.includes("&lt;") || decoded.includes("&gt;")) {
			txt.innerHTML = decoded;
			decoded = txt.value;
		}

		return decoded;
	};

	// Always try to decode first, then check if it's HTML
	const decodedContent = decodeHtml(content);
	const isHtml = /<[^>]+>/.test(decodedContent);

	if (isHtml) {
		// Render as HTML with rich-content class for proper styling using SafeHtml
		return (
			<SafeHtml html={decodedContent} className={`rich-content ${className}`} />
		);
	}

	// Render as plain text with line breaks preserved
	return (
		<div className={`rich-content ${className}`}>
			{decodedContent.split("\n").map((line, index) => (
				<p key={index} className="text-gray-700 leading-relaxed mb-2 last:mb-0">
					{line || "\u00A0"}
				</p>
			))}
		</div>
	);
}
