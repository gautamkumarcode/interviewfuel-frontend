"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categoryService } from "@/services/category/categories-services";
import type { AxiosResponseTypeWithPagination } from "@/types/axios-response";
import type { GetCategoriesResponseType } from "@/types/interfaces/category/category-type";
import {
	BookOpen,
	Brain,
	ChevronLeft,
	Code2,
	Database,
	Globe,
	MessageCircleQuestion,
	Settings,
	Smartphone,
	TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
	forwardRef,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useQuery } from "react-query";

const getCategoryIcon = (category: string) => {
	const classes = "h-5 w-5";
	switch (category) {
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
		default:
			return <BookOpen className={classes + " text-gray-400"} />;
	}
};

const Sidebar = forwardRef<HTMLDivElement>((_props, ref) => {
	const router = useRouter();
	const headerRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLDivElement>(null);
	const [bodyMaxHeight, setBodyMaxHeight] = useState("100vh");
	const [minimized, setMinimized] = useState(false);
	const [activeParent, setActiveParent] = useState<string | null>(null);
	const [activeChild, setActiveChild] = useState<string | null>(null);

	const { data, isLoading } = useQuery<
		AxiosResponseTypeWithPagination<GetCategoriesResponseType[]>
	>(["allcategories"], () => categoryService.getAllCategories());

	const categories = data?.data?.results || [];

	useEffect(() => {
		const getMinimized = sessionStorage.getItem("minimized");
		setMinimized(getMinimized ? JSON.parse(getMinimized) : false);
	}, []);

	const handleResize = () => {
		const newVal = !minimized;
		setMinimized(newVal);
		sessionStorage.setItem("minimized", JSON.stringify(newVal));
	};

	useLayoutEffect(() => {
		const headerHeight = headerRef.current?.offsetHeight || 0;
		const footerHeight = footerRef.current?.offsetHeight || 0;
		setBodyMaxHeight(`calc(100vh - ${headerHeight + footerHeight}px)`);
	}, [minimized]);

	const handleNavigate = (link: string) => {
		if (window.location.pathname !== link) {
			router.push(link);
		}
	};

	return (
		<aside
			ref={ref}
			className={cn(
				"fixed top-0 left-0 bottom-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 shadow-sm",
				minimized ? "w-14 px-2" : "w-72 px-4"
			)}>
			<div ref={headerRef} className="py-4 flex items-center justify-between">
				{!minimized && (
					<h2 className="text-lg font-bold text-primary">Interview Fuel</h2>
				)}
				<Button size="icon" variant="ghost" onClick={handleResize}>
					<ChevronLeft
						className={cn("transition-transform", minimized && "rotate-180")}
					/>
				</Button>
			</div>

			<div
				onClick={() => {
					handleNavigate("/questions");
					setActiveParent(null);
					setActiveChild(null);
				}}
				className={cn(
					"flex items-center gap-3 bg-green-600 text-white rounded-md p-3 mb-4 cursor-pointer transition",
					minimized && "justify-center p-2"
				)}>
				{/* <Image src={dashboardIcon} alt="dashboard" className="h-5 w-5" /> */}
				{!minimized && (
					<span className="text-sm font-semibold">All Questions</span>
				)}
			</div>

			<div
				className="flex-1 overflow-y-auto scrollbar-hide"
				style={{ maxHeight: bodyMaxHeight }}>
				{!minimized ? (
					<Accordion type="single" collapsible>
						{categories.map((category) => (
							<AccordionItem
								key={category._id}
								value={category.name}
								className="border-none">
								<AccordionTrigger
									onClick={() => {
										handleNavigate(`/questions/${category.slug}`);
										setActiveParent(category.name);
									}}
									className="flex items-start gap-2 text-sm hover:no-underline">
									{getCategoryIcon(category.name)}
									{category.name}
								</AccordionTrigger>
								<AccordionContent className="pl-6 space-y-1">
									{category?.subcategories?.map((subCategory) => (
										<Button
											key={subCategory._id}
											variant="ghost"
											size="sm"
											className={cn(
												"w-full flex items-start",
												activeChild === subCategory.name &&
													"bg-gray-100 dark:bg-gray-800"
											)}
											onClick={() => {
												handleNavigate(`/questions/${subCategory.name}`);
												setActiveChild(subCategory.name);
												setMinimized(false);
											}}>
											{subCategory.name}
										</Button>
									))}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				) : (
					<div className="flex flex-col gap-3 items-center">
						{categories.map((item) => (
							<Button
								key={item._id}
								variant="ghost"
								size="icon"
								onClick={() => {
									setActiveParent(item.name);
									setActiveChild(null);
									setMinimized(false);
								}}>
								{getCategoryIcon(item.name)}
							</Button>
						))}
					</div>
				)}
			</div>

			<div ref={footerRef} className="py-4 space-y-3">
				{/* <ModeSwitch minimize={minimized} /> */}
				<div
					className={cn(
						"flex items-center gap-2 cursor-pointer",
						minimized && "justify-center"
					)}
					onClick={() => handleNavigate("/help-center")}>
					<MessageCircleQuestion className="h-4 w-4" />
					{!minimized && <span className="text-xs">Help Center</span>}
				</div>
				<div
					className={cn(
						"flex items-center gap-2 cursor-pointer",
						minimized && "justify-center"
					)}
					onClick={() => handleNavigate("/settings")}>
					<Settings className="h-4 w-4" />
					{!minimized && <span className="text-xs">Settings</span>}
				</div>
			</div>
		</aside>
	);
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
