"use client";
import { Toggle } from "@/components/ui/toggle";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { generateJSON } from "@tiptap/html";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	AlignCenter,
	AlignLeft,
	Bold,
	Code,
	Heading1,
	Heading2,
	Heading3,
	Italic,
	Link as LinkIcon,
	List,
	ListOrdered,
	Pilcrow,
	Quote,
	Redo,
	Undo,
} from "lucide-react";

interface RichTextEditorProps {
	content: string;
	onChange: (html: string) => void;
	className?: string;
	placeholder?: string;
	minHeight?: string;
}

export const RichTextEditor = ({
	content,
	onChange,
	className,
	placeholder = "Start typing...",
	minHeight = "200px",
}: RichTextEditorProps) => {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
				bulletList: {
					keepMarks: true,
					keepAttributes: false,
				},
			}),
			Link.configure({
				openOnClick: false,
			}),
			Placeholder.configure({
				placeholder: placeholder,
			}),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
		],
		content: content ? generateJSON(content, [StarterKit]) : undefined,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) return null;

	return (
		<div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
			{/* Toolbar */}
			<div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 flex-wrap">
				{/* Headings & Paragraph */}
				<div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
					<Toggle
						size="sm"
						pressed={editor.isActive("heading", { level: 1 })}
						onPressedChange={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
						title="Heading 1">
						<Heading1 className="h-4 w-4" />
					</Toggle>
					<Toggle
						size="sm"
						pressed={editor.isActive("heading", { level: 2 })}
						onPressedChange={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
						title="Heading 2">
						<Heading2 className="h-4 w-4" />
					</Toggle>
					<Toggle
						size="sm"
						pressed={editor.isActive("heading", { level: 3 })}
						onPressedChange={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
						title="Heading 3">
						<Heading3 className="h-4 w-4" />
					</Toggle>
					<Toggle
						size="sm"
						pressed={editor.isActive("paragraph")}
						onPressedChange={() => editor.chain().focus().setParagraph().run()}
						title="Paragraph">
						<Pilcrow className="h-4 w-4" />
					</Toggle>
				</div>

				{/* Text Formatting */}
				<div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
					<Toggle
						size="sm"
						pressed={editor.isActive("bold")}
						onPressedChange={() => editor.chain().focus().toggleBold().run()}
						title="Bold">
						<Bold className="h-4 w-4" />
					</Toggle>
					<Toggle
						size="sm"
						pressed={editor.isActive("italic")}
						onPressedChange={() => editor.chain().focus().toggleItalic().run()}
						title="Italic">
						<Italic className="h-4 w-4" />
					</Toggle>
					<Toggle
						size="sm"
						pressed={editor.isActive("code")}
						onPressedChange={() => editor.chain().focus().toggleCode().run()}
						title="Inline Code">
						<Code className="h-4 w-4" />
					</Toggle>
				</div>

				{/* Lists & Links */}
				<div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
					<Toggle
						size="sm"
						pressed={editor.isActive("bulletList")}
						onPressedChange={() =>
							editor.chain().focus().toggleBulletList().run()
						}
						title="Bullet List">
						<List className="h-4 w-4" />
					</Toggle>
					<Toggle
						size="sm"
						pressed={editor.isActive("orderedList")}
						onPressedChange={() =>
							editor.chain().focus().toggleOrderedList().run()
						}
						title="Numbered List">
						<ListOrdered className="h-4 w-4" />
					</Toggle>
					<Toggle
						size="sm"
						pressed={editor.isActive("blockquote")}
						onPressedChange={() =>
							editor.chain().focus().toggleBlockquote().run()
						}
						title="Quote">
						<Quote className="h-4 w-4" />
					</Toggle>
					<Toggle
						size="sm"
						pressed={editor.isActive("link")}
						onPressedChange={() => {
							const url = window.prompt("Enter URL");
							if (url) editor.chain().focus().setLink({ href: url }).run();
						}}
						title="Link">
						<LinkIcon className="h-4 w-4" />
					</Toggle>
				</div>

				{/* Alignment */}
				<div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
					<Toggle
						size="sm"
						pressed={editor.isActive({ textAlign: "left" })}
						onPressedChange={() =>
							editor.chain().focus().setTextAlign("left").run()
						}
						title="Align Left">
						<AlignLeft className="h-4 w-4" />
					</Toggle>
					<Toggle
						size="sm"
						pressed={editor.isActive({ textAlign: "center" })}
						onPressedChange={() =>
							editor.chain().focus().setTextAlign("center").run()
						}
						title="Align Center">
						<AlignCenter className="h-4 w-4" />
					</Toggle>
				</div>

				{/* Undo/Redo */}
				<div className="flex gap-1">
					<Toggle
						size="sm"
						pressed={false}
						onPressedChange={() => editor.chain().focus().undo().run()}
						title="Undo">
						<Undo className="h-4 w-4" />
					</Toggle>
					<Toggle
						size="sm"
						pressed={false}
						onPressedChange={() => editor.chain().focus().redo().run()}
						title="Redo">
						<Redo className="h-4 w-4" />
					</Toggle>
				</div>
			</div>

			{/* Editor Content */}
			<div style={{ minHeight }} className="bg-white">
				<EditorContent
					editor={editor}
					className={`rich-content p-4 ${className}`}
				/>
			</div>

			{/* Footer */}
			<div className="bg-gray-50 border-t border-gray-200 px-3 py-1.5 text-xs text-gray-500">
				Rich text editor with formatting support
			</div>
		</div>
	);
};
