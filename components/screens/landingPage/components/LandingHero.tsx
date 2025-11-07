import { ArrowRight, BookOpen, Play, Star, Users } from "lucide-react";
import Link from "next/link";

export default function LandingHero() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
			{/* Background decoration */}
			<div className="absolute inset-0">
				<div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
				<div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
				<div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
				<div className="text-center">
					{/* Badge */}
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium mb-8">
						<Star className="w-4 h-4 mr-2" />
						Trusted by 50,000+ developers
					</div>

					{/* Main heading */}
					<h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
						Master Your
						<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
							Technical Interviews
						</span>
					</h1>

					{/* Subheading */}
					<p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 mb-10">
						Practice with AI-powered mock interviews, get instant feedback, and
						land your dream job. From coding challenges to system design -
						we&lsquo;ve got you covered.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
						<Link
							href="/practice"
							className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
							Start Practicing Free
							<ArrowRight className="ml-2 w-5 h-5" />
						</Link>

						<button className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg">
							<Play className="mr-2 w-5 h-5" />
							Watch Demo
						</button>
					</div>

					{/* Social proof */}
					<div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
						<div className="flex items-center">
							<Users className="w-5 h-5 mr-2 text-blue-600" />
							<span className="font-medium">50,000+ Users</span>
						</div>
						<div className="flex items-center">
							<BookOpen className="w-5 h-5 mr-2 text-purple-600" />
							<span className="font-medium">10,000+ Questions</span>
						</div>
						<div className="flex items-center">
							<Star className="w-5 h-5 mr-2 text-yellow-500" />
							<span className="font-medium">4.9/5 Rating</span>
						</div>
					</div>
				</div>

				{/* Hero Image/Video placeholder */}
				<div className="mt-16 relative">
					<div className="relative mx-auto max-w-5xl">
						<div className="relative rounded-2xl shadow-2xl overflow-hidden bg-white p-2">
							<div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
								<div className="text-center">
									<Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
									<p className="text-gray-500 font-medium">
										Interactive Demo Coming Soon
									</p>
								</div>
							</div>
						</div>
						{/* Floating elements */}
						<div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
						<div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
					</div>
				</div>
			</div>
		</section>
	);
}
