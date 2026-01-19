import Plot from "react-plotly.js";

export default function Chart({ data, zone }) {
  const products = data.map((d) => d.product);
  const values = data.map((d) => d.nrv);
  const units = data.map((d) => d.units);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Zone : {zone}</h2>
      <Plot
        data={[
          {
            type: "bar",
            x: products,
            y: values,
            name: "Valeur (NRV/CIF)",
            marker: { color: "rgba(55,128,191,0.7)" },
          },
          {
            type: "scatter",
            x: products,
            y: units,
            name: "Unités vendues",
            yaxis: "y2",
            mode: "lines+markers",
            marker: { color: "rgba(255,99,71,0.7)" },
          },
        ]}
        layout={{
          title: "Analyse des ventes",
          autosize: true,
          margin: { t: 50, r: 50, b: 100, l: 50 },
          xaxis: { title: "Produits" },
          yaxis: { title: "Valeur (NRV/CIF)" },
          yaxis2: {
            title: "Unités",
            overlaying: "y",
            side: "right",
          },
          legend: { orientation: "h" },
        }}
        useResizeHandler
        style={{ width: "100%", height: "600px" }}
        config={{ responsive: true }}
      />
    </div>
  );
}
