// Types for sales data
export interface SalesEntry {
  product: string;
  nrvCif: number;
  zone: string;
  laborex: number;
  ubipharm: number;
  camed: number;
  totalUnits: number;
  totalValue: number;
}

export interface ZoneSummary {
  zone: string;
  totalValue: number;
  totalUnits: number;
  laborexValue: number;
  ubipharmValue: number;
  camedValue: number;
}

export interface ProductSummary {
  product: string;
  totalValue: number;
  totalUnits: number;
  zones: { [zone: string]: number };
}

export interface WholesalerSummary {
  name: string;
  totalValue: number;
  totalUnits: number;
  color: string;
}

export interface TotalStats {
  totalValue: number;
  totalUnits: number;
  topZone: ZoneSummary;
  weakestZone: ZoneSummary;
  topProduct: ProductSummary;
  topWholesaler: WholesalerSummary;
  zoneCount: number;
  productCount: number;
}
