import Sidebar from "../components/Sidebar";
import Link from "next/link";

export default function Home() {
  return (
   <div className="min-h-screen bg-background">
  {/* Sidebar cachée sur mobile */}
  <Sidebar />

  <main className="flex-1 p-4 md:p-10 bg-gray-50 text-gray-800 overflow-auto">

    <p className="text-gray-600 mb-6">
      Bienvenue dans votre application d'analyse de données.
    </p>

    <section className="mb-10">
      <h2 className="text-lg md:text-xl font-semibold mb-4">⚙️ Actions rapides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/ubipharm" className="block max-w-sm mx-auto">
          <div className="bg-white shadow p-6 rounded-lg hover:bg-blue-50 transition">
            <h3 className="text-lg font-bold mb-2">📊 Extraction Ubipharm</h3>
            <p className="text-gray-600 mb-6">Analyse des ventes Ubipharm.</p>
            
          </div>
        </Link>

        <Link href="/laborex" className="block max-w-sm mx-auto">
          <div className="bg-white shadow p-6 rounded-lg hover:bg-blue-50 transition">
            <h3 className="text-lg font-bold mb-2">💰 Extraction Laborex</h3>
            <p className="text-gray-600 mb-6">Analyse des ventes Laborex.</p>
            
          </div>
        </Link>


           <Link href="/camed" className="block max-w-sm mx-auto">
          <div className="bg-white shadow p-6 rounded-lg hover:bg-blue-50 transition">
            <h3 className="text-lg font-bold mb-2">💰 Extraction Camed</h3>
            <p className="text-gray-600 mb-6">Analyse des ventes Camed.</p>
            
          </div>
        </Link>


   <Link href="/analyse" className="block max-w-sm mx-auto">
          <div className="bg-white shadow p-6 rounded-lg hover:bg-blue-50 transition">
            <h3 className="text-lg font-bold mb-2">📊 Analysez vos données </h3>
         
            
          </div>
        </Link>





      </div>
    </section>
  </main>
</div>

  );
}
