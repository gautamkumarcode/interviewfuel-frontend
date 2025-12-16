/**
 * JsonLd Component
 *
 * A safe component for rendering JSON-LD structured data in script tags.
 * JSON-LD is used for SEO and should contain only JSON data, not arbitrary HTML.
 *
 * This component validates that the data is valid JSON and safely serializes it.
 *
 * @param data - The JSON-LD data object (will be serialized with JSON.stringify)
 *
 * @example
 * ```tsx
 * <JsonLd data={{
 *   "@context": "https://schema.org",
 *   "@type": "Organization",
 *   name: "InterviewFuel"
 * }} />
 * ```
 */
export function JsonLd({ data }: { data: Record<string, any> }) {
	// Serialize the data to JSON
	// Using JSON.stringify is safe for JSON-LD as it:
	// 1. Only outputs valid JSON (no code execution)
	// 2. Properly escapes special characters
	// 3. Is the standard way to embed JSON-LD
	const jsonString = JSON.stringify(data);

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: jsonString }}
		/>
	);
}
