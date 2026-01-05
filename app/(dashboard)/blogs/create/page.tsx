"use client";

import { AuthGuard } from "@/components/common";
import CreateBlogScreen from "@/components/screens/blogs/CreateBlogScreen";

export default function CreateBlogPage() {
	return (
		<AuthGuard redirectMessage="Sign in to create a blog post">
			<CreateBlogScreen />
		</AuthGuard>
	);
}
