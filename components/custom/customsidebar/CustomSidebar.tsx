"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useClusterData } from "@/context/clusterData-context";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.png";
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
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import {
	forwardRef,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

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
	const param = useParams();
	const router = useRouter();
	const params = param?.category || "";

	// const params = useSearchParams().get("category");
	const headerRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLDivElement>(null);
	const [bodyMaxHeight, setBodyMaxHeight] = useState("100vh");
	const [minimized, setMinimized] = useState(false);
	const [activeParent, setActiveParent] = useState<string | null>(null);
	const [activeChild, setActiveChild] = useState<string | null>(null);
	const { categoryData } = useClusterData();

	const categories = categoryData!;

	useEffect(() => {
		const getMinimized = sessionStorage.getItem("minimized");
		setMinimized(getMinimized ? JSON.parse(getMinimized) : false);
	}, []);

	useLayoutEffect(() => {
		const headerHeight = headerRef.current?.offsetHeight || 0;
		const footerHeight = footerRef.current?.offsetHeight || 0;
		setBodyMaxHeight(`calc(100vh - ${headerHeight + footerHeight}px)`);
	}, [minimized]);

	// ✅ Set active parent & child from URL param
	useEffect(() => {
		if (!params || !Array.isArray(categories) || categories.length === 0)
			return;

		const decodedParam = decodeURIComponent(params as string).toLowerCase();

		for (const category of categories) {
			const match = category.subcategories.find(
				(sub) => sub.slug.toLowerCase() === decodedParam
			);

			if (match) {
				setActiveParent(category.name);
				setActiveChild(match.name);
				break;
			}
		}
	}, [params, categories]);

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

	return (
		<aside
			ref={ref}
			className={cn(
				"fixed top-0 left-0 bottom-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 shadow-sm",
				minimized ? "w-14 px-2" : "w-72 px-4"
			)}>
			<div ref={headerRef} className="py-2 flex items-center ">
				<Image
					src={logo}
					alt="Logo"
					width={60}
					height={60}
					onClick={() => handleResize()}
				/>
				{!minimized && (
					<h2 className="text-xl font-bold  text-yellow-600 cursor-pointer">
						Interview<span className="text-green-600">Fuel</span>
					</h2>
				)}
				<Button
					size="icon"
					variant="ghost"
					onClick={handleResize}
					className="ml-auto">
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
				{!minimized && (
					<span className="text-sm font-semibold">All Questions</span>
				)}
			</div>

			<div
				className="flex-1 overflow-y-auto scrollbar-hide"
				style={{ maxHeight: bodyMaxHeight }}>
				{!minimized ? (
					<Accordion
						type="single"
						collapsible
						value={activeParent || undefined}
						className="border-none hover:none outline-none"
						onValueChange={(val) => setActiveParent(val)}>
						{categories?.map((category) => (
							<AccordionItem
								key={category._id}
								value={category.name}
								className="border-none outline-none" // ✅ removes bottom border
							>
								<AccordionTrigger
									className={cn(
										"flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 border-none outline-none text-decoration-none hover:text-decoration-none hover:no-underline",
										activeParent === category.name
											? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
											: "hover:bg-gray-100 dark:hover:bg-gray-800"
									)}>
									{getCategoryIcon(category.name)}
									<span className="text-sm font-medium no-underline hover:no-underline">
										{category.name}
									</span>
								</AccordionTrigger>

								<AccordionContent className="pl-8 pr-2 py-2 space-y-1">
									{category?.subcategories?.map((subCategory) => {
										const isActive = activeChild === subCategory.name;

										return (
											<Button
												key={subCategory._id}
												variant="ghost"
												size="sm"
												onClick={() => {
													handleNavigate(`/questions/${subCategory.slug}`);
													setActiveChild(subCategory.name);
													setActiveParent(category.name);
													setMinimized(false);
												}}
												className={cn(
													"w-full justify-start text-left text-sm px-2 py-1 rounded-md transition-colors duration-200 cursor-pointer",
													isActive
														? "bg-green-200 text-green-900 font-semibold dark:bg-green-800 dark:text-green-100"
														: "hover:bg-gray-100 dark:hover:bg-gray-700"
												)}>
												{subCategory.name}
											</Button>
										);
									})}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				) : (
					<div className="flex flex-col gap-3 items-center">
						{categories?.map((item) => (
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
