"use client";

import { useTheme } from "@/context/theme.context";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export const Toaster = () => {
	const { showToaster, setShowToaster } = useTheme();

	const variants = {
		success: {
			background: "bg-emerald-50 dark:bg-emerald-950/100",
			border: "border-emerald-200/30 dark:border-emerald-800/30",
			text: "text-emerald-800 dark:text-emerald-200",
			icon: "text-emerald-600 dark:text-emerald-400",
		},
		error: {
			background: "bg-red-50 dark:bg-red-950/100",
			border: "border-red-200/30 dark:border-red-800/30",
			text: "text-red-800 dark:text-red-200",
			icon: "text-red-600 dark:text-red-400",
		},
	};

	const currentVariant =
		showToaster.type === "Success" ? variants.success : variants.error;

	return (
		<div
			className="fixed right-2 bottom-3  min-w-[320px] "
			style={{ zIndex: 9999 }}>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 10 }}
				className="w-full">
				<div
					className={`relative overflow-hidden rounded-lg border ${currentVariant.background} ${currentVariant.border} p-4 shadow-sm`}>
					<div className="flex items-center gap-3">
						<motion.div
							initial={{ scale: 0.5 }}
							animate={{ scale: 1 }}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 20,
							}}>
							<div className="rounded-full p-1">
								{showToaster.type === "Success" ? (
									<CheckCircle2 className={`h-5 w-5 ${currentVariant.icon}`} />
								) : (
									<XCircle className={`h-5 w-5 ${currentVariant.icon}`} />
								)}
							</div>
						</motion.div>

						<motion.p
							initial={{ opacity: 0, x: 10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1 }}
							className={`text-sm font-medium ${currentVariant.text}`}>
							{showToaster.message}
						</motion.p>

						<motion.button
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.5 }}
							whileHover={{ opacity: 1 }}
							className="ml-auto"
							onClick={() => setShowToaster({ ...showToaster, status: false })}>
							<XCircle className={`h-5 w-5 ${currentVariant.icon}`} />
						</motion.button>
					</div>

					<motion.div
						initial={{ x: "-100%" }}
						animate={{ x: "100%" }}
						transition={{ duration: 1, delay: 0.2 }}
						className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent"
					/>

					<motion.div
						initial={{ scaleX: 1 }}
						animate={{ scaleX: 0 }}
						transition={{ duration: 3, ease: "linear" }}
						className={`absolute bottom-0 left-0 h-0.5 w-full origin-left ${
							showToaster.type === "Success"
								? "bg-emerald-600/30 dark:bg-emerald-400/30"
								: "bg-red-600/30 dark:bg-red-400/30"
						}`}
					/>
				</div>
			</motion.div>
		</div>
	);
};
