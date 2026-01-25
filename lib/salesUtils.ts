import { SalesEntry, ZoneSummary, ProductSummary, WholesalerSummary, TotalStats } from "@/types/sales";

// Calculate value using formula: NRV/CIF × units
export function calculateValue(nrvCif: number, units: number): number {
  return Math.round(nrvCif * units * 100) / 100;
}

// Get unique zones from data
export function getZones(data: SalesEntry[]): string[] {
  return [...new Set(data.map(d => d.zone))];
}

// Get unique products from data
export function getProducts(data: SalesEntry[]): string[] {
  return [...new Set(data.map(d => d.product))];
}

// Aggregate by zone
export function getZoneSummaries(data: SalesEntry[]): ZoneSummary[] {
  const zoneMap = new Map<string, ZoneSummary>();
  
  data.forEach(entry => {
    const existing = zoneMap.get(entry.zone) || {
      zone: entry.zone,
      totalValue: 0,
      totalUnits: 0,
      laborexValue: 0,
      ubipharmValue: 0,
      camedValue: 0,
    };
    
    existing.totalValue += calculateValue(entry.nrvCif, entry.laborex + entry.ubipharm + entry.camed);
    existing.totalUnits += entry.totalUnits;
    existing.laborexValue += calculateValue(entry.nrvCif, entry.laborex);
    existing.ubipharmValue += calculateValue(entry.nrvCif, entry.ubipharm);
    existing.camedValue += calculateValue(entry.nrvCif, entry.camed);
    
    zoneMap.set(entry.zone, existing);
  });
  
  return Array.from(zoneMap.values()).sort((a, b) => b.totalValue - a.totalValue);
}

// Aggregate by product
export function getProductSummaries(data: SalesEntry[]): ProductSummary[] {
  const zones = getZones(data);
  const productMap = new Map<string, ProductSummary>();
  
  data.forEach(entry => {
    const existing = productMap.get(entry.product) || {
      product: entry.product,
      totalValue: 0,
      totalUnits: 0,
      zones: {},
    };
    
    const entryValue = calculateValue(entry.nrvCif, entry.laborex + entry.ubipharm + entry.camed);
    existing.totalValue += entryValue;
    existing.totalUnits += entry.totalUnits;
    existing.zones[entry.zone] = (existing.zones[entry.zone] || 0) + entryValue;
    
    productMap.set(entry.product, existing);
  });
  
  return Array.from(productMap.values()).sort((a, b) => b.totalValue - a.totalValue);
}

// Aggregate by wholesaler
export function getWholesalerSummaries(data: SalesEntry[]): WholesalerSummary[] {
  let laborexTotal = 0;
  let ubipharmTotal = 0;
  let camedTotal = 0;
  let laborexUnits = 0;
  let ubipharmUnits = 0;
  let camedUnits = 0;
  
  data.forEach(entry => {
    laborexTotal += calculateValue(entry.nrvCif, entry.laborex);
    ubipharmTotal += calculateValue(entry.nrvCif, entry.ubipharm);
    camedTotal += calculateValue(entry.nrvCif, entry.camed);
    laborexUnits += entry.laborex;
    ubipharmUnits += entry.ubipharm;
    camedUnits += entry.camed;
  });
  
  return [
    { name: "Laborex", totalValue: laborexTotal, totalUnits: laborexUnits, color: "hsl(var(--chart-laborex))" },
    { name: "Ubipharm", totalValue: ubipharmTotal, totalUnits: ubipharmUnits, color: "hsl(var(--chart-ubipharm))" },
    { name: "Camed", totalValue: camedTotal, totalUnits: camedUnits, color: "hsl(var(--chart-camed))" },
  ];
}

// Get zone data with wholesaler breakdown for stacked chart
export function getZoneWholesalerData(data: SalesEntry[]) {
  return getZoneSummaries(data).map(zone => ({
    zone: zone.zone,
    Laborex: Math.round(zone.laborexValue),
    Ubipharm: Math.round(zone.ubipharmValue),
    Camed: Math.round(zone.camedValue),
    total: Math.round(zone.totalValue),
  }));
}

// Get total statistics
export function getTotalStats(data: SalesEntry[]): TotalStats | null {
  if (data.length === 0) return null;
  
  const zoneSummaries = getZoneSummaries(data);
  const productSummaries = getProductSummaries(data);
  const wholesalerSummaries = getWholesalerSummaries(data);
  const zones = getZones(data);
  const products = getProducts(data);
  
  const totalValue = zoneSummaries.reduce((sum, z) => sum + z.totalValue, 0);
  const totalUnits = zoneSummaries.reduce((sum, z) => sum + z.totalUnits, 0);
  
  const topZone = zoneSummaries[0];
  const weakestZone = zoneSummaries[zoneSummaries.length - 1];
  const topProduct = productSummaries[0];
  const topWholesaler = wholesalerSummaries.sort((a, b) => b.totalValue - a.totalValue)[0];
  
  return {
    totalValue: Math.round(totalValue),
    totalUnits,
    topZone,
    weakestZone,
    topProduct,
    topWholesaler,
    zoneCount: zones.length,
    productCount: products.length,
  };
}
