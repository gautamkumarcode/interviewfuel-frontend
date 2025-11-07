import { Quote, Star } from "lucide-react";

export default function TestimonialsSection() {
	const testimonials = [
		{
			name: "Sarah Chen",
			role: "Software Engineer at Google",
			avatar: "SC",
			content:
				"InterviewAce helped me prepare for my Google interview. The AI feedback was incredibly detailed and helped me identify areas for improvement. Landed the job!",
			rating: 5,
		},
		{
			name: "Marcus Johnson",
			role: "Senior Developer at Meta",
			avatar: "MJ",
			content:
				"The system design practice sessions were game-changing. I felt confident walking into my Meta interview knowing I had practiced similar scenarios.",
			rating: 5,
		},
		{
			name: "Priya Patel",
			role: "Full Stack Engineer at Amazon",
			avatar: "PP",
			content:
				"Amazing platform! The coding challenges are well-structured and the explanations are clear. Helped me transition from bootcamp to FAANG.",
			rating: 5,
		},
		{
			name: "David Kim",
			role: "Tech Lead at Microsoft",
			avatar: "DK",
			content:
				"Used this for my Microsoft interview prep. The behavioral question practice was particularly helpful. Highly recommend to anyone serious about interview prep.",
			rating: 5,
		},
		{
			name: "Emily Rodriguez",
			role: "Frontend Engineer at Stripe",
			avatar: "ER",
			content:
				"The AI interviewer feels so realistic! It helped me overcome my interview anxiety and practice articulating my thoughts clearly.",
			rating: 5,
		},
		{
			name: "Alex Thompson",
			role: "Backend Engineer at Uber",
			avatar: "AT",
			content:
				"Comprehensive platform with everything you need. The progress tracking kept me motivated throughout my 3-month preparation journey.",
			rating: 5,
		},
	];

	return (
		<section className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
						Success Stories
					</h2>
					<p className="max-w-3xl mx-auto text-xl text-gray-600">
						Join thousands of developers who have successfully landed their
						dream jobs using our platform.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
							<div className="flex items-center mb-6">
								<div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
									{testimonial.avatar}
								</div>
								<div>
									<h4 className="font-bold text-gray-900">
										{testimonial.name}
									</h4>
									<p className="text-sm text-gray-600">{testimonial.role}</p>
								</div>
							</div>

							<div className="flex items-center mb-4">
								{[...Array(testimonial.rating)].map((_, i) => (
									<Star
										key={i}
										className="w-5 h-5 text-yellow-400 fill-current"
									/>
								))}
							</div>

							<div className="relative">
								<Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-200" />
								<p className="text-gray-700 leading-relaxed pl-6">
									{testimonial.content}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Overall rating */}
				<div className="text-center mt-16">
					<div className="inline-flex items-center bg-white rounded-full px-8 py-4 shadow-lg">
						<div className="flex items-center mr-4">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className="w-6 h-6 text-yellow-400 fill-current"
								/>
							))}
						</div>
						<div className="text-left">
							<div className="text-2xl font-bold text-gray-900">4.9/5</div>
							<div className="text-sm text-gray-600">from 10,000+ reviews</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
