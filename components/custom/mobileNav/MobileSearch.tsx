"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, X } from "lucide-react";
import * as React from "react";

interface MobileSearchProps {
	isOpen: boolean;
	onToggle: () => void;
}

export function MobileSearch({ isOpen, onToggle }: MobileSearchProps) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle search submission
		console.log("Search:", searchQuery);
		onToggle(); // Close search after submission
	};

	return (
		<>
			{/* Search Toggle Button */}
			<Button
				variant="ghost"
				size="sm"
				onClick={onToggle}
				className="h-10 w-10 p-0 hover:bg-gray-100 md:hidden"
				aria-label="Search">
				<Search className="h-5 w-5" />
			</Button>

			{/* Mobile Search Overlay */}
			{isOpen && (
				<div className="fixed inset-0 z-50 bg-white md:hidden">
					<div className="flex items-center gap-4 p-4 border-b border-gray-200">
						<Button
							variant="ghost"
							size="sm"
							onClick={onToggle}
							className="h-10 w-10 p-0"
							aria-label="Close search">
							<X className="h-5 w-5" />
						</Button>

						<form
							onSubmit={handleSubmit}
							className="flex-1 flex items-center gap-2">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
								<Input
									ref={inputRef}
									placeholder="Search interview questions..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500"
								/>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-12 px-4 border-gray-200 bg-transparent">
								<Filter className="h-4 w-4" />
							</Button>
						</form>
					</div>

					{/* Search Results/Suggestions */}
					<div className="p-4">
						{searchQuery ? (
							<div className="space-y-2">
								<p className="text-sm text-gray-600">
									Search results for "{searchQuery}"
								</p>
								{/* Add search results here */}
								<div className="text-center py-8 text-gray-500">
									<Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
									<p>Start typing to search questions...</p>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-medium text-gray-900 mb-2">
										Popular Searches
									</h3>
									<div className="flex flex-wrap gap-2">
										{[
											"JavaScript",
											"React Hooks",
											"System Design",
											"Algorithms",
											"SQL",
										].map((term) => (
											<Button
												key={term}
												variant="outline"
												size="sm"
												onClick={() => setSearchQuery(term)}
												className="text-xs">
												{term}
											</Button>
										))}
									</div>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-900 mb-2">
										Recent Searches
									</h3>
									<div className="space-y-1">
										{["React lifecycle", "Database indexing", "API design"].map(
											(term) => (
												<Button
													key={term}
													variant="ghost"
													size="sm"
													onClick={() => setSearchQuery(term)}
													className="w-full justify-start text-sm text-gray-600">
													<Search className="h-4 w-4 mr-2" />
													{term}
												</Button>
											)
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
