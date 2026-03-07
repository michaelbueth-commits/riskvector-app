import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">RiskVector</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#features" className="text-slate-600 hover:text-slate-900">Features</Link>
          <Link href="#pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
          <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Live Global Monitoring Active
          </div>
          <h1 className="text-6xl font-bold text-slate-900 mb-6">
            Know Your Risk<br />
            <span className="text-blue-600">Before You Go</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Real-time risk intelligence for travelers. Monitor threats, receive instant alerts, 
            and travel with confidence across 195 countries.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
            >
              Start Free Trial
            </Link>
            <button className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-slate-300 transition">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-20">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">195</div>
            <div className="text-slate-600">Countries Covered</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-slate-600">Alert Systems Integrated</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="text-4xl font-bold text-orange-600 mb-2">&lt;5 min</div>
            <div className="text-slate-600">Alert Latency</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-slate-600">Real-time Monitoring</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">
            Complete Risk Intelligence
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12">
            All your travel safety needs in one platform
          </p>

          <div className="grid grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Source Alerts</h3>
              <p className="text-slate-600">
                Integrate KATWARN, WEA, J-ALERT, and 50+ official alert systems worldwide in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Interactive Risk Map</h3>
              <p className="text-slate-600">
                Visualize global threats in real-time. Filter by category: weather, terror, infrastructure, and more.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Predictive Intelligence</h3>
              <p className="text-slate-600">
                AI-powered forecasts predict emerging threats before they impact your travel plans.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Proactive Notifications</h3>
              <p className="text-slate-600">
                Get instant push alerts for threats near your location or planned destinations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Emergency Services</h3>
              <p className="text-slate-600">
                One-tap access to local emergency numbers, embassies, and hospitals worldwide.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Global Coverage</h3>
              <p className="text-slate-600">
                From air raid alerts in Ukraine to bushfire warnings in Australia - we cover it all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12">
            Choose the plan that fits your travel style
          </p>

          <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="border-2 border-slate-200 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Explorer</h3>
              <div className="text-4xl font-bold text-slate-900 mb-6">Free</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Basic Alerts
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Risk Map View
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Embassy Contacts
                </li>
              </ul>
              <button className="w-full border-2 border-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:border-slate-300 transition">
                Get Started
              </button>
            </div>

            {/* Guardian Plan */}
            <div className="border-2 border-blue-600 p-8 rounded-2xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Guardian</h3>
              <div className="text-4xl font-bold text-slate-900 mb-1">€9.99<span className="text-lg font-normal text-slate-600">/month</span></div>
              <div className="text-slate-600 mb-6">€79.99/year (save 33%)</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time Alerts
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  SOS Button
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Offline Access
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  50+ Alert Systems
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Start Free Trial
              </button>
            </div>

            {/* Guardian Pro */}
            <div className="border-2 border-slate-200 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Guardian Pro</h3>
              <div className="text-4xl font-bold text-slate-900 mb-1">€19.99<span className="text-lg font-normal text-slate-600">/month</span></div>
              <div className="text-slate-600 mb-6">€179.99/year (save 25%)</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Everything in Guardian
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Live Human Support
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Family Tracking
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority Alerts
                </li>
              </ul>
              <button className="w-full border-2 border-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:border-slate-300 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Your Risk-Free Journey Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of travelers who trust RiskVector for their safety intelligence.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition shadow-lg"
          >
            Launch Dashboard →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold text-white">RiskVector</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="text-center text-sm">
            © 2026 RiskVector.app. All rights reserved. Built for travelers, by travelers.
          </div>
        </div>
      </footer>
    </main>
  )
}
