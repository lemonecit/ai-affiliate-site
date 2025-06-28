import SEO from '@/components/SEO'
import Link from 'next/link'

export default function Contact() {
  return (
    <>
      <SEO 
        title="Kontakta Oss - AI Affiliate Platform"
        description="Kontakta AI Affiliate Platform för frågor, support eller feedback om våra AI-drivna produktrekommendationer."
        url="/contact"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Kontakta Oss
              </h1>
              <p className="text-xl text-gray-600">
                Vi hjälper gärna till med frågor om vår AI-driven produktplattform
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Contact Information */}
              <div className="space-y-8">
                
                {/* General Contact */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Allmän kontakt</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">E-post</h3>
                        <p className="text-gray-600">info@ai-affiliate-platform.com</p>
                        <p className="text-sm text-gray-500">Svarstid: Inom 24 timmar</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Plats</h3>
                        <p className="text-gray-600">Sverige</p>
                        <p className="text-sm text-gray-500">Remote-first företag</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Support-tider</h3>
                        <p className="text-gray-600">Måndag - Fredag</p>
                        <p className="text-sm text-gray-500">09:00 - 17:00 CET</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specialized Contact */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Specialiserad kontakt</h2>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-400 pl-4">
                      <h3 className="font-semibold text-gray-900">Teknisk support</h3>
                      <p className="text-gray-600">support@ai-affiliate-platform.com</p>
                      <p className="text-sm text-gray-500">För tekniska problem och buggrapporter</p>
                    </div>

                    <div className="border-l-4 border-green-400 pl-4">
                      <h3 className="font-semibold text-gray-900">Affärspartnerskap</h3>
                      <p className="text-gray-600">partnerships@ai-affiliate-platform.com</p>
                      <p className="text-sm text-gray-500">Affiliate-program och samarbeten</p>
                    </div>

                    <div className="border-l-4 border-purple-400 pl-4">
                      <h3 className="font-semibold text-gray-900">Integritet & Juridik</h3>
                      <p className="text-gray-600">legal@ai-affiliate-platform.com</p>
                      <p className="text-sm text-gray-500">GDPR-förfrågningar och juridiska frågor</p>
                    </div>

                    <div className="border-l-4 border-orange-400 pl-4">
                      <h3 className="font-semibold text-gray-900">Media & PR</h3>
                      <p className="text-gray-600">press@ai-affiliate-platform.com</p>
                      <p className="text-sm text-gray-500">Pressförfrågningar och intervjuer</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Följ oss</h2>
                  
                  <div className="space-y-3">
                    <p className="text-gray-600 mb-4">
                      Håll dig uppdaterad med de senaste trenderna och produktrekommendationerna:
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      <a 
                        href="#" 
                        className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <span>📘</span>
                        <span>Facebook</span>
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center space-x-2 bg-sky-50 text-sky-700 px-4 py-2 rounded-lg hover:bg-sky-100 transition-colors"
                      >
                        <span>🐦</span>
                        <span>Twitter</span>
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center space-x-2 bg-pink-50 text-pink-700 px-4 py-2 rounded-lg hover:bg-pink-100 transition-colors"
                      >
                        <span>📸</span>
                        <span>Instagram</span>
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <span>💼</span>
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skicka meddelande</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        Förnamn *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Ditt förnamn"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Efternamn *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Ditt efternamn"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-postadress *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="din@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Ämne *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Välj ämne</option>
                      <option value="general">Allmän fråga</option>
                      <option value="technical">Teknisk support</option>
                      <option value="partnership">Affärspartnerskap</option>
                      <option value="feedback">Feedback</option>
                      <option value="press">Media/Press</option>
                      <option value="privacy">Integritet/GDPR</option>
                      <option value="other">Annat</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Meddelande *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                      placeholder="Beskriv din fråga eller feedback..."
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="privacy"
                      name="privacy"
                      required
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-700">
                      Jag accepterar{' '}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        integritetspolicyn
                      </Link>{' '}
                      och godkänner att mina uppgifter behandlas för att svara på min förfrågan. *
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Skicka meddelande
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    * Obligatoriska fält. Vi svarar normalt inom 24 timmar.
                  </p>
                </form>
              </div>

            </div>

            {/* FAQ Link */}
            <div className="text-center mt-12">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Har du en snabb fråga?
                </h2>
                <p className="text-gray-600 mb-6">
                  Kolla våra vanliga frågor eller utforska vår plattform för att hitta svar snabbt.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/dashboard" 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Utforska Platform
                  </Link>
                  <Link 
                    href="/about" 
                    className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Läs mer om oss
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
