"use client";

import { TotalStats, ZoneSummary, WholesalerSummary } from "@/types/sales";
import { TrendingUp, TrendingDown, Target, AlertTriangle, Award, Building2 } from "lucide-react";

interface InsightItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  value?: string;
  type: "success" | "warning" | "info";
}

function InsightItem({ icon, title, description, value, type }: InsightItemProps) {
  const bgColors = {
    success: "bg-chart-strong/10 border-chart-strong/20",
    warning: "bg-chart-weak/10 border-chart-weak/20",
    info: "bg-primary/10 border-primary/20",
  };

  const iconColors = {
    success: "text-chart-strong",
    warning: "text-chart-weak",
    info: "text-primary",
  };

  return (
    <div className={`p-4 rounded-lg border ${bgColors[type]} transition-all hover:scale-[1.02]`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${iconColors[type]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-foreground text-sm">{title}</h4>
            {value && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${iconColors[type]} bg-background`}>
                {value}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

interface InsightsPanelProps {
  stats: TotalStats;
  zoneSummaries: ZoneSummary[];
  wholesalerSummaries: WholesalerSummary[];
}

export function InsightsPanel({ stats, zoneSummaries, wholesalerSummaries }: InsightsPanelProps) {
  // Calculate insights
  const topZoneShare = ((stats.topZone.totalValue / stats.totalValue) * 100).toFixed(1);
  const weakestZoneShare = ((stats.weakestZone.totalValue / stats.totalValue) * 100).toFixed(1);
  const topProductShare = ((stats.topProduct.totalValue / stats.totalValue) * 100).toFixed(1);
  
  const sortedWholesalers = [...wholesalerSummaries].sort((a, b) => b.totalValue - a.totalValue);
  const laborexShare = ((sortedWholesalers[0].totalValue / (sortedWholesalers.reduce((s, w) => s + w.totalValue, 0))) * 100).toFixed(1);

  // Find zones with Laborex dominance
  const laborexDominantZones = zoneSummaries.filter(z => z.laborexValue > z.ubipharmValue + z.camedValue);
  
  // Find zones with Camed presence
  const camedActiveZones = zoneSummaries.filter(z => z.camedValue > 0);

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card animate-fade-in" style={{ animationDelay: "600ms" }}>
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Analyse & Insights
        </h3>
        <p className="text-sm text-muted-foreground">
          Interprétation des données de ventes
        </p>
      </div>

      <div className="space-y-3">
        <InsightItem
          icon={<TrendingUp className="h-4 w-4" />}
          type="success"
          title={`Zone Leader: ${stats.topZone.zone}`}
          description={`${stats.topZone.zone} génère ${topZoneShare}% du CA total avec ${stats.topZone.totalUnits.toLocaleString("fr-FR")} unités vendues.`}
          value={`${Math.round(stats.topZone.totalValue).toLocaleString("fr-FR")} FCFA`}
        />

        <InsightItem
          icon={<TrendingDown className="h-4 w-4" />}
          type="warning"
          title={`Zone à Développer: ${stats.weakestZone.zone}`}
          description={`${stats.weakestZone.zone} ne représente que ${weakestZoneShare}% du CA. Opportunité de croissance.`}
          value={`${Math.round(stats.weakestZone.totalValue).toLocaleString("fr-FR")} FCFA`}
        />

        <InsightItem
          icon={<Award className="h-4 w-4" />}
          type="success"
          title={`Produit Star: ${stats.topProduct.product}`}
          description={`Représente ${topProductShare}% du CA avec présence sur toutes les zones.`}
          value={`${Math.round(stats.topProduct.totalValue).toLocaleString("fr-FR")} FCFA`}
        />

        <InsightItem
          icon={<Building2 className="h-4 w-4" />}
          type="info"
          title={`Dominance ${sortedWholesalers[0].name}`}
          description={`${sortedWholesalers[0].name} capte ${laborexShare}% du marché. Dominant sur ${laborexDominantZones.length}/${zoneSummaries.length} zones.`}
          value={`${laborexDominantZones.length} zones`}
        />

        <InsightItem
          icon={<Target className="h-4 w-4" />}
          type="info"
          title="Présence Camed"
          description={`Camed actif sur ${camedActiveZones.length} zones. Potentiel d'expansion.`}
          value={`${camedActiveZones.length} zones`}
        />
      </div>
    </div>
  );
}
