"use client";

import { Button } from "@/components/ui/button";
import { useClusterData } from "@/context/clusterData-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.png";
import {
	BookOpen,
	Brain,
	ChevronDown,
	ChevronLeft,
	ChevronUp,
	Code2,
	Database,
	Globe,
	MessageCircleQuestion,
	Settings,
	Smartphone,
	TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import {
	forwardRef,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";

// Define types based on your data structure
interface Category {
	_id: string;
	name: string;
	slug: string;
	description: string;
	icon: string;
	color: string;
	parentCategory: string | null;
	tags: string[];
	stats: {
		questionCount: number;
		totalViews: number;
		averageDifficulty: number;
	};
	isActive: boolean;
	order: number;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

interface CategoryNode extends Category {
	children?: CategoryNode[];
}

const getCategoryIcon = (categoryName: string, iconName?: string) => {
	const classes = "h-5 w-5";

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
const buildCategoryTree = (categories: Category[]): CategoryNode[] => {
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
	const params = param?.category || "";
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
						}))
				  )
				: [],
		[categoryData]
	);

	useEffect(() => {
		const getMinimized = sessionStorage.getItem("minimized");
		// On mobile, start with sidebar minimized (hidden)
		// Only set minimized to true on mobile if no saved preference exists
		if (getMinimized !== null) {
			setMinimized(JSON.parse(getMinimized));
		} else if (isMobile !== undefined) {
			setMinimized(isMobile); // true on mobile, false on desktop
		}
		// Don't do anything if isMobile is still undefined (hydrating)
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
		const urlParams = new URLSearchParams(window.location.search);
		const categoryParam = urlParams.get("category");

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

		if (currentPath === "/questions" && categoryParam) {
			// Handle /questions?category=some-category
			const decodedParam = decodeURIComponent(categoryParam).toLowerCase();

			const foundCategory = findCategoryInTree(categoryTree, decodedParam);
			if (foundCategory) {
				if (!foundCategory.parentCategory) {
					// It's a parent category
					setActiveParent(foundCategory.name);
					// Expand this category
					setExpandedItems((prev) => new Set(prev).add(foundCategory._id));
				} else {
					// It's a child category
					const parent = findParent(categoryTree, foundCategory._id);
					if (parent) {
						setActiveParent(parent.name);
						setActiveChild(foundCategory.name);
						// Expand the parent category
						setExpandedItems((prev) => new Set(prev).add(parent._id));
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
					setExpandedItems((prev) => new Set(prev).add(foundCategory._id));
				} else {
					const parent = findParent(categoryTree, foundCategory._id);
					if (parent) {
						setActiveParent(parent.name);
						setActiveChild(foundCategory.name);
						setExpandedItems((prev) => new Set(prev).add(parent._id));
					}
				}
			}
		}
	}, [categoryTree, params]);

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

			return (
				<div key={category._id} className={level > 0 ? "ml-4" : ""}>
					{/* Category header - acts as accordion trigger */}
					<div
						className={cn(
							"flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
							activeParent === category.name
								? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
								: "hover:bg-gray-100 dark:hover:bg-gray-800"
						)}
						onClick={(e) => {
							e.stopPropagation();
							if (category.children && category.children.length > 0) {
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
						{category.children && category.children.length > 0 && (
							<Button variant="ghost" size="icon" className="h-6 w-6">
								{isExpanded ? (
									<ChevronUp className="h-3 w-3 " />
								) : (
									<ChevronDown className="h-3 w-3" />
								)}
							</Button>
						)}
						{!category.children || category.children.length === 0 ? (
							<div className="w-6" /> // Spacer for items without children
						) : null}
						{getCategoryIcon(category.name, category.icon)}
						<span className="text-sm font-medium">{category.name}</span>
						<span className="ml-auto text-xs text-gray-500">
							{category.stats.questionCount}
						</span>
					</div>

					{/* Child categories */}
					{isExpanded && category.children && category.children.length > 0 && (
						<div className="mt-1 ml-6 border-l border-gray-200 pl-2">
							{category.children.map((child) => {
								const isChildActive = activeChild === child.name;

								return (
									<div key={child._id} className="py-1">
										{child.children && child.children.length > 0 ? (
											// Child has its own children - render recursively
											renderCategoryTree([child], level + 1)
										) : (
											// Child is a leaf node - render as button
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													handleNavigate(`/questions?category=${child.slug}`);
													setActiveChild(child.name);
													setActiveParent(category.name);
												}}
												className={cn(
													"w-full justify-start text-left text-sm px-2 py-1 rounded-md transition-colors duration-200 cursor-pointer",
													isChildActive
														? "bg-green-200 text-green-900 font-semibold dark:bg-green-800 dark:text-green-100"
														: "hover:bg-gray-100 dark:hover:bg-gray-700"
												)}>
												{child.name}
												<span className="ml-auto text-xs text-gray-500">
													{child.stats.questionCount}
												</span>
											</Button>
										)}
									</div>
								);
							})}
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
					? "z-[999] left-0 transition-transform duration-300 ease-in-out"
					: "left-0 transition-all duration-300",
				// Width and padding based on minimized state
				minimized
					? isMobile
						? "-translate-x-full w-72 px-4" // Hidden on mobile when minimized
						: "w-14 px-2" // Small width on desktop when minimized
					: "w-72 px-4 translate-x-0" // Full width when expanded
			)}>
			<div ref={headerRef} className="py-2 flex items-center ">
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
					<div className="flex flex-col gap-3 items-center">
						{categoryLoading
							? Array.from({ length: 5 }).map((_, index) => (
									<div
										key={index}
										className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
							  ))
							: categoryTree.map((item) => (
									<Button
										key={item._id}
										variant="ghost"
										size="icon"
										className={cn(
											activeParent === item.name &&
												"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
										)}
										onClick={() => {
											handleNavigate(`/questions?category=${item.slug}`);
											setActiveParent(item.name);
											setActiveChild(null);
											setMinimized(false);
										}}>
										{getCategoryIcon(item.name, item.icon)}
									</Button>
							  ))}
					</div>
				)}
			</div>

			<div ref={footerRef} className="py-4 space-y-3">
				<div
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
				</div>
			</div>
		</aside>
	);
});

Sidebar.displayName = "Sidebar";
export default Sidebar;