"use client";

import { useState } from "react";
import { SalesEntry } from "@/types/sales";
import { calculateValue, getZones } from "@/lib/salesUtils";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";

type SortKey = "product" | "zone" | "laborex" | "ubipharm" | "camed" | "total";
type SortDirection = "asc" | "desc";

interface DataTableProps {
  data: SalesEntry[];
}

export function DataTable({ data }: DataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("total");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedZone, setSelectedZone] = useState<string>("all");

  const zones = getZones(data);

  const filteredData = selectedZone === "all" 
    ? data 
    : data.filter(d => d.zone === selectedZone);

  const sortedData = [...filteredData].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;

    switch (sortKey) {
      case "product":
        aVal = a.product;
        bVal = b.product;
        break;
      case "zone":
        aVal = a.zone;
        bVal = b.zone;
        break;
      case "laborex":
        aVal = calculateValue(a.nrvCif, a.laborex);
        bVal = calculateValue(b.nrvCif, b.laborex);
        break;
      case "ubipharm":
        aVal = calculateValue(a.nrvCif, a.ubipharm);
        bVal = calculateValue(b.nrvCif, b.ubipharm);
        break;
      case "camed":
        aVal = calculateValue(a.nrvCif, a.camed);
        bVal = calculateValue(b.nrvCif, b.camed);
        break;
      case "total":
      default:
        aVal = calculateValue(a.nrvCif, a.laborex + a.ubipharm + a.camed);
        bVal = calculateValue(b.nrvCif, b.laborex + b.ubipharm + b.camed);
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc" 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }

    return sortDirection === "asc" 
      ? (aVal as number) - (bVal as number) 
      : (bVal as number) - (aVal as number);
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDirection === "asc" 
      ? <ChevronUp className="h-3 w-3" /> 
      : <ChevronDown className="h-3 w-3" />;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card animate-fade-in" style={{ animationDelay: "700ms" }}>
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              Données Détaillées
            </h3>
            <p className="text-sm text-muted-foreground">
              Ventes par produit, zone et grossiste (formule: NRV/CIF × Unités)
            </p>
          </div>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
          >
            <option value="all">Toutes les zones</option>
            {zones.map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th 
                className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("product")}
              >
                <div className="flex items-center gap-1.5">
                  Produit <SortIcon column="product" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("zone")}
              >
                <div className="flex items-center gap-1.5">
                  Zone <SortIcon column="zone" />
                </div>
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                NRV/CIF
              </th>
              <th 
                className="text-right py-3 px-4 text-xs font-semibold text-chart-laborex uppercase tracking-wide cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("laborex")}
              >
                <div className="flex items-center justify-end gap-1.5">
                  Laborex <SortIcon column="laborex" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-xs font-semibold text-chart-ubipharm uppercase tracking-wide cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("ubipharm")}
              >
                <div className="flex items-center justify-end gap-1.5">
                  Ubipharm <SortIcon column="ubipharm" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-xs font-semibold text-chart-camed uppercase tracking-wide cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("camed")}
              >
                <div className="flex items-center justify-end gap-1.5">
                  Camed <SortIcon column="camed" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 text-xs font-semibold text-foreground uppercase tracking-wide cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort("total")}
              >
                <div className="flex items-center justify-end gap-1.5">
                  Total <SortIcon column="total" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((entry, idx) => {
              const laborexVal = calculateValue(entry.nrvCif, entry.laborex);
              const ubipharmVal = calculateValue(entry.nrvCif, entry.ubipharm);
              const camedVal = calculateValue(entry.nrvCif, entry.camed);
              const totalVal = laborexVal + ubipharmVal + camedVal;

              return (
                <tr 
                  key={`${entry.product}-${entry.zone}-${idx}`}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="font-medium text-sm text-foreground">{entry.product}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      {entry.zone}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-muted-foreground">{entry.nrvCif.toFixed(2)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-sm">
                      <span className="text-foreground font-medium">{Math.round(laborexVal).toLocaleString("fr-FR")}</span>
                      <span className="text-xs text-muted-foreground ml-1">({entry.laborex})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-sm">
                      <span className="text-foreground font-medium">{Math.round(ubipharmVal).toLocaleString("fr-FR")}</span>
                      <span className="text-xs text-muted-foreground ml-1">({entry.ubipharm})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-sm">
                      <span className="text-foreground font-medium">{Math.round(camedVal).toLocaleString("fr-FR")}</span>
                      <span className="text-xs text-muted-foreground ml-1">({entry.camed})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold text-primary">
                      {Math.round(totalVal).toLocaleString("fr-FR")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Affichage de {sortedData.length} entrées • Valeurs en FCFA • Unités entre parenthèses
        </p>
      </div>
    </div>
  );
}
