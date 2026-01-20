'use client';
import { useState } from "react";
import { parseExcel } from "../../utils/parseExcel";
import { aggregateByWholesaler, topProducts } from "../../utils/aggregateData";
import Chart from "../../components/Chart";
import Dropzone from "../../components/Dropzone";
import WholesalerChart from "../../components/WholesalerChart";
import TopProductsChart from "../../components/TopProductsChart";
import Sidebar from "../../components/Sidebar";




export default function Analyse() {
  const [zones, setZones] = useState({});
  const [selectedZone, setSelectedZone] = useState(null);

  const handleFileUpload = async (file) => {
    const parsed = await parseExcel(file);
    setZones(parsed);
    setSelectedZone(Object.keys(parsed)[0]);
  };

  const wholesalerData = Object.keys(zones).length > 0 ? aggregateByWholesaler(zones) : [];
  const top10 = Object.keys(zones).length > 0 ? topProducts(zones) : [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Ventes par Zone</h1>
        <Dropzone onFile={handleFileUpload} />

        {Object.keys(zones).length > 0 && (
          <>
            {/* Sélecteur de zone */}
            <div className="flex flex-wrap gap-2 mb-4 text-gray-800">
              {Object.keys(zones).map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-4 py-2 rounded-lg font-medium 
                    ${selectedZone === zone ? "bg-blue-600 text-white" : "bg-white shadow"}`}
                >
                  {zone}
                </button>
              ))}
            </div>

            {/* Graphique zone sélectionnée */}
            {selectedZone && <Chart data={zones[selectedZone]} zone={selectedZone} />}

            {/* Analyse globale par grossiste */}
            <div className="mt-10">
              <WholesalerChart data={wholesalerData} />
            </div>

            {/* Top 10 produits */}
            <div className="mt-10">
              <TopProductsChart products={top10} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
