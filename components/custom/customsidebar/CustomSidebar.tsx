"use client";

import { AppNavbar } from "@/components/custom/navbar/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { categoryService } from "@/services/category/categories-services";
import {
	AxiosErrorResponseType,
	AxiosResponseTypeWithPagination,
} from "@/types/axios-response";
import { GetCategoriesResponseType } from "@/types/interfaces/category/category-type";
import { AxiosError } from "axios";
import {
	Brain,
	ChevronDown,
	ChevronRight,
	Database,
	Globe,
	Smartphone,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";

type Props = {
	children: ReactNode;
};

export const CustomSidebar: React.FC<Props> = ({ children }) => {
	const [open, setOpen] = useState(false);
	const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
	const [mounted, setMounted] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);

	const { data } = useQuery<
		AxiosResponseTypeWithPagination<GetCategoriesResponseType[]>,
		AxiosError<AxiosErrorResponseType>
	>(["allcategories"], () => categoryService.getAllCategories(), {
		staleTime: 1000 * 60 * 5,
		cacheTime: 1000 * 60 * 10,
		keepPreviousData: true,
	});

	const categories = data?.data.results || [];
	const toggleCategory = (categoryName: string) => {
		setExpandedCategories((prev) =>
			prev.includes(categoryName)
				? prev.filter((name) => name !== categoryName)
				: [...prev, categoryName]
		);
	};

	const isCategoryExpanded = (categoryName: string) =>
		expandedCategories.includes(categoryName);

	if (!mounted) return null; // Prevent SSR/CSR mismatch

	return (
		<div className="h-screen flex flex-col w-full">
			<AppNavbar />
			<div
				className={cn(
					"mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800"
				)}>
				<Sidebar open={open} setOpen={setOpen}>
					<SidebarBody className="justify-between gap-4">
						<div className="mt-6 space-y-2">
							{categories.map((category) => (
								<div key={category._id}>
									<Button
										variant="ghost"
										onClick={() =>
											category.subcategories.length > 0
												? toggleCategory(category.slug)
												: router.push(`/questions/${category.slug}`)
										}
										className="w-full justify-start h-10 px-2 hover:bg-gray-100 dark:hover:bg-gray-800">
										<div className="flex items-center justify-between w-full">
											<div className="flex items-center gap-2">
												{/* Custom icon handling */}
												{getCategoryIcon(category.icon)}
												{open && (
													<span className="text-sm font-medium truncate">
														{category.name}
													</span>
												)}
											</div>
											{open &&
												(category.subcategories.length > 0 ? (
													isCategoryExpanded(category.slug) ? (
														<ChevronDown className="h-4 w-4" />
													) : (
														<ChevronRight className="h-4 w-4" />
													)
												) : (
													<Badge
														variant="secondary"
														className="text-[10px] px-1 py-0.5 bg-gray-100 dark:bg-gray-800">
														{category.stats.questionCount}
													</Badge>
												))}
										</div>
									</Button>

									{/* Subcategories shown only if expanded */}
									{open &&
										isCategoryExpanded(category.slug) &&
										category.subcategories.length > 0 && (
											<div className="ml-6 mt-2 space-y-1">
												{category.subcategories.map((sub) => (
													<Button
														key={sub._id}
														variant="ghost"
														onClick={() =>
															router.push(`/questions/${sub.slug}`)
														}
														className="w-full justify-start h-8 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-left">
														<div className="flex items-center justify-between w-full">
															<span>{sub.name}</span>
															<Badge
																variant="secondary"
																className="text-[9px] px-1 py-0.5 bg-gray-100 dark:bg-gray-800">
																{sub.stats?.questionCount ?? 0}
															</Badge>
														</div>
													</Button>
												))}
											</div>
										)}
								</div>
							))}
						</div>

						{/* User Profile at Bottom */}
						<div className="border-t border-gray-200 dark:border-gray-700 pt-3">
							<SidebarLink
								link={{
									href: "/profile",
									icon: (
										<div className="flex items-center gap-2 w-full cursor-pointer">
											<Avatar className="h-8 w-8 ring-2 ring-green-500/20">
												<AvatarImage
													src="https://github.com/shadcn.png"
													alt="User"
												/>
												<AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-xs font-semibold">
													AS
												</AvatarFallback>
											</Avatar>
											{open && (
												<div className="flex flex-col">
													<span className="text-xs font-medium text-gray-900 dark:text-gray-100">
														Abhishek Singh
													</span>
													<span className="text-[10px] text-gray-500 dark:text-gray-400">
														Premium User
													</span>
												</div>
											)}
										</div>
									),
								}}
							/>
						</div>
					</SidebarBody>
				</Sidebar>

				{/* Main Content */}
				<div className="w-full overflow-y-scroll">{children}</div>
			</div>
		</div>
	);
};

// Icon mapping function
const getCategoryIcon = (category: string) => {
	switch (category) {
		case "Frontend":
			return <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
		case "Backend":
			return (
				<Database className="h-4 w-4 text-purple-600 dark:text-purple-400" />
			);
		case "Mobile":
			return (
				<Smartphone className="h-4 w-4 text-green-600 dark:text-green-400" />
			);
		case "Data Science":
			return (
				<TrendingUp className="h-4 w-4 text-pink-600 dark:text-pink-400" />
			);
		case "System Design":
			return <Brain className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
		default:
			return null;
	}
};

export const LogoIcon = ({ open, setOpen }: any) => {
	return (
		<Link
			href="/questions"
			className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
			<div
				onClick={() => setOpen(!open)}
				className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-green-500 dark:bg-white"
			/>
			{open && <h1 className="font-bold text-lg">Interview Fuel</h1>}
		</Link>
	);
};
