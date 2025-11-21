"use client";
import { AdminOnly } from "@/components/common";
// import { userLogout } from "@/app/[locale]/(auth)/get-user-profile";
// import { NotificationIcon } from "@/components/screens/notification/components/NotificationIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import { useAuthModal } from "@/context/AuthModalContext";
import { useClusterData } from "@/context/clusterData-context";
import { useTheme } from "@/context/theme.context";
import { useIsMobile } from "@/hooks/use-mobile";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { handleSignOutAPI } from "@/services/authservices";
// import { useAuth, useNotification, useTheme } from "@/contexts";
// import { NotificationService } from "@/services";
// import {
//   AxiosErrorResponseType,
//   AxiosResponseTypeWithoutPagination,
// } from "@/types/axios-response.types";
// import { UserRoles } from "@/types/enums";
// import {
//   NotificationResponseType,
//   NotificationSingleResponseType,
// } from "@/types/interfaces/notifications";
// import { formatDateTime } from "@/utils/formatDate";
import {
	BarChart3,
	Bookmark,
	FileText,
	Heart,
	LogOut,
	Menu,
	Play,
	Settings2,
	ShieldCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
// import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { forwardRef, useEffect, useState } from "react";
import { NavbarSearch } from "./NavbarSearch";

// import { CommandSearch } from "../GlobalSearch";

const Navbar = forwardRef<HTMLDivElement>((_props, ref) => {
	const { data: session, status } = useSession();
	const { userData: profile, userLoading: profileLoading } = useClusterData();
	const { openLogin } = useAuthModal();
	const router = useRouter();
	const urlPaths = usePathname();
	const { toast } = useTheme();
	const [pathname, setPathname] = useState<string | null>(null);
	const isMobile = useIsMobile();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const parts = urlPaths.split("/");
		const lastSegment = parts[parts.length - 1];
		setPathname(lastSegment);
	}, [urlPaths]);

	const handleSignout = async () => {
		handleSignOutAPI();
		toast.success("logged out successfully");
	};

	const toggleSidebar = () => {
		const currentMinimized = sessionStorage.getItem("minimized") === "true";
		const newMinimized = !currentMinimized;

		sessionStorage.setItem("minimized", String(newMinimized));

		// Dispatch custom event to notify layout and sidebar
		window.dispatchEvent(
			new CustomEvent("sidebarToggle", {
				detail: { minimized: newMinimized },
			})
		);
	};

	// State to control popover open/close
	const { width } = useWindowDimensions();

	const navbarOptions = [
		{
			id: 1,
			name: "Analytics",
			path: "/analytics",
		},
		{
			id: 2,
			name: "Practice",
			path: "/practice",
		},
		{
			id: 3,
			name: "Questions",
			path: "/questions",
		},
		{
			id: 4,
			name: "Categories",
			path: "/categories",
		},
	];

	return (
		<div
			ref={ref}
			className="dark:bg-primaryGreyBg bg-[#FFFFFF] flex items-center justify-between h-16 dark:text-white text-black shadow-sm px-4 md:px-8">
			{/* Mobile hamburger menu */}
			{isMobile && (
				<div className="flex items-center gap-2">
					<Image src={"/logo.png"} alt="Logo" width={45} height={45} />

					<Menu className="h-6 w-6 text-gray-600" onClick={toggleSidebar} />
				</div>
			)}

			{/* Desktop navigation */}
			<div className="hidden md:flex items-center gap-9 flex-1 text-primary">
				{width > 840 && (
					<div className="h-full flex items-center justify-center">
						<ul className="hidden xl:flex 2xl:flex 3xl:flex text-primary gap-9">
							{navbarOptions.map(({ id, path, name }) => (
								<li
									key={id}
									className={`text-xs font-manrope font-semibold ${
										`/${pathname}` === path
											? " text-green-500 underline"
											: "text-black dark:text-white"
									}`}>
									<Link href={path} className="font-manrope">
										{name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
			{/* Desktop search - hidden on mobile */}
			<div className="hidden lg:block mx-auto justify-center items-center w-full ml-10">
				<NavbarSearch />
			</div>
			<div className="flex items-center gap-2 md:gap-6">
				{session && (
					<div className="flex items-center gap-2">
						<Button
							onClick={() => router.push("/questions/create")}
							className="bg-green-500 hover:bg-green-600 text-white text-xs md:text-sm font-semibold px-4 md:px-4 py-2 shrink-0">
							<span className="hidden sm:inline">Add Question</span>
							<span className="sm:hidden">Add</span>
						</Button>
					</div>
				)}
				{/* <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative cursor-pointer">
              <MessageSquareMore className="h-5 w-5 text-primary" />
              {unreadNotificationsCount > 0 && (
                <Badge
                  variant={"destructive"}
                  className="absolute top-[-15px] left-3 bg-red-500 w-fit z-20 cursor-pointer"
                >
                  <p>{unreadNotificationsCount}</p>
                </Badge>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent className="min-w-[400px] dark:bg-primaryGreyBg bg-white p-0 absolute right-0 top-4 outline-none dark:border-primaryGreyBg">
            <div className="flex items-center justify-between p-4">
              <p className="text-lg font-semibold dark:text-white ">
                Notification
              </p>
              <div
                className={`flex gap-3 items-center  ${
                  unreadNotificationsCount > 0
                    ? "text-white cursor-pointer"
                    : "text-grey cursor-not-allowed"
                }`}
                aria-disabled={unreadNotificationsCount === 0}
                onClick={handleMarkAllSeen}
              >
                <CheckCheck className="h-4 w-4" />
                <p className="text-sm "> Mark all as read </p>
              </div>
            </div>

            {notifications && notifications.length > 0 ? (
              <div className="flex flex-col gap-2 pb-4 w-full">
                {notifications
                  .slice(0, 3)
                  .map((notification: NotificationResponseType) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        handleNotificationClick(notification);
                        router.push(notification.url);
                      }}
                      className="dark:border-gray-700 border-b-[0.5px] group border-grey flex px-4 py-4 gap-2 items-center cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <Avatar className="bg-red-100 items-center text-center justify-center">
                        <NotificationIcon type={notification.type} />
                      </Avatar>

                      <div className="flex-1 dark:text-white">
                        <p className="text-sm font-semibold font-manrope text-primary">
                          {notification.message}
                        </p>
                        <span className="flex text-gray-400 text-xs">
                          This is the Dummy description updated later
                        </span>
                      </div>

                      <div className="text-xs flex flex-col items-end justify-start gap-1">
                        <div className="h-7 w-7 z-50">
                          <Trash2
                            className="h-7 w-7 rounded-full p-1 bg-primaryGreyBg text-red-500  hidden group-hover:flex "
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the event from bubbling up
                              handleDeleteNotificationAPICall(notification);
                            }}
                          />
                        </div>

                        <p className="text-gray-400">
                          {formatDateTime(notification.createdAt!)}
                        </p>
                        {!notification.seen && (
                          <Badge
                            variant={"destructive"}
                            className="bg-red-500 cursor-pointer h-2 w-2 rounded-full p-0"
                          ></Badge>
                        )}
                      </div>
                    </div>
                  ))}

                <div className="px-4">
                  <Button
                    variant="default"
                    className="text-center w-full dark:bg-white dark:outline-none outline-dashed font-semibold text-gray-800 h-12 items-center"
                    onClick={handleViewAllClick}
                  >
                    Show All Notification
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-4 pb-4">
                <div className="h-[200px] flex justify-center text-center items-center">
                  <p className="text-xl font-semibold font-manrope dark:text-white text-black">
                    No Notifications
                  </p>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover> */}

				{status === "loading" ? null : session ? ( // Optionally render a skeleton or null during loading
					// Show user dropdown if logged in - mobile responsive
					<div className="relative">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar className="cursor-pointer h-9 w-9 md:h-10 md:w-10 shrink-0">
									{profileLoading ? (
										<AvatarFallback>
											<div className="w-3 h-3 md:w-4 md:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
										</AvatarFallback>
									) : (
										<AvatarFallback className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xs md:text-sm">
											{profile?.name
												? profile.name
														.split(" ")
														.map((n: string) => n[0])
														.join("")
														.toUpperCase()
												: session.user?.name
														?.split(" ")
														.map((n: string) => n[0])
														.join("")
														.toUpperCase() || "U"}
										</AvatarFallback>
									)}
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56 md:w-60" align="end">
								<DropdownMenuLabel onClick={() => router.push("/profile")}>
									{profileLoading ? (
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
											Loading...
										</div>
									) : (
										<div>
											<div className="font-medium text-sm">
												{profile?.name || session.user?.name || "User"}
											</div>
											<div className="text-xs text-gray-500 font-normal truncate">
												{profile?.email || session.user?.email}
											</div>
										</div>
									)}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />

								{/* Common menu items for all users */}
								<DropdownMenuItem onClick={() => router.push("/analytics")}>
									<BarChart3 className="h-4 w-4 mr-2" />
									Analytics
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => router.push("/practice")}>
									<Play className="h-4 w-4 mr-2" />
									Practice
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => router.push("/questions")}>
									<FileText className="h-4 w-4 mr-2" />
									Questions
								</DropdownMenuItem>

								{/* Role-specific menu items */}
								{/* Regular user menu items - shown to all logged in users */}
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => router.push("/my-questions")}>
									<FileText className="h-4 w-4 mr-2" />
									My Questions
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => router.push("/bookmarks")}>
									<Bookmark className="h-4 w-4 mr-2" />
									Bookmarked Questions
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => router.push("/liked-questions")}>
									<Heart className="h-4 w-4 mr-2" />
									Liked Questions
								</DropdownMenuItem>

								{/* Admin-only menu items */}
								<AdminOnly>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => router.push("/admin-review")}>
										<ShieldCheck className="h-4 w-4 mr-2" />
										Review Questions
									</DropdownMenuItem>

									<DropdownMenuItem onClick={() => router.push("/categories")}>
										<Settings2 className="h-4 w-4 mr-2" />
										Category Management
									</DropdownMenuItem>
								</AdminOnly>

								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleSignout}>
									<LogOut className="h-4 w-4 mr-2" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				) : (
					// Show Login button if not logged in - responsive
					<Button
						onClick={() => openLogin()}
						className="text-xs md:text-sm font-semibold px-2 md:px-4 shrink-0">
						Login
					</Button>
				)}
			</div>
		</div>
	);
});

Navbar.displayName = "Navbar";

export default Navbar;
