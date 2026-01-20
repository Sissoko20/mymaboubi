import Plot from "react-plotly.js";

export default function WholesalerChart({ data }) {
  const zones = data.map(d => d.zone);
  const wholesalerDataMock = [
  { zone: "C1 et C2", laborex: 246, ubipharm: 119, camed: 53, total: 418 },
  { zone: "C5", laborex: 349, ubipharm: 106, camed: 11, total: 466 },
  { zone: "C6", laborex: 439, ubipharm: 106, camed: 27, total: 572 },
  { zone: "Kayes", laborex: 94, ubipharm: 39, camed: 9, total: 142 },
  { zone: "Kita", laborex: 497, ubipharm: 38, camed: 8, total: 543 },
  { zone: "Mopti", laborex: 119, ubipharm: 55, camed: 7, total: 181 },
  { zone: "Segou", laborex: 146, ubipharm: 54, camed: 9, total: 209 },
  { zone: "Sikasso", laborex: 242, ubipharm: 171, camed: 39, total: 452 },
];


  return (
    <Plot
      data={[
        { type: "bar", name: "Laborex", x: zones, y: data.map(d => d.laborex) },
        { type: "bar", name: "Ubipharm", x: zones, y: data.map(d => d.ubipharm) },
        { type: "bar", name: "CAMED", x: zones, y: data.map(d => d.camed) },
      ]}
      layout={{
        barmode: "stack",
        title: "Ventes par grossiste et par zone",
        xaxis: { title: "Zones" },
        yaxis: { title: "Unités vendues" },
      }}
      style={{ width: "100%", height: "500px" }}
      config={{ responsive: true }}
    />
  );
}
