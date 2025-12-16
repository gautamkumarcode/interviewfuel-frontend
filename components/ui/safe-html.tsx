"use client";

import type { Config } from "dompurify";
import DOMPurify from "isomorphic-dompurify";

interface SafeHtmlProps {
	html: string;
	className?: string;
	/**
	 * Additional DOMPurify configuration options
	 * @see https://github.com/cure53/DOMPurify#can-i-configure-dompurify
	 */
	sanitizeOptions?: Config;
}

/**
 * SafeHtml Component
 *
 * A secure component for rendering HTML content that automatically sanitizes
 * the input to prevent XSS (Cross-Site Scripting) attacks.
 *
 * @param html - The HTML string to render
 * @param className - Optional CSS classes to apply to the wrapper div
 * @param sanitizeOptions - Optional DOMPurify configuration
 *
 * @example
 * ```tsx
 * <SafeHtml
 *   html={userGeneratedContent}
 *   className="prose dark:prose-invert"
 * />
 * ```
 */
export function SafeHtml({
	html,
	className = "",
	sanitizeOptions,
}: SafeHtmlProps) {
	if (!html) return null;

	// Sanitize the HTML content using DOMPurify
	const sanitizedHtml = DOMPurify.sanitize(html, {
		// Default safe options
		ALLOWED_TAGS: [
			"p",
			"br",
			"strong",
			"em",
			"u",
			"s",
			"a",
			"ul",
			"ol",
			"li",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"blockquote",
			"code",
			"pre",
			"div",
			"span",
			"table",
			"thead",
			"tbody",
			"tr",
			"th",
			"td",
			"img",
			"hr",
			"dl",
			"dt",
			"dd",
			"sup",
			"sub",
		],
		ALLOWED_ATTR: [
			"href",
			"target",
			"rel",
			"class",
			"id",
			"style",
			"src",
			"alt",
			"title",
			"width",
			"height",
			"align",
			"colspan",
			"rowspan",
		],
		ALLOW_DATA_ATTR: false,
		// Override with custom options if provided
		...sanitizeOptions,
	});

	return (
		<div
			className={className}
			dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
		/>
	);
}
