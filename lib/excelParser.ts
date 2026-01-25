import * as XLSX from 'xlsx';
import { SalesEntry } from '@/types/sales';

// Zones to detect in sheet names or data
const ZONE_PATTERNS = [
  { pattern: /C1.*C2|C1\s*et\s*C2/i, name: "C1+C2" },
  { pattern: /^C5$/i, name: "C5" },
  { pattern: /^C6$/i, name: "C6" },
  { pattern: /KAYES/i, name: "Kayes" },
  { pattern: /KITA/i, name: "Kita" },
  { pattern: /MOPTI/i, name: "Mopti" },
  { pattern: /S[EÉ]GOU/i, name: "Ségou" },
  { pattern: /SIKASSO/i, name: "Sikasso" },
  { pattern: /TABAKOTO/i, name: "Tabakoto" },
];

// Products to detect (decorative rows to skip)
const DECORATIVE_ROWS = [
  /^Power Brand$/i,
  /^Top 10 Products$/i,
  /^New Products$/i,
  /^TOTAL Value$/i,
  /^TOTAL$/i,
  /^Mali$/i,
  /^\s*$/,
];

function detectZone(text: string): string | null {
  for (const { pattern, name } of ZONE_PATTERNS) {
    if (pattern.test(text)) {
      return name;
    }
  }
  return null;
}

function isDecorativeRow(product: string): boolean {
  if (!product || typeof product !== 'string') return true;
  return DECORATIVE_ROWS.some(pattern => pattern.test(product.trim()));
}

function parseNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  const num = parseFloat(String(value).replace(',', '.'));
  return isNaN(num) ? 0 : num;
}

export async function parseExcelFile(file: File): Promise<SalesEntry[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const salesEntries: SalesEntry[] = [];
        
        // Process each sheet
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          // Try to detect zone from sheet name first
          let currentZone = detectZone(sheetName);
          
          // Find header row and column indices
          let headerRowIndex = -1;
          let productCol = -1;
          let nrvCifCol = -1;
          let laborexCol = -1;
          let ubipharmCol = -1;
          let camedCol = -1;
          
          for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
            const row = jsonData[i];
            if (!row) continue;
            
            for (let j = 0; j < row.length; j++) {
              const cell = String(row[j] || '').toUpperCase().trim();
              
              if (cell === 'PRODUCTS' || cell === 'PRODUCT' || cell === 'PRODUIT') {
                productCol = j;
                headerRowIndex = i;
              }
              if (cell.includes('NRV') || cell.includes('CIF')) {
                nrvCifCol = j;
              }
              if (cell === 'LABOREX') {
                laborexCol = j;
              }
              if (cell === 'UBIPHARM') {
                ubipharmCol = j;
              }
              if (cell === 'CAMED') {
                camedCol = j;
              }
              
              // Also check for zone in header
              const detectedZone = detectZone(cell);
              if (detectedZone && !currentZone) {
                currentZone = detectedZone;
              }
            }
          }
          
          // If we couldn't find a zone, try to detect from sheet content
          if (!currentZone) {
            for (let i = 0; i < Math.min(jsonData.length, 5); i++) {
              const row = jsonData[i];
              if (!row) continue;
              for (const cell of row) {
                const detected = detectZone(String(cell || ''));
                if (detected) {
                  currentZone = detected;
                  break;
                }
              }
              if (currentZone) break;
            }
          }
          
          // Skip if we couldn't identify required columns
          if (headerRowIndex === -1 || productCol === -1 || !currentZone) {
            return;
          }
          
          // Parse data rows
          for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;
            
            const product = String(row[productCol] || '').trim();
            
            // Skip decorative rows
            if (isDecorativeRow(product)) continue;
            
            const nrvCif = parseNumber(row[nrvCifCol]);
            const laborex = parseNumber(row[laborexCol]);
            const ubipharm = parseNumber(row[ubipharmCol]);
            const camed = parseNumber(row[camedCol]);
            
            // Skip rows with no sales data
            if (laborex === 0 && ubipharm === 0 && camed === 0 && nrvCif === 0) continue;
            
            const totalUnits = laborex + ubipharm + camed;
            const totalValue = nrvCif * totalUnits;
            
            salesEntries.push({
              product,
              nrvCif,
              zone: currentZone,
              laborex,
              ubipharm,
              camed,
              totalUnits,
              totalValue: Math.round(totalValue * 100) / 100,
            });
          }
        });
        
        resolve(salesEntries);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
