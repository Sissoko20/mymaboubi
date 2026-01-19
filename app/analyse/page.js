'use client';
import { useState } from "react";
import { parseExcel } from "../../utils/parseExcel";
import Chart from "../../components/Chart";
import Dropzone from "../../components/Dropzone";
import Sidebar from "../../components/Sidebar"; // 👉 import du sidebar existant

export default function Analyse() {
  const [zones, setZones] = useState({});
  const [selectedZone, setSelectedZone] = useState(null);

  const handleFileUpload = async (file) => {
    const parsed = await parseExcel(file);
    setZones(parsed);
    setSelectedZone(Object.keys(parsed)[0]); // sélectionner la première zone
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar à gauche */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="flex-1 p-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
          Dashboard Ventes par Zone
        </h1>

        <Dropzone onFile={handleFileUpload} />

        {Object.keys(zones).length > 0 && (
          <div className="mt-6">
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

            {selectedZone && <Chart data={zones[selectedZone]} zone={selectedZone} />}
          </div>
        )}
      </main>
    </div>
  );
}
