'use client';
import Plot from "react-plotly.js";

export default function WholesalerChart({ data }) {
  const zones = data.map(d => d.zone);



  return (
    <Plot
      data={[
        { type: "bar", name: "Laborex", x: zones, y: data.map(d => d.laborex) },
        { type: "bar", name: "Ubipharm", x: zones, y: data.map(d => d.ubipharm) },
        { type: "bar", name: "CAMED", x: zones, y: data.map(d => d.camed) },
      ]}
      layout={{
         title: {
          text: "Analyse globale par grossiste et par zone",
          font: { size: 20, color: "#333" },
        },
      }}
      style={{ width: "100%", height: "500px" }}
      config={{ responsive: true }}
    />
  );
}
