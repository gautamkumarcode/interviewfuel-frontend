"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function MobileSidebarTrigger() {
	const { openMobile, setOpenMobile, isMobile } = useSidebar();

	if (!isMobile) return null;

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => setOpenMobile(!openMobile)}
			className={cn(
				"h-10 w-10 p-0 hover:bg-gray-100 transition-colors",
				openMobile && "bg-gray-100"
			)}
			aria-label={openMobile ? "Close menu" : "Open menu"}>
			{openMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
		</Button>
	);
}
