"use client";
// import { userLogout } from "@/app/[locale]/(auth)/get-user-profile";
// import { NotificationIcon } from "@/components/screens/notification/components/NotificationIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthModal } from "@/context/AuthModalContext";
import { useClusterData } from "@/context/clusterData-context";
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
import { Mail, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
// import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { forwardRef, useEffect, useState } from "react";

// import { CommandSearch } from "../GlobalSearch";

const Navbar = forwardRef<HTMLDivElement>((_props, ref) => {
	const { data: session } = useSession();
	const { userData: profile, userLoading: profileLoading } = useClusterData();
	const { openLogin } = useAuthModal();
	const router = useRouter();
	const urlPaths = usePathname();
	const [pathname, setPathname] = useState<string | null>(null);

	useEffect(() => {
		const parts = urlPaths.split("/");
		const lastSegment = parts[parts.length - 1];
		setPathname(lastSegment);
	}, [urlPaths]);

	const handleSignout = async () => {
		handleSignOutAPI();
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
	];

	return (
		<div
			ref={ref}
			className={` dark:bg-primaryGreyBg bg-[#FFFFFF] flex items-center  xl:justify-normal gap-4 px-8 h-16 dark:text-white text-black shadow-sm `}>
			<div className="hidden md:flex lg:flex xl:flex 2xl:flex 3xl:flex items-center gap-9 h-3/4 flex-1 text-primary">
				{width > 840 && (
					<div className="h-full flex items-center justify-center">
						<ul className="hidden xl:flex 2xl:flex 3xl:flex text-primary gap-9">
							{navbarOptions.map(({ id, path, name }) => (
								<li
									key={id}
									className={`text-xs font-manrope font-semibold ${
										`/${pathname}` === path
											? "text-gren"
											: "text-black dark:text-white"
									}`}>
									<Link href={path} className="font-manrope">
										{name}
									</Link>
								</li>
							))}
						</ul>
						{/* <Input
							placeholder="Search..."
							className="h-10 w-64 bg-white dark:bg-gray-800 text-black dark:text-white"
							// onChange={(e) => setSearchQuery(e.target.value)}
						/> */}
						{/* <CommandSearch userRole={user?.user?.role} t={t} /> */}
					</div>
				)}
			</div>

			<div className="flex items-center gap-6">
				{/* <Image src={mail} alt="chevronLeft-icon" /> */}
				<Mail className="h-5 w-5 text-primary" />
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

				{session ? (
					// Show user dropdown if logged in
					<div className="xl:block 2xl:block 3xl:block hidden relative">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar className="cursor-pointer">
									{profileLoading ? (
										<AvatarFallback>
											<div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
										</AvatarFallback>
									) : (
										<AvatarFallback>
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
							<DropdownMenuContent className="w-56">
								<DropdownMenuLabel>
									{profileLoading ? (
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
											Loading...
										</div>
									) : (
										<div>
											<div className="font-medium">
												{profile?.name || session.user?.name || "User"}
											</div>
											<div className="text-xs text-gray-500 font-normal">
												{profile?.email || session.user?.email}
											</div>
										</div>
									)}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => router.push("/profile")}>
									Profile Settings
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => router.push("/settings?view=password")}>
									Change Password
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => router.push("/news")}>
									Latest News
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleSignout}>
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				) : (
					// Show Login button if not logged in
					<Button onClick={openLogin} className="text-sm font-semibold">
						Login
					</Button>
				)}
			</div>

			<nav className="block xl:hidden 2xl:hidden 3xl:hidden">
				<div className="px-4 h-16 flex items-center justify-between gap-4">
					{/* Left section with menu and search */}
					<div className="flex items-center gap-2">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon">
									<Menu className="h-5 w-5" />
									<span className="sr-only">Open menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent
								side="right"
								className="w-72 dark:bg-primaryGreyBg bg-[#FFFFFF]  p-0 flex flex-col">
								<SheetHeader className="pt-4 px-1  border-slate-800 overflow-hidden">
									{/* <SheetTitle className="text-white ">
                    <CommandSearch t={t} userRole={user?.user?.role} />
                  </SheetTitle> */}
								</SheetHeader>

								<div className="py-2 flex-grow">
									{navbarOptions.map(({ id, path, name }) => (
										<Link
											key={id}
											href={path}
											className={`flex items-center px-4 py-2 text-sm  font-medium  ${
												`/${pathname}` === path
													? "text-gren"
													: "text-black dark:text-white"
											}`}>
											{name}
										</Link>
									))}
								</div>
								<div className="mt-auto bg-red-900 flex">
									<Card className="bg-zinc-900 border-none rounded-none w-full text-white p-4 flex justify-center items-center gap-4">
										<div className="relative h-12 w-12">
											<Avatar>
												{/* <AvatarImage
                          src={
                            user?.user?.profilePic !== null
                              ? user?.user?.profilePic
                              : `https://ui-avatars.com/api/?name=${user?.user?.name}`
                          }
                          alt="@shadcn"
                        /> */}
												<AvatarFallback>USER</AvatarFallback>
											</Avatar>
										</div>
										{/* <div className="flex flex-col">
                      <h1 className="font-semibold text-white text-lg">
                        {user?.user?.name}
                      </h1>
                      <p className="text-zinc-400 text-sm" onClick={signOut}>
                        Sign out
                      </p>
                    </div> */}
									</Card>

									{/* <div className="">
                    {user?.user?.role === UserRoles.organization ? (
                      ""
                    ) : (
                      <Button
                        variant="secondary"
                        className="text-center w-full mt-2"
                        onClick={handleProfile}
                      >
                        Profile
                      </Button>
                    )}
                  </div> */}
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</nav>
		</div>
	);
});

Navbar.displayName = "Navbar";

export default Navbar;
