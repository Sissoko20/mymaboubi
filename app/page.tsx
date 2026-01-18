import Sidebar from "../components/Sidebar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-10 bg-gray-50 text-gray-800 overflow-auto">
        <h1 className="text-3xl font-bold mb-2">📊 MABOU BI</h1>
        <p className="text-gray-600 mb-6">
          Bienvenue dans votre application d'analyse de données.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">⚙️ Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carte Ubipharm */}
            <Link href="/ubipharm" className="block">
              <div className="bg-white shadow p-6 rounded-lg hover:bg-blue-50 transition">
                <h3 className="text-lg font-bold mb-2">📊 Extraction Ubipharm</h3>
                <p className="text-gray-600 mb-6">Analyse des ventes Ubipharm.</p>
                <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded">
                  ➕ Nouvelle base
                </div>
              </div>
            </Link>

            {/* Carte Laborex */}
            <Link href="/laborex" className="block">
              <div className="bg-white shadow p-6 rounded-lg hover:bg-blue-50 transition">
                <h3 className="text-lg font-bold mb-2">💰 Extraction Laborex</h3>
                <p className="text-gray-600 mb-6">Analyse des ventes Laborex.</p>
                <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded">
                  ➕ Nouvelle base
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
