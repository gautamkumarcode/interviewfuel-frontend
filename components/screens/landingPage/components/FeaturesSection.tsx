import {
	BarChart3,
	Brain,
	Code,
	MessageSquare,
	Shield,
	Target,
	Users,
	Zap,
} from "lucide-react";

export default function FeaturesSection() {
	const features = [
		{
			icon: Brain,
			title: "AI-Powered Practice",
			description:
				"Get personalized interview questions and real-time feedback powered by advanced AI technology.",
			color: "text-blue-600 bg-blue-100",
		},
		{
			icon: MessageSquare,
			title: "Mock Interviews",
			description:
				"Practice with realistic interview scenarios and get detailed performance analysis.",
			color: "text-purple-600 bg-purple-100",
		},
		{
			icon: Code,
			title: "Coding Challenges",
			description:
				"Solve problems across multiple programming languages with instant code evaluation.",
			color: "text-green-600 bg-green-100",
		},
		{
			icon: Target,
			title: "Targeted Learning",
			description:
				"Focus on specific topics and difficulty levels based on your target companies.",
			color: "text-orange-600 bg-orange-100",
		},
		{
			icon: BarChart3,
			title: "Progress Tracking",
			description:
				"Monitor your improvement with detailed analytics and performance metrics.",
			color: "text-red-600 bg-red-100",
		},
		{
			icon: Users,
			title: "Community Support",
			description:
				"Connect with other developers and share interview experiences and tips.",
			color: "text-indigo-600 bg-indigo-100",
		},
	];

	return (
		<section className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
						Everything You Need to
						<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
							Ace Your Interview
						</span>
					</h2>
					<p className="max-w-3xl mx-auto text-xl text-gray-600">
						Our comprehensive platform provides all the tools and resources you
						need to prepare for technical interviews at top companies.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
							<div
								className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-6`}>
								<feature.icon className="w-6 h-6" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-4">
								{feature.title}
							</h3>
							<p className="text-gray-600 leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>

				{/* Additional highlight */}
				<div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
					<div className="flex items-center justify-center mb-4">
						<Shield className="w-8 h-8 mr-3" />
						<Zap className="w-8 h-8" />
					</div>
					<h3 className="text-2xl font-bold mb-4">
						Trusted by Engineers at Top Companies
					</h3>
					<p className="text-blue-100 max-w-2xl mx-auto">
						Our platform has helped thousands of developers land jobs at Google,
						Meta, Amazon, Microsoft, and hundreds of other leading tech
						companies.
					</p>
				</div>
			</div>
		</section>
	);
}
