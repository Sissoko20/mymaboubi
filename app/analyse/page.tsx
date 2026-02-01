"use client";

import { useState, useCallback } from "react";
import { SalesEntry } from "@/types/sales";
import { 
  getTotalStats, 
  getZoneSummaries, 
  getProductSummaries, 
  getWholesalerSummaries,
  getZoneWholesalerData 
} from "@/lib/salesUtils";
import { StatCard } from "@/components/dashboard/StatCard";
import { ZoneBarChart } from "@/components/dashboard/ZoneBarChart";
import { WholesalerStackedChart } from "@/components/dashboard/WholesalerStackedChart";
import { ProductPerformanceChart } from "@/components/dashboard/ProductPerformanceChart";
import { WholesalerPieChart } from "@/components/dashboard/WholesalerPieChart";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { DataTable } from "@/components/dashboard/DataTable";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Package, 
  Building2,
  FileSpreadsheet
} from "lucide-react";
import Sidebar from "../../components/Sidebar";

export default function Home() {
  const [salesData, setSalesData] = useState<SalesEntry[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDataLoaded = useCallback((data: SalesEntry[], name: string) => {
    setSalesData(data);
    setFileName(name);
  }, []);

  const stats = salesData.length > 0 ? getTotalStats(salesData) : null;
  const zoneSummaries = getZoneSummaries(salesData);
  const productSummaries = getProductSummaries(salesData);
  const wholesalerSummaries = getWholesalerSummaries(salesData);
  const zoneWholesalerData = getZoneWholesalerData(salesData);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Sidebar />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* File Upload Section */}
        {salesData.length === 0 ? (
          <section className="max-w-2xl mx-auto py-12">
            <FileUpload onDataLoaded={handleDataLoaded} />
          </section>
        ) : (
          <>
            {/* KPI Cards */}
            {stats && (
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Chiffre d'Affaires Total"
                    value={`${(stats.totalValue / 1000).toFixed(1)}k FCFA`}
                    subtitle="Valeur calculée (NRV × Unités)"
                    icon={TrendingUp}
                    variant="primary"
                    delay={0}
                  />
                  <StatCard
                    title="Unités Vendues"
                    value={stats.totalUnits}
                    subtitle={`Sur ${stats.productCount} produits`}
                    icon={Package}
                    variant="default"
                    delay={50}
                  />
                  <StatCard
                    title="Zones Couvertes"
                    value={stats.zoneCount}
                    subtitle={`Leader: ${stats.topZone.zone}`}
                    icon={MapPin}
                    variant="accent"
                    delay={100}
                  />
                  <StatCard
                    title="Grossiste Dominant"
                    value={stats.topWholesaler.name}
                    subtitle={`${Math.round(stats.topWholesaler.totalValue).toLocaleString("fr-FR")} FCFA`}
                    icon={Building2}
                    variant="warning"
                    delay={150}
                  />
                </div>
              </section>
            )}

            {/* Charts Row 1 */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ZoneBarChart data={zoneSummaries} />
              <WholesalerStackedChart data={zoneWholesalerData} />
            </section>

            {/* Charts Row 2 */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProductPerformanceChart data={productSummaries} />
              </div>
              <WholesalerPieChart data={wholesalerSummaries} />
            </section>

            {/* Insights */}
            {stats && (
              <section>
                <InsightsPanel 
                  stats={stats} 
                  zoneSummaries={zoneSummaries}
                  wholesalerSummaries={wholesalerSummaries}
                />
              </section>
            )}

            {/* Data Table */}
            <section>
              <DataTable data={salesData} />
            </section>

            {/* Load New File Button */}
            <section className="flex justify-center">
              <button
                onClick={() => {
                  setSalesData([]);
                  setFileName(null);
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                Charger un autre fichier
              </button>
            </section>

            {/* Footer */}
            <footer className="pt-6 pb-4 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <p>
                  Source: {fileName} • Données parsées et agrégées automatiquement
                </p>
                <p>
                  Formule appliquée: Valeur = NRV/CIF × Unités vendues par grossiste
                </p>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
