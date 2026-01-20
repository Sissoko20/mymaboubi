'use client';
import Plot from "react-plotly.js";

export default function Chart({ data, zone }) {
  const products = data.map((d) => d.product);
  const values = data.map((d) => d.nrv);
  const units = data.map((d) => d.units);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Analyse des ventes par produits – Zone : {zone}
      </h2>
      <Plot
        data={[
          {
            type: "bar",
            x: products,
            y: values,
            name: "Valeur (NRV/CIF en FCFA)",
            marker: { color: "rgba(55,128,191,0.7)" },
          },
          {
            type: "scatter",
            x: products,
            y: units,
            name: "Unités vendues (boîtes)",
            yaxis: "y2",
            mode: "lines+markers",
            marker: { color: "rgba(255,99,71,0.7)" },
          },
        ]}
        layout={{
          title: {
            text: `Analyse des ventes par produits - Zone ${zone}`,
            font: { size: 20, color: "#333" },
          },
          autosize: true,
          margin: { t: 60, r: 60, b: 120, l: 80 },
          xaxis: {
            title: "Produits",
            tickangle: -45, // rotation des étiquettes pour lisibilité
          },
          yaxis: {
            title: "Valeur (NRV/CIF en FCFA)",
          },
          yaxis2: {
            title: "Unités vendues (boîtes)",
            overlaying: "y",
            side: "right",
          },
          legend: { orientation: "h", x: 0.3, y: -0.2 },
        }}
        useResizeHandler
        style={{ width: "100%", height: "600px" }}
        config={{ responsive: true }}
      />
    </div>
  );
}
