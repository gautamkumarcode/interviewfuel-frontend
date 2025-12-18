"use client";

import HashLoader from "@/components/custom/loader/Loader";
import { useClusterData } from "@/context/clusterData-context";
import {
	BarChart3,
	Bot,
	Code2,
	Database,
	Server,
	Sparkles,
	Trophy,
	Zap
} from "lucide-react";
import { BentoCard, BentoGrid } from "./components/BentoGrid";
import { CompanyMarquee } from "./components/CompanyMarquee";
import { Hero } from "./components/Hero";
import { StatsCounter } from "./components/StatsCounter";
import FrontedCard from "./components/frontend/FrontedCard";

interface StatItem {
	total: number;
	formatted: string;
	label: string;
}

interface LandingPageProps {
	initialStats?: {
		users: StatItem;
		questions: StatItem;
		successRate: StatItem;
		companies: StatItem;
		categories?: StatItem;
		practiceHours?: StatItem;
		sessions?: StatItem;
	};
}

const LandingPage = ({ initialStats }: LandingPageProps) => {
	const { categoryData, categoryLoading } = useClusterData();
	const categories = categoryData || [];

	// Use server-side stats or fallback to defaults
	const stats = initialStats || {
		users: { total: 100000, formatted: "100K", label: "Developers Trained" },
		questions: { total: 10000, formatted: "10K", label: "Practice Questions" },
		successRate: { total: 95, formatted: "95%", label: "Success Rate" },
		companies: { total: 500, formatted: "500+", label: "Companies Hiring" },
	};

	const features = [
		{
			title: "AI Mock Interviews",
			description: "Real-time voice and code analysis with instant feedback.",
			header: (
				<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 items-center justify-center">
					<Bot className="w-20 h-20 text-green-600 dark:text-green-400 opacity-80" />
				</div>
			),
			icon: <Sparkles className="h-4 w-4 text-neutral-500" />,
			className: "md:col-span-2",
			href: "/practice",
			cta: "Start Interview",
		},
		{
			title: "System Design",
			description: "Master complex distributed system architectures.",
			header: (
				<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 items-center justify-center">
					<Server className="w-16 h-16 text-blue-600 dark:text-blue-400 opacity-80" />
				</div>
			),
			icon: <Database className="h-4 w-4 text-neutral-500" />,
			className: "md:col-span-1",
			href: "/questions?category=system-design",
			cta: "Learn Design",
		},
		{
			title: "10,000+ Questions",
			description: "Curated from top tech companies like Google, Meta, and Amazon.",
			header: (
				<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 items-center justify-center">
					<Code2 className="w-16 h-16 text-orange-600 dark:text-orange-400 opacity-80" />
				</div>
			),
			icon: <Trophy className="h-4 w-4 text-neutral-500" />,
			className: "md:col-span-1",
			href: "/questions",
			cta: "Explore Library",
		},
		{
			title: "Detailed Analytics",
			description: "Track your progress and identify weak spots.",
			header: (
				<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 items-center justify-center">
					<BarChart3 className="w-16 h-16 text-purple-600 dark:text-purple-400 opacity-80" />
				</div>
			),
			icon: <Zap className="h-4 w-4 text-neutral-500" />,
			className: "md:col-span-2",
			href: "/analytics",
			cta: "View Stats",
		},
	];

	return (
		<div className="min-h-screen bg-white dark:bg-black selection:bg-green-500/30">
			{/* Hero Section */}
			<Hero />

			{/* Social Proof */}
			<CompanyMarquee />

			{/* Features Bento Grid */}
			<section className="py-24 bg-gray-50 dark:bg-neutral-950">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-500 mb-4">
							Everything you need to ace the interview
						</h2>
						<p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
							Comprehensive tools designed to help you master data structures,
							algorithms, and system design.
						</p>
					</div>
					<BentoGrid>
						{features.map((feature, i) => (
							<BentoCard key={i} {...feature} />
						))}
					</BentoGrid>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-20 border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-black">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<StatsCounter
							value={stats.users.total}
							label={stats.users.label}
							suffix="+"
						/>
						<StatsCounter
							value={stats.questions.total}
							label={stats.questions.label}
							suffix="+"
						/>
						<StatsCounter
							value={stats.successRate.total}
							label={stats.successRate.label}
							suffix="%"
						/>
						<StatsCounter
							value={stats.companies.total}
							label={stats.companies.label}
							suffix="+"
						/>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-24 bg-gray-50 dark:bg-neutral-950">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Explore by Category
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Target specific topics to strengthen your weak areas.
						</p>
					</div>

					{!categoryLoading ? (
						<FrontedCard frontedTopics={categories} />
					) : (
						<div className="flex items-center justify-center py-20">
							<HashLoader color="#19c862" />
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default LandingPage;
