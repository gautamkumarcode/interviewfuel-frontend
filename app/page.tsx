// app/page.tsx or pages/index.tsx
import Link from "next/link";
import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Interview Fuel</h1>
        <nav className="space-x-6">
          <Link href="#features" className="hover:underline">Features</Link>
          <Link href="#about" className="hover:underline">About</Link>
          <Link href="#contact" className="hover:underline">Contact</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-green-800 text-white text-center py-20 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Ace Your Tech Interviews
        </h2>
        <p className="max-w-xl mx-auto text-lg mb-8">
          Personalized resources and practice to help you crack your next interview with confidence.
        </p>
        <Link
          href="/questions"
          className="inline-block bg-yellow-400 text-black font-semibold py-3 px-6 rounded hover:bg-yellow-300 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12 text-green-700">Features</h3>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white rounded shadow p-6 text-center">
            <h4 className="text-xl font-semibold mb-2">Curated Questions</h4>
            <p className="text-gray-600">Practice real-world coding and system design questions tailored to your needs.</p>
          </div>
          <div className="bg-white rounded shadow p-6 text-center">
            <h4 className="text-xl font-semibold mb-2">Mock Interviews</h4>
            <p className="text-gray-600">Simulate live interviews with instant feedback to improve your performance.</p>
          </div>
          <div className="bg-white rounded shadow p-6 text-center">
            <h4 className="text-xl font-semibold mb-2">Detailed Analytics</h4>
            <p className="text-gray-600">Track your progress and identify areas for improvement with our smart dashboard.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-green-50 py-16 px-6 max-w-4xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-6 text-green-700">About Interview Fuel</h3>
        <p className="text-gray-700 text-lg">
          Interview Fuel was created to empower aspiring developers with the right tools and guidance
          to succeed in technical interviews. Our goal is to make your preparation effective and stress-free.
        </p>
      </section>

      {/* Call to Action */}
      <section id="start" className="bg-green-700 text-white text-center py-16">
        <h3 className="text-3xl font-bold mb-4">Ready to land your dream job?</h3>
        <Link
          href="#contact"
          className="inline-block bg-yellow-400 text-black font-semibold py-3 px-6 rounded hover:bg-yellow-300 transition"
        >
          Contact Us
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} Interview Fuel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
