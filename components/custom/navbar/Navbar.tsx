"use client";

import { Bell, LogOut, Moon, Search, Settings, Sun, User } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { MobileBreadcrumb } from "../mobileNav/MobileBreadcrumb";
import { MobileSearch } from "../mobileNav/MobileSearch";
import { BreadcrumbNav } from "./BreadcrumbNav";

export function AppNavbar() {
	const [searchQuery, setSearchQuery] = React.useState("");
	const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
	const [isDarkMode, setIsDarkMode] = React.useState(false);
	const router = useRouter();

	// Initialize dark mode from localStorage or system preference


	return (
		<>
			<header className="sticky  border-gray-300 top-0 z-10 border-b  bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
				<div className="flex h-16 items-center gap-4 px-4 md:px-6">

					<div className="md:hidden flex-1 flex items-center justify-between">
						<MobileBreadcrumb />
						<div className="flex items-center gap-2">
							<MobileSearch
								isOpen={mobileSearchOpen}
								onToggle={() => setMobileSearchOpen(!mobileSearchOpen)}
							/>
							<Button 
								variant="ghost" 
								size="sm" 
								onClick={()=>setIsDarkMode(!isDarkMode)}
								className="h-10 w-10 p-0"
							>
								{isDarkMode ? (
									<Sun className="h-5 w-5 text-green-600" />
								) : (
									<Moon className="h-5 w-5 text-blue-600" />
								)}
							</Button>
							<Button variant="ghost" size="sm" className="h-10 w-10 p-0">
								<Bell className="h-5 w-5" />
							</Button>
						</div>
					</div>

					{/* Desktop Layout */}
					<div className="hidden md:flex items-center gap-4 flex-1">
						<BreadcrumbNav />

						<Separator orientation="vertical" className="h-4 mx-2" />

						{/* Search and Dark Mode Toggle */}
						<div className="flex items-center gap-4 ml-auto">
							<div className="relative max-w-md">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
								<Input
									placeholder="Search interview questions..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors w-80"
								/>
							</div>

							<Button
								variant="outline"
								size="sm"
								onClick={()=>setIsDarkMode(!isDarkMode)}
								className="gap-2 bg-transparent border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:border-green-600 dark:hover:bg-green-900/20">
								{isDarkMode ? (
									<Sun className="h-4 w-4 text-green-600" />
								) : (
									<Moon className="h-4 w-4 text-blue-600" />
								)}
								{isDarkMode ? "Light" : "Dark"}
							</Button>
						</div>
					</div>

					{/* User Menu - Always Visible */}
					<div className="hidden md:flex items-center gap-3">
						<Button variant="ghost" size="sm">
							<Bell className="h-4 w-4" />
						</Button>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full">
									<Avatar className="h-8 w-8">
										<AvatarImage src="/placeholder-user.jpg" alt="User" />
										<AvatarFallback>JD</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end">
								<DropdownMenuItem onClick={() => router.push("/profile")}>
									<User className="mr-2 h-4 w-4" />
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									Settings
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<LogOut className="mr-2 h-4 w-4" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Mobile User Menu */}
					<div className="md:hidden">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-10 w-10 rounded-full p-0">
									<Avatar className="h-8 w-8">
										<AvatarImage src="/placeholder-user.jpg" alt="User" />
										<AvatarFallback>JD</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end">
								<DropdownMenuItem onClick={() => router.push("/profile")}>
									<User className="mr-2 h-4 w-4" />
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Settings className="mr-2 h-4 w-4" />
									Settings
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<LogOut className="mr-2 h-4 w-4" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			{/* Mobile Search Overlay */}
			<MobileSearch
				isOpen={mobileSearchOpen}
				onToggle={() => setMobileSearchOpen(!mobileSearchOpen)}
			/>
		</>
	);
}
