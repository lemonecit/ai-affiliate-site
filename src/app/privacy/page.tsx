import SEO from '@/components/SEO'
import Link from 'next/link'

export default function Privacy() {
  return (
    <>
      <SEO 
        title="Integritetspolicy - AI Affiliate Platform"
        description="Läs vår integritetspolicy om hur vi hanterar cookies, affiliate-länkar och användardata i enlighet med GDPR."
        url="/privacy"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Integritetspolicy
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
                  Denna integritetspolicy beskriver hur AI Affiliate Platform samlar in, 
                  använder och skyddar din information när du besöker vår webbplats.
                </p>
              </div>

              {/* Information We Collect */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information vi samlar in</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Automatiskt insamlad information</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>IP-adress och webbläsarinformation</li>
                      <li>Besökta sidor och klickmönster</li>
                      <li>Referral-källor och söktermer</li>
                      <li>Enhetstyp och operativsystem</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Frivilligt lämnad information</h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>E-postadress (om du prenumererar på updates)</li>
                      <li>Kommentarer och feedback</li>
                      <li>Kontaktuppgifter via kontaktformulär</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies och Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vi använder cookies och liknande teknologier för att:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Förbättra användarupplevelsen:</strong> Komma ihåg dina preferenser och inställningar</li>
                  <li><strong>Analysera trafik:</strong> Förstå hur besökare interagerar med vår webbplats</li>
                  <li><strong>Affiliate tracking:</strong> Spåra klick på produktlänkar för provisionsändamål</li>
                  <li><strong>Marknadsföring:</strong> Visa relevanta annonser och innehåll</li>
                </ul>
                
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Cookie-kontroll:</strong> Du kan kontrollera cookies genom dina webbläsarinställningar. 
                    Observera att vissa funktioner kanske inte fungerar korrekt om cookies inaktiveras.
                  </p>
                </div>
              </div>

              {/* Affiliate Links */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Affiliate-länkar och Commissioner</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <p className="text-yellow-800 font-semibold">
                    ⚠️ VIKTIG INFORMATION: Denna webbplats innehåller affiliate-länkar.
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vi deltar i flera affiliate-program, inklusive:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Amazon Associates:</strong> Som Amazon Associate tjänar vi på kvalificerade köp</li>
                  <li><strong>AliExpress Affiliate Program:</strong> Vi får provision på köp via våra AliExpress-länkar</li>
                  <li><strong>Andra partners:</strong> Vi kan ha partnerskap med andra återförsäljare</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  När du klickar på en affiliate-länk och gör ett köp får vi en liten provision, 
                  utan extra kostnad för dig. Detta hjälper oss att driva webbplatsen och 
                  fortsätta tillhandahålla gratis innehåll.
                </p>
              </div>

              {/* How We Use Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Hur vi använder information</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Förbättra och anpassa webbplatsens innehåll och funktioner</li>
                  <li>Analysera användarmönster och trender</li>
                  <li>Skicka relevanta produktrekommendationer (om du prenumererat)</li>
                  <li>Svara på förfrågningar och support</li>
                  <li>Följa juridiska krav och skydda våra rättigheter</li>
                </ul>
              </div>

              {/* Data Sharing */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Delning av information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vi säljer, handlar eller hyr inte ut din personliga information till tredje part. 
                  Vi kan dock dela information i följande fall:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Analytics-tjänster:</strong> Google Analytics för webbanalys</li>
                  <li><strong>Affiliate-partners:</strong> Anonymiserad klickdata för spårning av provisioner</li>
                  <li><strong>Juridiska krav:</strong> Om det krävs enligt lag eller för att skydda våra rättigheter</li>
                </ul>
              </div>

              {/* GDPR Rights */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Dina rättigheter (GDPR)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Om du är EU-medborgare har du följande rättigheter:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Rätt till information:</strong> Veta vilken data vi samlar och varför</li>
                  <li><strong>Rätt till åtkomst:</strong> Få en kopia av dina personuppgifter</li>
                  <li><strong>Rätt till rättelse:</strong> Korrigera felaktig information</li>
                  <li><strong>Rätt till radering:</strong> Be oss ta bort dina uppgifter</li>
                  <li><strong>Rätt till begränsning:</strong> Begränsa hur vi använder dina uppgifter</li>
                  <li><strong>Rätt till portabilitet:</strong> Få dina data i ett strukturerat format</li>
                  <li><strong>Rätt till invändning:</strong> Invända mot viss behandling av dina uppgifter</li>
                </ul>
              </div>

              {/* Data Security */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Datasäkerhet</h2>
                <p className="text-gray-700 leading-relaxed">
                  Vi implementerar lämpliga tekniska och organisatoriska säkerhetsåtgärder 
                  för att skydda din information mot obehörig åtkomst, ändring, utlämnande 
                  eller förstörelse. Detta inkluderar SSL-kryptering, säkra servrar och 
                  regelbundna säkerhetsuppdateringar.
                </p>
              </div>

              {/* Children's Privacy */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Barns integritet</h2>
                <p className="text-gray-700 leading-relaxed">
                  Vår webbplats är inte riktad till barn under 13 år. Vi samlar inte 
                  medvetet in personlig information från barn under 13 år. Om du är 
                  förälder och upptäcker att ditt barn har lämnat personlig information, 
                  vänligen kontakta oss.
                </p>
              </div>

              {/* Changes to Policy */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ändringar av denna policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Vi kan uppdatera denna integritetspolicy från tid till annan. 
                  Väsentliga ändringar kommer att meddelas på vår webbplats. 
                  Din fortsatta användning av webbplatsen efter ändringar innebär 
                  att du accepterar den uppdaterade policyn.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakta oss</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Om du har frågor om denna integritetspolicy eller vill utöva dina GDPR-rättigheter, 
                  kontakta oss:
                </p>
                <div className="text-gray-700">
                  <p><strong>E-post:</strong> privacy@ai-affiliate-platform.com</p>
                  <p><strong>Webbplats:</strong> <Link href="/contact" className="text-blue-600 hover:underline">Kontaktformulär</Link></p>
                  <p><strong>Svarstid:</strong> Vi strävar efter att svara inom 30 dagar</p>
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
