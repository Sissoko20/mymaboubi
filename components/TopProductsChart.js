'use client';
import Plot from "react-plotly.js";

export default function TopProductsChart({ products }) {
    const topProductsMock = [
  { product: "Ornilox", units: 1500, nrv: 1.719 },
  { product: "Gramocef-O 200mg", units: 1200, nrv: 3.564 },
  { product: "Allercet", units: 1100, nrv: 0.99 },
  { product: "Phytoral Shampoo", units: 800, nrv: 1.54 },
  { product: "Dolowin Plus", units: 700, nrv: 3.74 },
  { product: "Levobact 750", units: 600, nrv: 6.17 },
  { product: "Azilide 500mg", units: 400, nrv: 2.61 },
  { product: "Phytoral Ointement", units: 350, nrv: 1.57 },
  { product: "Gramocef 50mg Syrup", units: 300, nrv: 2.61 },
  { product: "Gramocef 100mg Syrup", units: 200, nrv: 3.564 },
];

  return (
    <Plot
      data={[
        {
          type: "bar",
          x: products.map(p => p.product),
          y: products.map(p => p.units),
          marker: { color: "rgba(55,128,191,0.7)" },
        },
      ]}
      layout={{
        title: "Top 10 Produits (Unités)",
        xaxis: { title: "Produits" },
        yaxis: { title: "Unités vendues" },
      }}
      style={{ width: "100%", height: "500px" }}
      config={{ responsive: true }}
    />
  );
}
