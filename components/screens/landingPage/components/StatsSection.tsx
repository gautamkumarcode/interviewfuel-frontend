export default function StatsSection() {
	const stats = [
		{ number: "50,000+", label: "Developers Trained", color: "text-blue-600" },
		{
			number: "10,000+",
			label: "Practice Questions",
			color: "text-purple-600",
		},
		{ number: "95%", label: "Success Rate", color: "text-green-600" },
		{ number: "500+", label: "Companies Hiring", color: "text-orange-600" },
	];

	return (
		<section className="py-16 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
					{stats.map((stat, index) => (
						<div key={index} className="text-center">
							<div
								className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-2`}>
								{stat.number}
							</div>
							<div className="text-gray-600 font-medium">{stat.label}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
