"use client";
import {
	BookOpen,
	Brain,
	Code,
	Database,
	Globe,
	Smartphone,
	TrendingUp,
	X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef } from "react";

const techStacks = [
	{
		category: "Frontend",
		icon: Globe,
		items: [
			{
				name: "JavaScript",
				count: 245,
				color: "bg-yellow-500",
				href: "/questions/javascript",
			},
			{
				name: "React",
				count: 189,
				color: "bg-blue-500",
				href: "/questions/react",
			},
			{
				name: "Vue.js",
				count: 156,
				color: "bg-green-500",
				href: "/questions/vue",
			},
			{
				name: "Angular",
				count: 134,
				color: "bg-red-500",
				href: "/questions/angular",
			},
			{
				name: "HTML/CSS",
				count: 98,
				color: "bg-orange-500",
				href: "/questions/html-css",
			},
			{
				name: "TypeScript",
				count: 167,
				color: "bg-blue-600",
				href: "/questions/typescript",
			},
		],
	},
	{
		category: "Backend",
		icon: Database,
		items: [
			{
				name: "Node.js",
				count: 198,
				color: "bg-green-600",
				href: "/questions/nodejs",
			},
			{
				name: "Python",
				count: 234,
				color: "bg-blue-400",
				href: "/questions/python",
			},
			{
				name: "Java",
				count: 287,
				color: "bg-red-600",
				href: "/questions/java",
			},
			{
				name: "C#",
				count: 145,
				color: "bg-purple-500",
				href: "/questions/csharp",
			},
			{ name: "Go", count: 89, color: "bg-cyan-500", href: "/questions/go" },
			{
				name: "PHP",
				count: 123,
				color: "bg-indigo-500",
				href: "/questions/php",
			},
		],
	},
	{
		category: "Mobile",
		icon: Smartphone,
		items: [
			{
				name: "React Native",
				count: 87,
				color: "bg-blue-500",
				href: "/questions/react-native",
			},
			{
				name: "Flutter",
				count: 92,
				color: "bg-blue-400",
				href: "/questions/flutter",
			},
			{
				name: "iOS (Swift)",
				count: 76,
				color: "bg-gray-700",
				href: "/questions/ios",
			},
			{
				name: "Android (Kotlin)",
				count: 84,
				color: "bg-green-500",
				href: "/questions/android",
			},
		],
	},
	{
		category: "Data Science",
		icon: TrendingUp,
		items: [
			{
				name: "Machine Learning",
				count: 156,
				color: "bg-purple-600",
				href: "/questions/ml",
			},
			{
				name: "Data Analysis",
				count: 134,
				color: "bg-pink-500",
				href: "/questions/data-analysis",
			},
			{
				name: "SQL",
				count: 198,
				color: "bg-orange-600",
				href: "/questions/sql",
			},
			{
				name: "Statistics",
				count: 89,
				color: "bg-teal-500",
				href: "/questions/statistics",
			},
		],
	},
	{
		category: "System Design",
		icon: Brain,
		items: [
			{
				name: "Scalability",
				count: 67,
				color: "bg-gray-600",
				href: "/questions/scalability",
			},
			{
				name: "Microservices",
				count: 54,
				color: "bg-indigo-600",
				href: "/questions/microservices",
			},
			{
				name: "Load Balancing",
				count: 43,
				color: "bg-yellow-600",
				href: "/questions/load-balancing",
			},
			{
				name: "Caching",
				count: 38,
				color: "bg-red-400",
				href: "/questions/caching",
			},
		],
	},
];

const quickActions = [
	{
		name: "Practice Session",
		href: "/practice",
		icon: "🎯",
		color: "bg-green-100 text-green-800",
	},
	{
		name: "Analytics",
		href: "/analytics",
		icon: "📊",
		color: "bg-blue-100 text-blue-800",
	},
	{
		name: "Bookmarks",
		href: "/bookmarks",
		icon: "🔖",
		color: "bg-purple-100 text-purple-800",
	},
	{
		name: "Recent",
		href: "/recent",
		icon: "🕒",
		color: "bg-orange-100 text-orange-800",
	},
];

type Props = {};

export const AppSidebar = forwardRef<HTMLDivElement, Props>((_props, ref) => {
	const router = useRouter();
	const pathname = usePathname();
	const { isMobile, setOpenMobile } = useSidebar();

	const handleNavigation = (href: string) => {
		router.push(href);
		// Close mobile sidebar after navigation
		if (isMobile) {
			setOpenMobile(false);
		}
	};

	const SidebarHeaderComponent = () => (
		<div className="border-b border-gray-200 p-4">
			<div className="flex items-center justify-between">
				<div
					className="flex items-center gap-2 cursor-pointer"
					onClick={() => handleNavigation("/")}>
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
						<Code className="h-4 w-4 text-white" />
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-semibold">InterviewPrep</span>
						<span className="text-xs text-gray-500">Question Bank</span>
					</div>
				</div>

				{/* Mobile close button */}
				{isMobile && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setOpenMobile(false)}
						className="h-8 w-8 p-0 hover:bg-gray-100">
						<X className="h-4 w-4" />
						<span className="sr-only">Close sidebar</span>
					</Button>
				)}
			</div>
		</div>
	);

	return (
		<Sidebar className={cn("border-r border-gray-200", isMobile && "w-80")}>
			<SidebarHeaderComponent />

			<SidebarContent className="p-0">
				<ScrollArea className="flex-1 px-2">
					{/* Quick Actions - Mobile Priority */}
					{isMobile && (
						<>
							<SidebarGroup className="py-4">
								<SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2">
									Quick Actions
								</SidebarGroupLabel>
								<SidebarGroupContent>
									<div className="grid grid-cols-2 gap-2 px-2">
										{quickActions.map((action) => (
											<Button
												key={action.name}
												variant="outline"
												size="sm"
												onClick={() => handleNavigation(action.href)}
												className={cn(
													"h-auto p-3 flex flex-col items-center gap-1 border-gray-200 hover:border-gray-300",
													action.color
												)}>
												<span className="text-lg">{action.icon}</span>
												<span className="text-xs font-medium">
													{action.name}
												</span>
											</Button>
										))}
									</div>
								</SidebarGroupContent>
							</SidebarGroup>
							<Separator className="mx-2" />
						</>
					)}

					{/* All Questions */}
					<SidebarGroup className="py-4">
						<SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2">
							Browse Categories
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="px-2">
								<SidebarMenuItem>
									<SidebarMenuButton
										onClick={() => handleNavigation("/")}
										isActive={pathname === "/"}
										className={cn(
											"w-full justify-between h-10",
											isMobile && "h-12 text-base"
										)}>
										<div className="flex items-center gap-3">
											<BookOpen
												className={cn("h-4 w-4", isMobile && "h-5 w-5")}
											/>
											<span>All Questions</span>
										</div>
										<Badge variant="secondary" className="ml-auto">
											1,247
										</Badge>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					{/* Tech Stack Categories */}
					{techStacks.map((stack, stackIndex) => (
						<SidebarGroup key={stack.category} className="py-2">
							<SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-2">
								<div className="flex items-center gap-2">
									<stack.icon className="h-3 w-3" />
									{stack.category}
								</div>
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu className="px-2">
									{stack.items.map((item, itemIndex) => (
										<SidebarMenuItem key={item.name}>
											<SidebarMenuButton
												onClick={() => handleNavigation(item.href)}
												isActive={pathname === item.href}
												className={cn(
													"w-full justify-between group hover:bg-gray-100 transition-colors h-10",
													isMobile && "h-12 text-base active:bg-gray-200"
												)}>
												<div className="flex items-center gap-3">
													<div
														className={cn(
															"h-2 w-2 rounded-full",
															item.color,
															isMobile && "h-3 w-3"
														)}
													/>
													<span className="text-sm">{item.name}</span>
												</div>
												<Badge
													variant="secondary"
													className={cn(
														"ml-auto text-xs",
														isMobile && "text-sm px-2 py-1"
													)}>
													{item.count}
												</Badge>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
							{/* Add separator between categories except for the last one */}
							{stackIndex < techStacks.length - 1 && (
								<Separator className="mx-2 mt-2" />
							)}
						</SidebarGroup>
					))}

					{/* Mobile Footer Actions */}
					{isMobile && (
						<>
							<Separator className="mx-2 my-4" />
							<SidebarGroup className="py-4">
								<SidebarGroupContent>
									<div className="px-2 space-y-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleNavigation("/settings")}
											className="w-full justify-start h-10 text-left">
											⚙️ Settings
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleNavigation("/help")}
											className="w-full justify-start h-10 text-left">
											❓ Help & Support
										</Button>
									</div>
								</SidebarGroupContent>
							</SidebarGroup>
						</>
					)}
				</ScrollArea>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
});
