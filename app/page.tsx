import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  return (
    <main className="min-h-screen gradient-mesh">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-glow-gold">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">RiskVector</span>
                <span className="hidden sm:inline-block ml-2 text-xs text-amber-500 font-semibold uppercase tracking-wider">Enterprise</span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#security" className="text-sm text-gray-400 hover:text-white transition-colors">
                Security
              </Link>
              <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#enterprise" className="text-sm text-gray-400 hover:text-white transition-colors">
                Enterprise
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link href="/dashboard" className="btn-gold text-sm text-black">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float delay-300" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Trust Badge */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-gray-300">Trusted by <span className="text-white font-semibold">2,400+</span> security teams worldwide</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up delay-100">
              Global Risk Intelligence
              <br />
              <span className="text-gradient-gold">For The Modern Traveler</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Real-time threat monitoring, predictive analytics, and instant alerts across 195 countries. 
              <span className="text-white"> Know your risk before you go.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
              <Link href="/dashboard" className="btn-gold text-base text-black flex items-center gap-2">
                <span>Launch Dashboard</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button className="btn-ghost text-base flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Logos */}
            <div className="flex flex-col items-center gap-4 animate-fade-in-up delay-400">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Trusted by leading organizations</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
                {['UN', 'NATO', 'WHO', 'Red Cross', 'Fortune 500'].map((org) => (
                  <div key={org} className="text-gray-400 text-sm font-semibold tracking-wider">
                    {org}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto animate-fade-in-up delay-500">
            {[
              { value: '195', label: 'Countries', icon: '🌍' },
              { value: '50+', label: 'Alert Systems', icon: '📡' },
              { value: '<5s', label: 'Alert Latency', icon: '⚡' },
              { value: '99.9%', label: 'Uptime SLA', icon: '✓' },
            ].map((stat, i) => (
              <div key={i} className="card-glass text-center py-6">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gradient-gold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full glass text-xs text-amber-500 font-semibold uppercase tracking-wider mb-4">
              Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Complete Risk Intelligence
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Enterprise-grade security platform trusted by organizations worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature Cards */}
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
                title: 'Multi-Source Alerts',
                description: 'Integrate KATWARN, WEA, J-ALERT, and 50+ official alert systems worldwide in real-time.',
                color: 'blue',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
                title: 'Interactive Risk Map',
                description: 'Visualize global threats in real-time. Filter by category: weather, terror, infrastructure, and more.',
                color: 'gold',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'Predictive Intelligence',
                description: 'AI-powered forecasts predict emerging threats before they impact your travel plans.',
                color: 'purple',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Mobile-First Design',
                description: 'Native iOS and Android apps with offline access and push notifications.',
                color: 'emerald',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Team Management',
                description: 'Monitor your entire team\'s safety with real-time location tracking and group alerts.',
                color: 'blue',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Enterprise Security',
                description: 'SOC 2 Type II certified. GDPR compliant. End-to-end encryption for all data.',
                color: 'gold',
              },
            ].map((feature, i) => (
              <div key={i} className="card-premium group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  feature.color === 'gold' ? 'bg-amber-500/10 text-amber-500' :
                  feature.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                  feature.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                  'bg-emerald-500/10 text-emerald-500'
                } group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1 rounded-full glass text-xs text-amber-500 font-semibold uppercase tracking-wider mb-4">
                Enterprise Security
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                Built for the world's most
                <span className="text-gradient-gold"> security-conscious organizations</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                RiskVector meets the highest standards for security, compliance, and privacy. 
                Your data is encrypted at rest and in transit with AES-256.
              </p>
              
              <div className="space-y-4">
                {[
                  { label: 'SOC 2 Type II', desc: 'Certified' },
                  { label: 'GDPR', desc: 'Compliant' },
                  { label: 'ISO 27001', desc: 'Certified' },
                  { label: 'HIPAA', desc: 'Ready' },
                ].map((cert, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-semibold">{cert.label}</span>
                    <span className="text-gray-500">— {cert.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-glass p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 rounded-xl bg-white/5">
                  <div className="text-4xl font-bold text-gradient-gold mb-2">99.99%</div>
                  <div className="text-sm text-gray-400">Uptime SLA</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-white/5">
                  <div className="text-4xl font-bold text-gradient-blue mb-2">256-bit</div>
                  <div className="text-sm text-gray-400">Encryption</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-white/5">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-white/5">
                  <div className="text-4xl font-bold text-purple-400 mb-2">5 min</div>
                  <div className="text-sm text-gray-400">Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full glass text-xs text-amber-500 font-semibold uppercase tracking-wider mb-4">
              Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Choose the plan that fits your organization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Explorer */}
            <div className="card-premium">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Explorer</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">Free</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">For individual travelers</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['Basic alerts', 'Risk map view', '5 countries monitored', '24h alert history'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn-ghost w-full">Get Started</button>
            </div>

            {/* Guardian - Featured */}
            <div className="card-premium relative border-amber-500/50">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-gold text-black text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Guardian</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gradient-gold">€29</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">€290/year (save 17%)</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['Real-time alerts', '50+ alert systems', 'Unlimited countries', '30-day history', 'SOS button', 'Offline access'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn-gold w-full text-black">Start Free Trial</button>
            </div>

            {/* Enterprise */}
            <div className="card-premium">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">For organizations with 50+ users</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['Everything in Guardian', 'Unlimited team members', 'Dedicated support', 'Custom integrations', 'SLA guarantees', 'On-premise option'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn-ghost w-full">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="card-glass p-12 relative overflow-hidden">
            <div className="absolute inset-0 gradient-mesh opacity-50" />
            <div className="relative">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Start Your Risk-Free Journey Today
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join thousands of security professionals who trust RiskVector
              </p>
              <Link href="/dashboard" className="btn-gold text-lg text-black inline-flex items-center gap-2">
                <span>Launch Dashboard</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-lg font-bold">RiskVector</span>
              </div>
              <p className="text-sm text-gray-500">
                Enterprise-grade risk intelligence for modern organizations.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2026 RiskVector.app. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-600">Made with precision in Germany 🇩🇪</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
