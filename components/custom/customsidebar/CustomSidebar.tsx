"use client";

import { Button } from "@/components/ui/button";
import { useClusterData } from "@/context/clusterData-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.png";
import { CategoryType } from "@/services/categories/category-services";
import {
	BookOpen,
	Brain,
	ChevronDown,
	ChevronLeft,
	ChevronUp,
	Code2,
	Database,
	Globe,
	Search,
	Settings,
	Smartphone,
	TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import {
	forwardRef,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { NavbarSearch } from "../navbar/NavbarSearch";

// Define types based on your data structure

interface CategoryNode extends CategoryType {
	children?: CategoryNode[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCategoryIcon = (categoryName: string, iconName?: string) => {
	const classes = "h-4 w-4";

	// First try to use the category name
	switch (categoryName) {
		case "Frontend":
			return <Globe className={classes + " text-blue-500"} />;
		case "Backend":
			return <Database className={classes + " text-purple-500"} />;
		case "Mobile":
			return <Smartphone className={classes + " text-green-500"} />;
		case "Data Science":
			return <TrendingUp className={classes + " text-pink-500"} />;
		case "System Design":
			return <Brain className={classes + " text-orange-500"} />;
		case "DevOps":
			return <Settings className={classes + " text-red-500"} />;
		case "Programming":
			return <Code2 className={classes + " text-indigo-500"} />;
		case "Angular":
			return <Globe className={classes} style={{ color: "#DD0031" }} />;
		case "Express":
			return <Code2 className={classes} style={{ color: "#000000" }} />;
		case "Node.js":
			return <Database className={classes} style={{ color: "#68A063" }} />;
		case "React":
			return <Globe className={classes} style={{ color: "#61DAFB" }} />;
		case "React Hooks":
			return <Code2 className={classes} style={{ color: "#61DAFB" }} />;
		case "React Router":
			return <Globe className={classes} style={{ color: "#61DAFB" }} />;
		default:
			return <BookOpen className={classes + " text-gray-400"} />;
	}
};

// Function to build hierarchical category tree
const buildCategoryTree = (categories: CategoryType[]): CategoryNode[] => {
	const categoryMap = new Map<string, CategoryNode>();
	const roots: CategoryNode[] = [];

	// First pass: create all nodes
	categories.forEach((category) => {
		categoryMap.set(category._id, { ...category, children: [] });
	});

	// Second pass: build the tree
	categories.forEach((category) => {
		const node = categoryMap.get(category._id);
		if (category.parentCategory && categoryMap.has(category.parentCategory)) {
			const parent = categoryMap.get(category.parentCategory);
			if (parent) {
				parent.children = parent.children || [];
				parent.children.push(node!);
				// Sort children by order or name
				parent.children.sort(
					(a, b) => a.order - b.order || a.name.localeCompare(b.name)
				);
			}
		} else {
			roots.push(node!);
		}
	});

	// Sort roots by order or name
	return roots.sort(
		(a, b) => a.order - b.order || a.name.localeCompare(b.name)
	);
};

const Sidebar = forwardRef<HTMLDivElement>((_props, ref) => {
	const param = useParams();
	const router = useRouter();
	const searchParams = useSearchParams();
	const params = param?.category || "";
	const categoryQueryParam = searchParams.get("category");
	const isMobile = useIsMobile();

	const headerRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLDivElement>(null);
	const [bodyMaxHeight, setBodyMaxHeight] = useState("100vh");
	const [minimized, setMinimized] = useState(false);
	const [activeParent, setActiveParent] = useState<string | null>(null);
	const [activeChild, setActiveChild] = useState<string | null>(null);
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
	const { categoryData, categoryLoading } = useClusterData();

	// On mobile, "minimized" means hidden, but we still want to show full content when open
	const isContentCollapsed = isMobile ? false : minimized;

	// Build category tree from flat data
	const categoryTree = useMemo(
		() =>
			categoryData
				? buildCategoryTree(
						categoryData.map((cat) => ({
							...cat,
							createdAt: cat.createdAt,
							updatedAt: cat.updatedAt,
							__v: (cat as any).__v ?? 0,
						}))
				  )
				: [],
		[categoryData]
	);

	useEffect(() => {
		// On mobile, always start with sidebar hidden (minimized = true)
		// On desktop, check sessionStorage for saved preference
		if (isMobile !== undefined) {
			if (isMobile) {
				// Always start minimized on mobile
				setMinimized(true);
				sessionStorage.setItem("minimized", "true");
			} else {
				// On desktop, use saved preference or default to false
				const getMinimized = sessionStorage.getItem("minimized");
				setMinimized(getMinimized !== null ? JSON.parse(getMinimized) : false);
			}
		}
	}, [isMobile]);

	// Listen for sidebar toggle events
	useEffect(() => {
		const handleSidebarToggle = (e: CustomEvent) => {
			setMinimized(e.detail.minimized);
		};

		window.addEventListener(
			"sidebarToggle",
			handleSidebarToggle as EventListener
		);

		return () => {
			window.removeEventListener(
				"sidebarToggle",
				handleSidebarToggle as EventListener
			);
		};
	}, []);

	useLayoutEffect(() => {
		const headerHeight = headerRef.current?.offsetHeight || 0;
		const footerHeight = footerRef.current?.offsetHeight || 0;
		setBodyMaxHeight(`calc(100vh - ${headerHeight + footerHeight}px)`);
	}, [minimized]);

	// Toggle accordion item expansion
	const toggleExpandedItem = (id: string) => {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		setExpandedItems(newExpanded);
	};

	// ✅ Set active parent & child from URL param
	useEffect(() => {
		if (!Array.isArray(categoryTree) || categoryTree.length === 0) return;

		// Check if we're on /questions route with category query parameter
		const currentPath = window.location.pathname;

		// Reset active states first
		setActiveParent(null);
		setActiveChild(null);

		// Function to search for category in tree
		const findCategoryInTree = (
			nodes: CategoryNode[],
			slug: string
		): CategoryNode | null => {
			for (const node of nodes) {
				if (node.slug.toLowerCase() === slug) {
					return node;
				}
				if (node.children && node.children.length > 0) {
					const found = findCategoryInTree(node.children, slug);
					if (found) return found;
				}
			}
			return null;
		};

		// Function to find parent of a category
		const findParent = (
			nodes: CategoryNode[],
			childId: string
		): CategoryNode | null => {
			for (const node of nodes) {
				if (node.children && node.children.length > 0) {
					for (const child of node.children) {
						if (child._id === childId) {
							return node;
						}
					}
					const found = findParent(node.children, childId);
					if (found) return found;
				}
			}
			return null;
		};

		if (currentPath === "/questions" && categoryQueryParam) {
			// Handle /questions?category=some-category
			const decodedParam = decodeURIComponent(categoryQueryParam).toLowerCase();

			const foundCategory = findCategoryInTree(categoryTree, decodedParam);
			if (foundCategory) {
				if (!foundCategory.parentCategory) {
					// It's a parent category - set it active and expand to show children
					setActiveParent(foundCategory.name);
					setActiveChild(null); // Clear child selection
					// Always expand parent to show its children
					setExpandedItems((prev) => {
						const newSet = new Set(prev);
						newSet.add(foundCategory._id);
						return newSet;
					});
				} else {
					// It's a child category - set parent active and this child active
					const parent = findParent(categoryTree, foundCategory._id);
					if (parent) {
						setActiveParent(parent.name);
						setActiveChild(foundCategory.name);
						// Expand the parent category to show children
						setExpandedItems((prev) => {
							const newSet = new Set(prev);
							newSet.add(parent._id);
							return newSet;
						});
					}
				}
			}
		} else if (params) {
			// Handle /questions/[category] route (subcategory slug in path)
			const decodedParam = decodeURIComponent(params as string).toLowerCase();

			const foundCategory = findCategoryInTree(categoryTree, decodedParam);
			if (foundCategory) {
				// Check if it's a parent category or a child category
				if (!foundCategory.parentCategory) {
					setActiveParent(foundCategory.name);
					setActiveChild(null);
					// Always expand parent to show its children
					setExpandedItems((prev) => {
						const newSet = new Set(prev);
						newSet.add(foundCategory._id);
						return newSet;
					});
				} else {
					const parent = findParent(categoryTree, foundCategory._id);
					if (parent) {
						setActiveParent(parent.name);
						setActiveChild(foundCategory.name);
						// Expand the parent category to show children
						setExpandedItems((prev) => {
							const newSet = new Set(prev);
							newSet.add(parent._id);
							return newSet;
						});
					}
				}
			}
		}
	}, [categoryTree, params, categoryQueryParam]);

	const handleResize = () => {
		const newVal = !minimized;

		// Dispatch custom event BEFORE state change for instant response
		window.dispatchEvent(
			new CustomEvent("sidebarToggle", {
				detail: { minimized: newVal, width: newVal ? 56 : 288 },
			})
		);

		setMinimized(newVal);
		sessionStorage.setItem("minimized", JSON.stringify(newVal));
	};

	const handleNavigate = (link: string) => {
		if (window.location.pathname !== link) {
			router.push(link);
		}
	};

	// Recursive component for rendering category tree
	const renderCategoryTree = (categories: CategoryNode[], level = 0) => {
		return categories.map((category) => {
			const isExpanded = expandedItems.has(category._id);
			const hasChildren = category.children && category.children.length > 0;
			const isParentActive = activeParent === category.name;

			return (
				<div key={category._id} className={cn("relative", level > 0 && "ml-2")}>
					{/* Category header - enhanced dropdown trigger */}
					<div
						className={cn(
							"group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden",
							// Active state styling
							isParentActive
								? "bg-gradient-to-r from-green-100 to-emerald-50 text-green-800 shadow-sm border border-green-200 dark:from-green-900/50 dark:to-emerald-900/30 dark:text-green-300 dark:border-green-700"
								: "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50",
							// Add subtle shadow for depth
							level === 0 && "shadow-sm hover:shadow-md",
							// Border styling
							"border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
						)}
						onClick={(e) => {
							e.stopPropagation();
							if (hasChildren) {
								toggleExpandedItem(category._id);
								handleNavigate(`/questions?category=${category.slug}`);
								setActiveParent(category.name);
								setActiveChild(null);
							} else {
								handleNavigate(`/questions?category=${category.slug}`);
								setActiveParent(category.name);
								setActiveChild(null);
							}
						}}>
						{/* Expand/Collapse Icon */}
						{hasChildren ? (
							<div
								className={cn(
									"flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-200",
									isExpanded
										? "bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-300"
										: "bg-gray-100 text-gray-600 group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700"
								)}>
								{isExpanded ? (
									<ChevronUp className="h-3.5 w-3.5 transition-transform duration-200" />
								) : (
									<ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
								)}
							</div>
						) : (
							<div className="w-6 h-6 flex items-center justify-center">
								<div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
							</div>
						)}

						{/* Category Icon */}
						<div
							className={cn(
								"flex items-center justify-center w-6 h-6 md:h-8 md:w-8 rounded-lg transition-all duration-200",
								isParentActive
									? "bg-white/80 shadow-sm"
									: "bg-gray-50 group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700"
							)}>
							{getCategoryIcon(category.name, category.icon)}
						</div>

						{/* Category Name */}
						<div className="flex-1 min-w-0">
							<span
								className={cn(
									"text-sm font-medium transition-colors duration-200 block truncate",
									isParentActive
										? "text-green-800 dark:text-green-300"
										: "text-gray-700 dark:text-gray-300"
								)}>
								{category.name}
							</span>
							{level === 0 && (
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{category.stats.questionCount} questions
								</span>
							)}
						</div>

						{/* Question Count Badge */}
						<div
							className={cn(
								"flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-medium transition-all duration-200",
								isParentActive
									? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
									: "bg-gray-100 text-gray-600 group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700"
							)}>
							{category.stats.questionCount}
						</div>

						{/* Active indicator line */}
						{isParentActive && (
							<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-r-full"></div>
						)}
					</div>

					{/* Enhanced Child categories dropdown */}
					{isExpanded && hasChildren && (
						<div className="mt-2 ml-4 relative">
							{/* Connection line */}
							<div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-green-200 via-gray-200 to-transparent dark:from-green-800 dark:via-gray-700"></div>

							<div className="space-y-1 pl-4">
								{/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
								{category.children!.map((child, index) => {
									const isChildActive = activeChild === child.name;
									// const isLastChild = index === category.children!.length - 1;

									return (
										<div key={child._id} className="relative">
											{/* Connection dot */}
											<div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-900"></div>

											{child.children && child.children.length > 0 ? (
												// Child has its own children - render recursively
												renderCategoryTree([child], level + 1)
											) : (
												// Enhanced leaf node styling
												<div
													onClick={() => {
														handleNavigate(`/questions?category=${child.slug}`);
														setActiveChild(child.name);
														setActiveParent(category.name);
													}}
													className={cn(
														"group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 relative",
														isChildActive
															? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 shadow-sm border border-green-200 dark:from-green-900/30 dark:to-emerald-900/20 dark:text-green-300 dark:border-green-700"
															: "hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800/30 dark:hover:to-blue-900/20 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
													)}>
													{/* Child icon */}
													<div
														className={cn(
															"flex items-center justify-center w-6 h-6 rounded-md transition-all duration-200",
															isChildActive
																? "bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-300"
																: "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-blue-900/50 dark:group-hover:text-blue-400"
														)}>
														{getCategoryIcon(child.name, child.icon)}
													</div>

													{/* Child name */}
													<span
														className={cn(
															"text-sm font-medium flex-1 transition-colors duration-200",
															isChildActive
																? "text-green-800 dark:text-green-300"
																: "text-gray-600 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200"
														)}>
														{child.name}
													</span>

													{/* Child question count */}
													<div
														className={cn(
															"flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium transition-all duration-200",
															isChildActive
																? "bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-200"
																: "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-blue-900/50 dark:group-hover:text-blue-400"
														)}>
														{child.stats.questionCount}
													</div>

													{/* Active indicator */}
													{isChildActive && (
														<div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-r-full"></div>
													)}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			);
		});
	};

	return (
		<aside
			ref={ref}
			className={cn(
				"fixed top-0 bottom-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm",
				// Mobile: higher z-index and slide from left, Desktop: normal positioning
				isMobile
					? "z-[1001] left-0 transition-transform duration-300 ease-in-out"
					: "left-0 transition-all duration-300",
				// Width and padding based on minimized state
				minimized
					? isMobile
						? "-translate-x-full w-72 px-4" // Hidden on mobile when minimized
						: "w-14 px-2" // Small width on desktop when minimized
					: "w-72 px-4 translate-x-0" // Full width when expanded
			)}>
			<div ref={headerRef} className="pt-4 lg:pt-2">
				{/* Logo and Title */}
				<div className="flex items-center mb-4">
					<Image
						src={logo}
						alt="Logo"
						width={60}
						height={60}
						onClick={isMobile ? undefined : () => handleResize()}
						className={isMobile ? "cursor-default" : "cursor-pointer"}
					/>
					{!isContentCollapsed && (
						<h2 className="text-xl font-bold  text-yellow-600 cursor-pointer">
							Interview<span className="text-green-600">Fuel</span>
						</h2>
					)}
					<Button
						size="icon"
						variant="ghost"
						onClick={handleResize}
						className="ml-auto hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2">
						<ChevronLeft
							className={cn(
								"h-4 w-4 transition-transform text-gray-600 dark:text-gray-400",
								isContentCollapsed && "rotate-180"
							)}
						/>
					</Button>
				</div>

				{/* Search Box - Only show when sidebar is expanded */}
				{!isContentCollapsed && (
					<div className="mb-4 lg:hidden">
						<NavbarSearch />
					</div>
				)}

				{/* Search Icon - Only show when sidebar is collapsed */}
				{isContentCollapsed && (
					<div className="mb-4 flex justify-center lg:hidden">
						<Button
							size="icon"
							variant="ghost"
							onClick={handleResize}
							className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2"
							title="Expand to search">
							<Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
						</Button>
					</div>
				)}
			</div>

			<div
				className="flex-1 overflow-y-auto scrollbar-hide"
				style={{ maxHeight: bodyMaxHeight }}>
				{!isContentCollapsed ? (
					<div className="space-y-1">
						{categoryLoading
							? Array.from({ length: 5 }).map((_, index) => (
									<div
										key={index}
										className="flex items-center gap-3 p-2 rounded-md animate-pulse">
										<div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
										<div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
									</div>
							  ))
							: renderCategoryTree(categoryTree)}
					</div>
				) : (
					<div className="flex flex-col gap-2 items-center py-2">
						{categoryLoading
							? Array.from({ length: 5 }).map((_, index) => (
									<div
										key={index}
										className="h-8 w-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-md animate-pulse shadow-sm"></div>
							  ))
							: categoryTree.map((item) => {
									const isActive = activeParent === item.name;
									return (
										<div
											key={item._id}
											className={cn(
												"flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md",
												isActive
													? "bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 shadow-md border border-green-200 dark:from-green-900/50 dark:to-emerald-900/30 dark:text-green-300 dark:border-green-700"
													: "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:from-gray-100 hover:to-gray-200 dark:from-gray-800 dark:to-gray-700 dark:text-gray-400 dark:hover:from-gray-700 dark:hover:to-gray-600 border border-gray-200 dark:border-gray-700"
											)}
											onClick={() => {
												handleNavigate(`/questions?category=${item.slug}`);
												setActiveParent(item.name);
												setActiveChild(null);

												// Dispatch custom event BEFORE state change for instant response
												window.dispatchEvent(
													new CustomEvent("sidebarToggle", {
														detail: { minimized: false, width: 288 },
													})
												);

												setMinimized(false);
												sessionStorage.setItem(
													"minimized",
													JSON.stringify(false)
												);
											}}>
											{getCategoryIcon(item.name, item.icon)}
										</div>
									);
							  })}
					</div>
				)}
			</div>

			<div ref={footerRef} className="py-4 space-y-3">
				{/* <div
					className={cn(
						"flex items-center gap-2 cursor-pointer",
						isContentCollapsed && "justify-center"
					)}
					onClick={() => handleNavigate("/help-center")}>
					<MessageCircleQuestion className="h-4 w-4" />
					{!isContentCollapsed && <span className="text-xs">Help Center</span>}
				</div>
				<div
					className={cn(
						"flex items-center gap-2 cursor-pointer",
						isContentCollapsed && "justify-center"
					)}
					onClick={() => handleNavigate("/settings")}>
					<Settings className="h-4 w-4" />
					{!isContentCollapsed && <span className="text-xs">Settings</span>}
				</div> */}
			</div>
		</aside>
	);
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
