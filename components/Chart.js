'use client';
import Plot from "react-plotly.js";

export default function ChartMacro({ data }) {
  // si data est un objet, on le transforme en tableau
  const arr = Array.isArray(data) ? data : Object.values(data || {});

  const zones = arr.map((d) => d.zone);
  const totalSales = arr.map((d) => d.totalSales || 0);
  const totalUnits = arr.map((d) => d.totalUnits || 0);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Vue macro – Ventes totales et unités par zone
      </h2>
      <Plot
        data={[
          {
            type: "bar",
            x: zones,
            y: totalSales,
            text: totalSales.map((v) => Number(v).toFixed(2)),
            textposition: "outside",
            name: "Vente Totale (FCFA)",
            marker: { color: "rgba(55,128,191,0.7)" },
          },
          {
            type: "scatter",
            x: zones,
            y: totalUnits,
            text: totalUnits.map((u) => u.toString()),
            textposition: "top center",
            name: "Unités vendues",
            yaxis: "y2",
            mode: "lines+markers+text",
            marker: { color: "rgba(255,99,71,0.7)" },
          },
        ]}
        layout={{
          title: "Vue macro – Ventes totales et unités par zone",
          xaxis: { title: "Zones", tickangle: -45 },
          yaxis: { title: "Vente Totale (FCFA)" },
          yaxis2: { title: "Unités vendues", overlaying: "y", side: "right" },
        }}
        style={{ width: "100%", height: "600px" }}
        config={{ responsive: true }}
      />
    </div>
  );
}
