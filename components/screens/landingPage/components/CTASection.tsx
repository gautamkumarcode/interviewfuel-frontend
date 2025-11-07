import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
	const benefits = [
		"Unlimited practice sessions",
		"AI-powered feedback",
		"Progress tracking",
		"Community access",
		"Interview tips & strategies",
		"Mobile-friendly platform",
	];

	return (
		<section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0">
				<div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
						<Sparkles className="w-4 h-4 mr-2" />
						Limited Time: Free Access
					</div>

					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
						Ready to Land Your
						<span className="block">Dream Job?</span>
					</h2>

					<p className="max-w-3xl mx-auto text-xl text-blue-100 mb-12">
						Join thousands of successful developers who used our platform to ace
						their technical interviews. Start practicing today and get
						interview-ready in weeks, not months.
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Benefits */}
					<div className="space-y-6">
						<h3 className="text-2xl font-bold text-white mb-6">
							What you&lsquo;ll get:
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{benefits.map((benefit, index) => (
								<div key={index} className="flex items-center text-white">
									<CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
									<span>{benefit}</span>
								</div>
							))}
						</div>
					</div>

					{/* CTA Card */}
					<div className="bg-white rounded-2xl p-8 shadow-2xl">
						<div className="text-center">
							<h3 className="text-2xl font-bold text-gray-900 mb-4">
								Start Your Free Trial
							</h3>
							<p className="text-gray-600 mb-8">
								No credit card required. Get full access to all features for 14
								days.
							</p>

							<Link
								href="/practice"
								className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-4">
								<span className="flex items-center justify-center">
									Get Started Free
									<ArrowRight className="ml-2 w-5 h-5" />
								</span>
							</Link>

							<p className="text-sm text-gray-500">
								Already have an account?
								<Link
									href="/login"
									className="text-blue-600 hover:text-blue-700 font-medium ml-1">
									Sign in
								</Link>
							</p>
						</div>
					</div>
				</div>

				{/* Trust indicators */}
				<div className="mt-16 text-center">
					<p className="text-blue-100 mb-8">Trusted by developers at:</p>
					<div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
						{[
							"Google",
							"Meta",
							"Amazon",
							"Microsoft",
							"Apple",
							"Netflix",
							"Uber",
							"Stripe",
						].map((company) => (
							<div key={company} className="text-white font-semibold text-lg">
								{company}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
