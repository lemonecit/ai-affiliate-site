import Link from 'next/link'
import { ShoppingBag, TrendingUp, Users, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">AI Affiliate Store</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-500 transition-colors">
                Hem
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-primary-500 transition-colors">
                Produkter
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-primary-500 transition-colors">
                Kategorier
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-500 transition-colors">
                Dashboard
              </Link>
              <Link href="/admin" className="btn-primary">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              AI-Driven Product Discovery
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto animate-slide-up">
              Upptäck de bästa produkterna från Amazon och AliExpress med hjälp av AI. 
              Få personliga rekommendationer, prisjämförelser och exklusiva erbjudanden.
            </p>
            <div className="flex justify-center space-x-4 animate-slide-up">
              <Link href="/products" className="btn-secondary">
                Utforska Produkter
              </Link>
              <Link href="/dashboard" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Se Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Kraftfulla AI-funktioner
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vår plattform använder avancerad AI för att leverera de bästa affiliate-upplevelserna
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <TrendingUp className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Smart Produktanalys</h3>
              <p className="text-gray-600">
                AI analyserar produkter från Amazon och AliExpress för att hitta de bästa erbjudandena
              </p>
            </div>

            <div className="card text-center">
              <Users className="h-12 w-12 text-secondary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Personliga Rekommendationer</h3>
              <p className="text-gray-600">
                Få skräddarsydda produktförslag baserat på användarbeteende och preferenser
              </p>
            </div>

            <div className="card text-center">
              <BarChart3 className="h-12 w-12 text-accent-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Avancerad Analytics</h3>
              <p className="text-gray-600">
                Spåra klick, konverteringar och intäkter med detaljerad rapportering
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">10,000+</div>
              <div className="text-gray-600">Produkter Indexerade</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-500 mb-2">95%</div>
              <div className="text-gray-600">AI Noggrannhet</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-500 mb-2">24/7</div>
              <div className="text-gray-600">Prisövervakning</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">50+</div>
              <div className="text-gray-600">Kategorier</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ShoppingBag className="h-6 w-6 text-primary-500" />
                <span className="ml-2 text-lg font-semibold">AI Affiliate Store</span>
              </div>
              <p className="text-gray-400">
                AI-driven affiliate marketing platform för smarta produktrekommendationer.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Produkter</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/categories/electronics" className="hover:text-white transition-colors">Elektronik</Link></li>
                <li><Link href="/categories/fashion" className="hover:text-white transition-colors">Mode</Link></li>
                <li><Link href="/categories/home" className="hover:text-white transition-colors">Hem & Trädgård</Link></li>
                <li><Link href="/categories/sports" className="hover:text-white transition-colors">Sport</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Företag</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">Om Oss</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Kontakt</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Integritet</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Villkor</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Hjälp</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/api-docs" className="hover:text-white transition-colors">API Docs</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AI Affiliate Store. Alla rättigheter förbehållna.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
