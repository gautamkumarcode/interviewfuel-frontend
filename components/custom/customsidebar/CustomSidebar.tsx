"use client";
import { AppNavbar } from "@/components/custom/navbar/Navbar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AvatarFallback } from "@radix-ui/react-avatar";
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
import React, { ReactNode, useState } from "react";
import { techStacks } from "./sidebardata/SideNavData";

type props = {
	children: ReactNode;
};

export const CustomSidebar: React.FC<props> = ({ children }) => {
	const [open, setOpen] = useState(false);
	const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

	const toggleCategory = (categoryName: string) => {
		setExpandedCategories((prev) =>
			prev.includes(categoryName) ? [] : [categoryName]
		);
	};

	const isCategoryExpanded = (categoryName: string) => {
		return expandedCategories.includes(categoryName);
	};

	return (
		<div className="h-screen flex flex-col w-full">
			<AppNavbar />
			<div
				className={cn(
					"mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800"
				)}>
				<Sidebar open={open} setOpen={setOpen} >
					<SidebarBody className="justify-between gap-4 ">
						<div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
							{/* Logo */}
							{<LogoIcon open={open} setOpen={setOpen} />}

							<div className="mt-6 space-y-2 ">
								{/* Frontend Category */}
								<div>
									<Button
										variant="ghost"
										onClick={() => toggleCategory("Frontend")}
										className="w-full justify-start h-10 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
										<div className="flex items-center justify-between w-full ">
											<div className="flex items-center gap-2">
												<Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
												{open && (
													<span className="text-sm font-medium">Frontend</span>
												)}
											</div>
											{open &&
												(isCategoryExpanded("Frontend") ? (
													<ChevronDown className="h-4 w-4" />
												) : (
													<ChevronRight className="h-4 w-4" />
												))}
										</div>
									</Button>

									{/* Frontend Items */}
									{isCategoryExpanded("Frontend") && open && (
										<div className="ml-6 mt-2 space-y-1 ">
											{techStacks[0].items.map((item) => (
												<SidebarLink
													key={item.name}
													link={{
														href: item.href,
														icon: (
															<div className="flex items-center justify-between w-full cursor-pointer">
																<div className="flex items-center gap-2 ">
																	<item.icon
																		className={cn("h-3.5 w-3.5", item.color)}
																	/>
																	<span className="text-xs">{item.name}</span>
																</div>
																<Badge
																	variant="secondary"
																	className="text-[9px] px-1 py-0.5 bg-gray-100 dark:bg-gray-800">
																	{item.count}
																</Badge>
															</div>
														),
													}}
												/>
											))}
										</div>
									)}
								</div>

								{/* Backend Category */}
								<div>
									<Button
										variant="ghost"
										onClick={() => toggleCategory("Backend")}
										className="w-full justify-start h-10 px-2 hover:bg-gray-100 dark:hover:bg-gray-800">
										<div className="flex items-center justify-between w-full cursor-pointer">
											<div className="flex items-center gap-2">
												<Database className="h-4 w-4 text-purple-600 dark:text-purple-400" />
												{open && (
													<span className="text-sm font-medium">Backend</span>
												)}
											</div>
											{open &&
												(isCategoryExpanded("Backend") ? (
													<ChevronDown className="h-4 w-4" />
												) : (
													<ChevronRight className="h-4 w-4" />
												))}
										</div>
									</Button>

									{/* Backend Items */}
									{isCategoryExpanded("Backend") && open && (
										<div className="ml-6 mt-2 space-y-1">
											{techStacks[1].items.map((item) => (
												<SidebarLink
													key={item.name}
													link={{
														href: item.href,
														icon: (
															<div className="flex items-center justify-between w-full cursor-pointer">
																<div className="flex items-center gap-2">
																	<item.icon
																		className={cn("h-3.5 w-3.5", item.color)}
																	/>
																	<span className="text-xs">{item.name}</span>
																</div>
																<Badge
																	variant="secondary"
																	className="text-[9px] px-1 py-0.5 bg-gray-100 dark:bg-gray-800">
																	{item.count}
																</Badge>
															</div>
														),
													}}
												/>
											))}
										</div>
									)}
								</div>

								{/* Mobile Category */}
								<div>
									<Button
										variant="ghost"
										onClick={() => toggleCategory("Mobile")}
										className="w-full justify-start h-10 px-2 hover:bg-gray-100 dark:hover:bg-gray-800">
										<div className="flex items-center justify-between w-full cursor-pointer">
											<div className="flex items-center gap-2">
												<Smartphone className="h-4 w-4 text-green-600 dark:text-green-400" />
												{open && (
													<span className="text-sm font-medium">Mobile</span>
												)}
											</div>
											{open &&
												(isCategoryExpanded("Mobile") ? (
													<ChevronDown className="h-4 w-4" />
												) : (
													<ChevronRight className="h-4 w-4" />
												))}
										</div>
									</Button>

									{/* Mobile Items */}
									{isCategoryExpanded("Mobile") && open && (
										<div className="ml-6 mt-2 space-y-1">
											{techStacks[2].items.map((item) => (
												<SidebarLink
													key={item.name}
													link={{
														href: item.href,
														icon: (
															<div className="flex items-center justify-between w-full cursor-pointer">
																<div className="flex items-center gap-2">
																	<item.icon
																		className={cn("h-3.5 w-3.5", item.color)}
																	/>
																	<span className="text-xs">{item.name}</span>
																</div>
																<Badge
																	variant="secondary"
																	className="text-[9px] px-1 py-0.5 bg-gray-100 dark:bg-gray-800">
																	{item.count}
																</Badge>
															</div>
														),
													}}
												/>
											))}
										</div>
									)}
								</div>

								{/* Data Science Category */}
								<div>
									<Button
										variant="ghost"
										onClick={() => toggleCategory("Data Science")}
										className="w-full justify-start h-10 px-2 hover:bg-gray-100 dark:hover:bg-gray-800">
										<div className="flex items-center justify-between w-full cursor-pointer">
											<div className="flex items-center gap-2">
												<TrendingUp className="h-4 w-4 text-pink-600 dark:text-pink-400" />
												{open && (
													<span className="text-sm font-medium">
														Data Science
													</span>
												)}
											</div>
											{open &&
												(isCategoryExpanded("Data Science") ? (
													<ChevronDown className="h-4 w-4" />
												) : (
													<ChevronRight className="h-4 w-4" />
												))}
										</div>
									</Button>

									{/* Data Science Items */}
									{isCategoryExpanded("Data Science") && open && (
										<div className="ml-6 mt-2 space-y-1">
											{techStacks[3].items.map((item) => (
												<SidebarLink
													key={item.name}
													link={{
														href: item.href,
														icon: (
															<div className="flex items-center justify-between w-full cursor-pointer">
																<div className="flex items-center gap-2">
																	<item.icon
																		className={cn("h-3.5 w-3.5", item.color)}
																	/>
																	<span className="text-xs">{item.name}</span>
																</div>
																<Badge
																	variant="secondary"
																	className="text-[9px] px-1 py-0.5 bg-gray-100 dark:bg-gray-800">
																	{item.count}
																</Badge>
															</div>
														),
													}}
												/>
											))}
										</div>
									)}
								</div>

								{/* System Design Category */}
								<div>
									<Button
										variant="ghost"
										onClick={() => toggleCategory("System Design")}
										className="w-full justify-start h-10 px-2 hover:bg-gray-100 dark:hover:bg-gray-800">
										<div className="flex items-center justify-between w-full cursor-pointer">
											<div className="flex items-center gap-2">
												<Brain className="h-4 w-4 text-orange-600 dark:text-orange-400" />
												{open && (
													<span className="text-sm font-medium">
														System Design
													</span>
												)}
											</div>
											{open &&
												(isCategoryExpanded("System Design") ? (
													<ChevronDown className="h-4 w-4" />
												) : (
													<ChevronRight className="h-4 w-4" />
												))}
										</div>
									</Button>

									{/* System Design Items */}
									{isCategoryExpanded("System Design") && open && (
										<div className="ml-6 mt-2 space-y-1">
											{techStacks[4].items.map((item) => (
												<SidebarLink
													key={item.name}
													link={{
														href: item.href,
														icon: (
															<div className="flex items-center justify-between w-full cursor-pointer">
																<div className="flex items-center gap-2">
																	<item.icon
																		className={cn("h-3.5 w-3.5", item.color)}
																	/>
																	<span className="text-xs">{item.name}</span>
																</div>
																<Badge
																	variant="secondary"
																	className="text-[9px] px-1 py-0.5 bg-gray-100 dark:bg-gray-800">
																	{item.count}
																</Badge>
															</div>
														),
													}}
												/>
											))}
										</div>
									)}
								</div>
							</div>
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
				{/* <Dashboard /> */}
				<div className=" w-full overflow-y-scroll">{children}</div>
			</div>
		</div>
	);
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
			{open && <h1 className="font-bold text-lg"> InterView Fuel</h1>}
		</Link>
	);
};

