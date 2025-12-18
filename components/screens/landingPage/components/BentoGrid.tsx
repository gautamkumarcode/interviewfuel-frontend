"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export const BentoGrid = ({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) => {
	return (
		<div
			className={cn(
				"grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
				className
			)}>
			{children}
		</div>
	);
};

export const BentoCard = ({
	className,
	title,
	description,
	header,
	icon,
	href,
	cta,
}: {
	className?: string;
	title?: string | ReactNode;
	description?: string | ReactNode;
	header?: ReactNode;
	icon?: ReactNode;
	href?: string;
	cta?: string;
}) => {
	return (
		<motion.div
			initial={{ opacity: 1, scale: 1 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className={cn(
				"row-span-1 rounded-2xl group/bento hover:shadow-2xl transition-all duration-300 shadow-lg p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 justify-between flex flex-col space-y-4 hover:scale-[1.02] cursor-pointer",
				className
			)}>
			{header}
			<div className="group-hover/bento:translate-x-1 transition-all duration-300">
				{icon}
				<div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 mt-2">
					{title}
				</div>
				<div className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
					{description}
				</div>
				{href && cta && (
					<Link
						href={href}
						className="inline-flex items-center mt-6 text-sm md:text-base font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">
						{cta} <ArrowRight className="ml-2 w-4 h-4 group-hover/bento:translate-x-1 transition-transform" />
					</Link>
				)}
			</div>
		</motion.div>
	);
};
