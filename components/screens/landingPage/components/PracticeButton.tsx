"use client";

import { useAuthModal } from "@/context/AuthModalContext";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface PracticeButtonProps {
	variant?: "primary" | "secondary";
	className?: string;
	children?: React.ReactNode;
}

export const PracticeButton = ({
	variant = "primary",
	className = "",
	children,
}: PracticeButtonProps) => {
	const { status } = useSession();
	const { openLogin } = useAuthModal();

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (status === "unauthenticated") {
			e.preventDefault();
			// Pass the practice page URL as callback
			openLogin("/practice");
		}
		// If authenticated, the Link will navigate normally
	};

	const defaultPrimaryClass =
		"inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#19c862] to-[#0a8c3d] text-white font-semibold rounded-xl hover:from-[#17b558] hover:to-[#097a35] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1";

	const defaultSecondaryClass =
		"inline-flex items-center px-10 py-5 bg-white text-[#19c862] font-bold text-lg rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1";

	const buttonClass =
		className ||
		(variant === "primary" ? defaultPrimaryClass : defaultSecondaryClass);

	return (
		<Link href="/practice" onClick={handleClick} className={buttonClass}>
			{children || (
				<>
					Start Practicing Free
					<ArrowRight className="ml-2 w-5 h-5" />
				</>
			)}
		</Link>
	);
};
