import { AdminOnly } from "@/components/common/AdminOnly";
import { CreateCategoryPage } from "@/components/screens/categories";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldX } from "lucide-react";

export default function CreateCategory() {
	return (
		<AdminOnly
			fallback={
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<Card className="max-w-md w-full mx-4">
						<CardContent className="p-8 text-center">
							<ShieldX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
							<h2 className="text-xl font-semibold text-gray-900 mb-2">
								Access Denied
							</h2>
							<p className="text-gray-600 mb-4">
								You need administrator privileges to create categories.
							</p>
							<p className="text-sm text-gray-500">
								Please contact your administrator if you believe this is an
								error.
							</p>
						</CardContent>
					</Card>
				</div>
			}>
			<CreateCategoryPage />
		</AdminOnly>
	);
}
