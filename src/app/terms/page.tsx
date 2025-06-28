import SEO from '@/components/SEO'
import Link from 'next/link'

export default function Terms() {
  return (
    <>
      <SEO 
        title="Användarvillkor - AI Affiliate Platform"
        description="Läs våra användarvillkor, affiliate disclosure och disclaimer för AI Affiliate Platform."
        url="/terms"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Användarvillkor
              </h1>
              <p className="text-gray-600">
                Senast uppdaterad: Juni 2025
              </p>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
              
              {/* Intro */}
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Genom att besöka och använda AI Affiliate Platform accepterar du dessa användarvillkor. 
                  Läs igenom dem noggrant innan du använder vår webbplats.
                </p>
              </div>

              {/* Affiliate Disclosure */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">🔗 Affiliate Disclosure</h2>
                <div className="space-y-3 text-blue-800">
                  <p className="font-semibold">
                    VIKTIG INFORMATION: Denna webbplats innehåller affiliate-länkar och vi tjänar provisioner på kvalificerade köp.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Amazon Associates:</strong> Som Amazon Associate tjänar vi på kvalificerade köp via Amazon-länkar</li>
                    <li><strong>AliExpress Partner:</strong> Vi är partners med AliExpress och får provision på köp via våra länkar</li>
                    <li><strong>Andra partners:</strong> Vi kan ha partnerskap med andra återförsäljare och tjänster</li>
                  </ul>
                  <p className="text-sm mt-3">
                    Du betalar aldrig extra för produkter köpta via våra länkar. Provisionen kommer från återförsäljaren 
                    och hjälper oss att driva webbplatsen och tillhandahålla gratis innehåll.
                  </p>
                </div>
              </div>

              {/* Service Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tjänstebeskrivning</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  AI Affiliate Platform tillhandahåller:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>AI-drivna produktrekommendationer baserade på Google Trends-data</li>
                  <li>Prisjämförelser och produktanalys</li>
                  <li>Trending produkter och marknadsinsikter</li>
                  <li>Affiliate-länkar till produkter från våra partners</li>
                  <li>SEO-optimerat innehåll och produktguider</li>
                </ul>
              </div>

              {/* User Responsibilities */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Användaransvar</h2>
                <p className="text-gray-700 leading-relaxed mb-4">Som användare förbinder du dig att:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Använda webbplatsen för lagliga ändamål endast</li>
                  <li>Inte missbruka eller försöka störa webbplatsens funktionalitet</li>
                  <li>Respektera våra och tredje parts immateriella rättigheter</li>
                  <li>Inte använda automatiserade system för att komma åt webbplatsen</li>
                  <li>Följa alla tillämpliga lagar och förordningar</li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h2 className="text-2xl font-bold text-yellow-900 mb-4">⚠️ Disclaimer</h2>
                <div className="space-y-3 text-yellow-800">
                  <div>
                    <h3 className="font-semibold mb-2">Produktrekommendationer</h3>
                    <p>
                      Våra produktrekommendationer baseras på AI-analys, trender och data. 
                      Vi garanterar inte produktkvalitet, prestanda eller lämplighet för specifika ändamål.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Prisinformation</h3>
                    <p>
                      Priser och tillgänglighet kan ändras utan förvarning. Kontrollera alltid 
                      aktuella priser och villkor hos återförsäljaren innan köp.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Tredje parts innehåll</h3>
                    <p>
                      Vi ansvarar inte för innehåll, produkter eller tjänster från tredje part 
                      som länkas från vår webbplats.
                    </p>
                  </div>
                </div>
              </div>

              {/* Accuracy */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Informationsansvar</h2>
                <p className="text-gray-700 leading-relaxed">
                  Vi strävar efter att tillhandahålla korrekt och uppdaterad information, men vi kan inte 
                  garantera att all information är komplett, aktuell eller felfri. Användare bör alltid 
                  verifiera produktinformation, priser och villkor direkt hos återförsäljaren innan köp.
                </p>
              </div>

              {/* Intellectual Property */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Immateriella rättigheter</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Allt innehåll på denna webbplats, inklusive text, bilder, logotyper, design och kod, 
                  ägs av AI Affiliate Platform eller våra licensgivare och skyddas av upphovsrätt och 
                  andra immateriella rättigheter.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Du får använda webbplatsen för personligt, icke-kommersiellt bruk. Reproduktion, 
                  distribution eller kommersiell användning utan skriftligt tillstånd är förbjuden.
                </p>
              </div>

              {/* Third Party Links */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Länkar till tredje part</h2>
                <p className="text-gray-700 leading-relaxed">
                  Vår webbplats innehåller länkar till externa webbplatser och tjänster. Vi ansvarar inte 
                  för innehållet, integritetspolicyer eller praxis hos dessa tredje parter. Användning av 
                  externa webbplatser sker på egen risk och enligt deras respektive villkor.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ansvarsbegränsning</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  AI Affiliate Platform ansvarar inte för:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Direkta, indirekta, tillfälliga eller följdskador</li>
                  <li>Förlust av data, vinster eller affärsmöjligheter</li>
                  <li>Avbrott i tjänsten eller tekniska problem</li>
                  <li>Produkter eller tjänster köpta via affiliate-länkar</li>
                  <li>Beslut baserade på vår information eller rekommendationer</li>
                </ul>
              </div>

              {/* Privacy */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Integritet</h2>
                <p className="text-gray-700 leading-relaxed">
                  Vår hantering av personuppgifter regleras av vår{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                    Integritetspolicy
                  </Link>
                  , som är en del av dessa användarvillkor.
                </p>
              </div>

              {/* Modifications */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ändringar av villkor</h2>
                <p className="text-gray-700 leading-relaxed">
                  Vi förbehåller oss rätten att uppdatera dessa användarvillkor när som helst. 
                  Väsentliga ändringar kommer att meddelas på webbplatsen. Din fortsatta användning 
                  efter ändringar innebär att du accepterar de uppdaterade villkoren.
                </p>
              </div>

              {/* Termination */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Uppsägning</h2>
                <p className="text-gray-700 leading-relaxed">
                  Vi kan när som helst avsluta eller begränsa din åtkomst till webbplatsen om du 
                  bryter mot dessa villkor eller för andra rimliga skäl. Du kan när som helst 
                  sluta använda webbplatsen.
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tillämplig lag</h2>
                <p className="text-gray-700 leading-relaxed">
                  Dessa användarvillkor regleras av svensk lag. Eventuella tvister ska lösas i 
                  svenska domstolar, eller genom medling/skiljeförfarande om båda parter är överens.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Om du har frågor om dessa användarvillkor, kontakta oss:
                </p>
                <div className="text-gray-700">
                  <p><strong>E-post:</strong> legal@ai-affiliate-platform.com</p>
                  <p><strong>Webbplats:</strong> <Link href="/contact" className="text-blue-600 hover:underline">Kontaktformulär</Link></p>
                  <p><strong>Adress:</strong> AI Affiliate Platform, Sverige</p>
                </div>
              </div>

            </div>

            {/* Back to site */}
            <div className="text-center mt-8">
              <Link 
                href="/" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Tillbaka till startsidan
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
