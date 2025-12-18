"use client";

import { motion } from "framer-motion";

const companies = [
	{ name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
	{ name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
	{ name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
	{ name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
	{ name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
	{ name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
	{ name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.svg" },
	{ name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" },
];

export function CompanyMarquee() {
	return (
		<div className="w-full py-12 bg-white dark:bg-gray-950 overflow-hidden relative border-y border-gray-100 dark:border-gray-900/50">
			{/* Gradient Masks */}
			<div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
			<div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />

			<div className="container mx-auto px-4 mb-8 text-center">
				<p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
					Trusted by Engineers at
				</p>
			</div>

			<div className="flex w-full overflow-hidden">
				<motion.div
					initial={{ x: 0 }}
					animate={{ x: "-50%" }}
					transition={{
						duration: 40,
						repeat: Infinity,
						ease: "linear",
					}}
					className="flex flex-shrink-0 items-center gap-16 pr-16">
					{[...companies, ...companies, ...companies].map((company, index) => (
						<div
							key={`${company.name}-${index}`}
							className="relative h-8 w-32 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-pointer">
							{/* Using simple text for now if image fails, but images are preferred */}
							<img
								src={company.logo}
								alt={company.name}
								className="h-full w-auto object-contain max-w-[120px]"
							/>
						</div>
					))}
				</motion.div>
			</div>
		</div>
	);
}
