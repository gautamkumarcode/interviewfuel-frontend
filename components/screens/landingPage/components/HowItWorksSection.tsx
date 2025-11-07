import { ArrowRight, Brain, Target, Trophy, UserPlus } from "lucide-react";

export default function HowItWorksSection() {
	const steps = [
		{
			icon: UserPlus,
			title: "Sign Up & Set Goals",
			description:
				"Create your profile and tell us about your target companies and roles.",
			color: "text-blue-600 bg-blue-100",
		},
		{
			icon: Target,
			title: "Choose Your Focus",
			description:
				"Select from coding, system design, behavioral, or comprehensive interview prep.",
			color: "text-purple-600 bg-purple-100",
		},
		{
			icon: Brain,
			title: "Practice with AI",
			description:
				"Engage in realistic mock interviews with our AI interviewer and get instant feedback.",
			color: "text-green-600 bg-green-100",
		},
		{
			icon: Trophy,
			title: "Land Your Dream Job",
			description:
				"Apply your skills confidently and ace your real interviews.",
			color: "text-orange-600 bg-orange-100",
		},
	];

	return (
		<section className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
						How It Works
					</h2>
					<p className="max-w-3xl mx-auto text-xl text-gray-600">
						Get interview-ready in just 4 simple steps. Our proven methodology
						has helped thousands of developers succeed.
					</p>
				</div>

				<div className="relative">
					{/* Desktop layout */}
					<div className="hidden lg:block">
						<div className="flex items-center justify-between">
							{steps.map((step, index) => (
								<div
									key={index}
									className="flex flex-col items-center text-center max-w-xs">
									<div
										className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.color} mb-6`}>
										<step.icon className="w-8 h-8" />
									</div>
									<div className="bg-white rounded-xl p-6 shadow-lg">
										<h3 className="text-xl font-bold text-gray-900 mb-3">
											{step.title}
										</h3>
										<p className="text-gray-600">{step.description}</p>
									</div>
									{index < steps.length - 1 && (
										<ArrowRight
											className="absolute top-8 w-6 h-6 text-gray-400"
											style={{ left: `${25 + index * 25}%` }}
										/>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Mobile layout */}
					<div className="lg:hidden space-y-8">
						{steps.map((step, index) => (
							<div key={index} className="flex items-start space-x-4">
								<div
									className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl ${step.color}`}>
									<step.icon className="w-6 h-6" />
								</div>
								<div className="flex-1">
									<h3 className="text-lg font-bold text-gray-900 mb-2">
										{step.title}
									</h3>
									<p className="text-gray-600">{step.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* CTA */}
				<div className="text-center mt-16">
					<a
						href="/practice"
						className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
						Start Your Journey Today
						<ArrowRight className="ml-2 w-5 h-5" />
					</a>
				</div>
			</div>
		</section>
	);
}
