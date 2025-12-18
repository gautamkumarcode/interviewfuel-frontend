"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface StatsCounterProps {
	value: number;
	label: string;
	suffix?: string;
	prefix?: string;
}

export function StatsCounter({
	value,
	label,
	suffix = "",
	prefix = "",
}: StatsCounterProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [isClient, setIsClient] = useState(false);
	const inView = useInView(ref, { once: true, margin: "-100px" });
	
	const spring = useSpring(0, {
		mass: 0.8,
		stiffness: 75,
		damping: 15,
		restDelta: 0.001
	});
	
	const display = useTransform(spring, (current) => 
		`${prefix}${Math.round(current).toLocaleString()}${suffix}`
	);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (inView && isClient) {
			spring.set(value);
		}
	}, [inView, value, spring, isClient]);

	// Render static value on server, animate on client
	if (!isClient) {
		return (
			<div ref={ref} className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
				<div className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-green-500 to-emerald-700 mb-2">
					{prefix}{value.toLocaleString()}{suffix}
				</div>
				<div className="text-gray-500 dark:text-gray-400 font-medium">{label}</div>
			</div>
		);
	}

	return (
		<div ref={ref} className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
			<motion.div className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-green-500 to-emerald-700 mb-2">
				{display}
			</motion.div>
			<div className="text-gray-500 dark:text-gray-400 font-medium">{label}</div>
		</div>
	);
}
