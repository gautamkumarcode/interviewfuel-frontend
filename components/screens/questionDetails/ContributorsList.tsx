"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface Contributor {
	user: {
		_id: string;
		name: string;
		username?: string;
		avatar?: string;
	};
	contribution: string;
	contributedAt: string;
}

interface ContributorsListProps {
	contributors: Contributor[];
	author: {
		_id: string;
		name: string;
		username?: string;
		avatar?: string;
	};
}

export function ContributorsList({ contributors, author }: ContributorsListProps) {
	if (!contributors || contributors.length === 0) {
		return null;
	}

	return (
		<Card className="p-6 border-0 shadow-md mb-6">
			<div className="flex items-center gap-2 mb-4">
				<Users className="h-5 w-5 text-purple-600" />
				<h3 className="text-lg font-semibold text-gray-900">Contributors</h3>
				<Badge variant="secondary" className="ml-auto">
					{contributors.length + 1} {contributors.length === 0 ? "contributor" : "contributors"}
				</Badge>
			</div>

			<div className="space-y-3">
				{/* Author */}
				<div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
					<Avatar className="h-10 w-10">
						<AvatarFallback className="bg-blue-600 text-white">
							{author.name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<p className="font-semibold text-gray-900">{author.name}</p>
							<Badge className="bg-blue-600 text-white text-xs">Author</Badge>
						</div>
						<p className="text-sm text-gray-600">Created this question</p>
					</div>
				</div>

				{/* Contributors */}
				{contributors.map((contributor, index) => (
					<div
						key={index}
						className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
						<Avatar className="h-10 w-10">
							<AvatarFallback className="bg-purple-600 text-white">
								{contributor.user.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<p className="font-medium text-gray-900">{contributor.user.name}</p>
							<p className="text-sm text-gray-600">{contributor.contribution}</p>
						</div>
						<p className="text-xs text-gray-500">
							{new Date(contributor.contributedAt).toLocaleDateString()}
						</p>
					</div>
				))}
			</div>
		</Card>
	);
}
