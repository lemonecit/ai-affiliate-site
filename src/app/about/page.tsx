import SEO from '@/components/SEO'
import Link from 'next/link'

export default function About() {
  return (
    <>
      <SEO 
        title="Om Oss - AI Affiliate Platform"
        description="Vi hjälper konsumenter att upptäcka trending produkter och hitta de bästa erbjudandena genom AI-driven marknadsanalys och Google Trends-data."
        url="/about"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Om Oss
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Vi är en AI-driven plattform som hjälper konsumenter att upptäcka trending produkter 
                och hitta de bästa erbjudandena online innan de blir mainstream.
              </p>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
              
              {/* Mission */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Vårt Uppdrag</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Genom att använda Google Trends-data och maskininlärning analyserar vi marknaden 
                  för att identifiera produkter som blir populära innan de når mainstream. 
                  Detta ger våra användare möjligheten att vara först med de senaste trenderna.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Vårt mål är att spara tid och pengar för våra användare genom intelligent 
                  produktdiscovery, prisanalys och transparenta produktrekommendationer.
                </p>
              </div>

              {/* How We Work */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Hur Vi Arbetar</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">🤖 AI-Analys</h3>
                    <p className="text-blue-800">
                      Vi använder avancerade algoritmer för att analysera trender, 
                      priser och användarrecensioner från flera källor.
                    </p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-purple-900 mb-3">📊 Google Trends</h3>
                    <p className="text-purple-800">
                      Real-time data från Google Trends hjälper oss att upptäcka 
                      emerging trends och säsongsmönster.
                    </p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-green-900 mb-3">🎯 Personalisering</h3>
                    <p className="text-green-800">
                      Våra rekommendationer anpassas baserat på aktuella trender 
                      och användarpreferenser.
                    </p>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-orange-900 mb-3">💰 Transparent Prissättning</h3>
                    <p className="text-orange-800">
                      Vi hjälper dig hitta bästa priserna och erbjuder transparent 
                      information om våra affiliate-partnerskap.
                    </p>
                  </div>
                </div>
              </div>

              {/* Affiliate Disclosure */}
              <div className="mb-10 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Affiliate Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Viktig information:</strong> Denna webbplats innehåller affiliate-länkar till produkter 
                  från Amazon, AliExpress och andra återförsäljare. Vi kan få en provision när du 
                  köper produkter via våra länkar, utan extra kostnad för dig.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Som Amazon Associate tjänar vi på kvalificerade köp. Alla våra produktrekommendationer 
                  baseras på oberoende analys och trending data, inte på provisionsstorlek.
                </p>
              </div>

              {/* Company Info */}
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Företagsinformation</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Grundat</h3>
                    <p className="text-gray-700">Juni 2025</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Fokusområden</h3>
                    <p className="text-gray-700">Trending produkter, AI-driven discovery, prisjämförelser</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Plattform</h3>
                    <p className="text-gray-700">Next.js, AI/ML, Google Trends API</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Kontakt</h3>
                    <p className="text-gray-700">
                      <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
                        Kontakta oss här
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Redo att upptäcka trending produkter?</h2>
              <p className="text-blue-100 mb-6">
                Utforska våra AI-drivna produktrekommendationer och var först med de senaste trenderna.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard" 
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Se Trending Produkter
                </Link>
                <Link 
                  href="/content/trending-hub-2025" 
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Läs Våra Guides
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
