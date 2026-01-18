// components/ChartZone.tsx
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ⚠️ Enregistrement obligatoire
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ChartZone({ data }: { data: any[] }) {
  return (
    <div>
  <h3 className="text-xl font-semibold mb-4">📊 Ventes par zone</h3>

      <Bar
        data={{
          labels: data.map((v) => v.Zone),
          datasets: [
            {
              label: "Vente",
              data: data.map((v) => v.Vente),
              backgroundColor: "rgba(75,192,192,0.6)",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Ventes par zone" },
          },
        }}
      />
    </div>
  );
}
