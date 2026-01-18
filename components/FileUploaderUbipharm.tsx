// components/FileUploaderUbipharm.tsx
'use client';
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DataTable from "./DataTable";
import ChartZone from "./ChartZone";

export default function FileUploaderUbipharm() {
  const [ventesDF, setVentesDF] = useState<any[]>([]);
  const [ventesRegion, setVentesRegion] = useState<any[]>([]);
  const [produits, setProduits] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [columnsAll, setColumnsAll] = useState<string[]>([]);
  const [columnsSelected, setColumnsSelected] = useState<string[]>([]);
  const [accordionOpen, setAccordionOpen] = useState({
    produits: false,
    colonnes: false,
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const txt = evt.target?.result as string;
      if (!txt) return;

      const headers = extractHeaders(txt);
      const { rows, regionAgg } = parseUbipharmTxt(txt, headers);

      setVentesDF(rows);
      setProduits([...new Set(rows.map((r) => r["Nom Produit"]))]);

      const allCols = rows.length > 0 ? Object.keys(rows[0]) : headers;
      setColumnsAll(allCols);
      setColumnsSelected(allCols.slice());

      setVentesRegion(Object.entries(regionAgg).map(([Region, Vente]) => ({ Region, Vente })));
    };
    reader.readAsText(file, "utf-8");
  };

  const toggleAccordion = (key: "produits" | "colonnes") => {
    setAccordionOpen((s) => ({ ...s, [key]: !s[key] }));
  };

  const handleExcludeProduct = (prod: string) => {
    const newExclusions = exclusions.includes(prod) ? exclusions.filter((p) => p !== prod) : [...exclusions, prod];
    setExclusions(newExclusions);
    const filtered = ventesDF.filter((row) => !newExclusions.includes(row["Nom Produit"]));
    setVentesDF(filtered);
    recomputeRegionAgg(filtered, columnsSelected);
  };

  const handleToggleColumn = (col: string) => {
    const newCols = columnsSelected.includes(col) ? columnsSelected.filter((c) => c !== col) : [...columnsSelected, col];
    setColumnsSelected(newCols);
    recomputeRegionAgg(ventesDF, newCols);
  };

  const recomputeRegionAgg = (rows: any[], salesCols: string[]) => {
    const agg: Record<string, number> = {};
    rows.forEach((r) => {
      const region = r["Région"] || r["RÉGION"] || r["Region"] || "Unknown";
      let sum = 0;
      salesCols.forEach((c) => {
        const v = Number(r[c]) || 0;
        sum += v;
      });
      agg[region] = (agg[region] || 0) + sum;
    });
    setVentesRegion(Object.entries(agg).map(([Region, Vente]) => ({ Region, Vente })));
  };

  const getFilteredRowsForTable = () => {
    return ventesDF.map((row) => {
      const filtered: any = {};
      columnsSelected.forEach((k) => {
        filtered[k] = row[k];
      });
      return filtered;
    });
  };

  // sanitizeSheetName : suppression des caractères interdits sans regex
  const sanitizeSheetName = (name: string, fallback = "Region") => {
    if (!name) return fallback;
    const forbidden = ["[", "]", "*", "/", "\\", "?", ":"];
    let cleaned = "";
    for (let i = 0; i < name.length; i++) {
      const ch = name[i];
      if (!forbidden.includes(ch)) cleaned += ch;
    }
    cleaned = cleaned.trim();
    if (!cleaned) return fallback;
    return cleaned.length > 31 ? cleaned.slice(0, 31) : cleaned;
  };

  const handleExportFiltered = async () => {
    const rows = getFilteredRowsForTable();
    const wb = new ExcelJS.Workbook();

    if (rows.length > 0) {
      const wsAll = wb.addWorksheet("Tableau_filtré");
      wsAll.addRow(Object.keys(rows[0]));
      rows.forEach((r) => wsAll.addRow(Object.values(r)));
    }

    const rowsByRegion: Record<string, any[]> = {};
    ventesDF.forEach((r) => {
      const region = r["Région"] || r["RÉGION"] || r["Region"] || "Unknown";
      if (!rowsByRegion[region]) rowsByRegion[region] = [];
      const filtered: any = {};
      columnsSelected.forEach((k) => (filtered[k] = r[k]));
      rowsByRegion[region].push(filtered);
    });

    Object.entries(rowsByRegion).forEach(([region, regionRows]) => {
      const sheetName = sanitizeSheetName(region);
      const ws = wb.addWorksheet(sheetName);
      if (regionRows.length > 0) {
        ws.addRow(Object.keys(regionRows[0]));
        regionRows.forEach((r) => ws.addRow(Object.values(r)));
      }
    });

    const wsSynth = wb.addWorksheet("Synthese_par_region");
    wsSynth.addRow(["Region", "Vente"]);
    ventesRegion.forEach((r) => wsSynth.addRow([r.Region, r.Vente]));

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), "ubipharm_par_region.xlsx");
  };

  return (
    <div className="space-y-6">
      <input type="file" accept=".txt" onChange={handleUpload} className="mb-4" />

      {ventesDF.length > 0 && (
        <div className="border rounded shadow-sm">
          <div className="flex flex-col md:flex-row">
            <button
              onClick={() => toggleAccordion("produits")}
              className="w-full md:w-1/2 text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold"
            >
              🚫 Produits à exclure
              <span className="float-right">{accordionOpen.produits ? "▲" : "▼"}</span>
            </button>
            <button
              onClick={() => toggleAccordion("colonnes")}
              className="w-full md:w-1/2 text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold"
            >
              📊 Colonnes visibles
              <span className="float-right">{accordionOpen.colonnes ? "▲" : "▼"}</span>
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {accordionOpen.produits && (
              <div>
                <h4 className="font-semibold mb-2">Liste des produits</h4>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {produits.map((p) => (
                    <li key={p} className="flex items-center justify-between">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exclusions.includes(p)}
                          onChange={() => handleExcludeProduct(p)}
                          className="h-4 w-4 text-red-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-800">{p}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {accordionOpen.colonnes && (
              <div>
                <h4 className="font-semibold mb-2">Sélection des colonnes (toute l'en-tête)</h4>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {columnsAll.map((col) => (
                    <li key={col} className="flex items-center justify-between">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={columnsSelected.includes(col)}
                          onChange={() => handleToggleColumn(col)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-800">{col}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {ventesDF.length > 0 && (
        <div className="flex items-center space-x-4">
          <button
            onClick={handleExportFiltered}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ⬇️ Télécharger Excel (par onglet région)
          </button>
          <div className="text-sm text-gray-600">Chaque région est exportée dans son propre onglet</div>
        </div>
      )}

      {ventesDF.length > 0 && <DataTable data={getFilteredRowsForTable()} />}
      {ventesRegion.length > 0 && <ChartZone data={ventesRegion} />}
    </div>
  );
}

/* ---------------- Helpers JS (adaptés du parser Python) ---------------- */

const MONTH_RE = /^\d{2}\/\d{2}$/;

function extractHeaders(txt: string): string[] {
  if (!txt) return ["MOIS", "M-1", "M-2", "M-3", "M-4", "M-5", "M-6"];
  const lines = txt.split(/\r?\n/);
  for (const line of lines) {
    if (line.includes("Stocks / CR")) {
      let tokens = line.trim().split(/\s+/);
      let salesHeaders = tokens.slice(3).filter((h) => h !== "/");
      if (salesHeaders.length !== 7) {
        const month = salesHeaders.find((h) => MONTH_RE.test(h));
        salesHeaders = month ? [month, "M-1", "M-2", "M-3", "M-4", "M-5", "M-6"] : ["MOIS", "M-1", "M-2", "M-3", "M-4", "M-5", "M-6"];
      }
      return salesHeaders.map((h) => h.trim());
    }
  }
  return ["MOIS", "M-1", "M-2", "M-3", "M-4", "M-5", "M-6"];
}

function parseUbipharmTxt(txt: string, headers: string[]) {
  const lines = txt.split(/\r?\n/);
  let region: string | null = null;
  const rows: Array<Record<string, any>> = [];
  const regionAgg: Record<string, number> = {};

  for (const line of lines) {
    const regionMatch = line.match(/Pays.*R.gion\s+\d+\/\w+\s+(.*)/);
    if (regionMatch) {
      region = regionMatch[1].trim();
      continue;
    }

    const productMatch = line.match(
      /\s*([A-Z0-9\-]+)\s+(.+?)\s+(\d+)?\s*\/\s*(\d+)\s+(\d*)\s+(\d*)\s+(\d*)\s+(\d*)\s+(\d*)\s+(\d*)\s+(\d*)/
    );
    if (productMatch) {
      // si region n'est pas défini, on ignore la ligne (ou on peut fallback)
      const regionKey = region ?? "Unknown";

      const code = (productMatch[1] || "").trim();
      const name = (productMatch[2] || "").trim();
      const stock = productMatch[3] ? parseInt(productMatch[3], 10) : null;
      const cr = productMatch[4] ? parseInt(productMatch[4], 10) : 0;

      const sales: number[] = [];
      for (let i = 5; i <= 11; i++) {
        const raw = productMatch[i];
        const v = raw && raw.trim() !== "" ? parseInt(raw, 10) : 0;
        sales.push(Number.isNaN(v) ? 0 : v);
      }

      if (headers.length === 7 && sales.length === 7) {
        const row: Record<string, any> = {
          Région: regionKey,
          "Code Produit": code,
          "Nom Produit": name,
          Stock: stock,
          CR: cr,
        };
        headers.forEach((h, i) => {
          row[h] = sales[i];
          regionAgg[regionKey] = (regionAgg[regionKey] || 0) + sales[i];
        });
        rows.push(row);
      }
    }
  }

  return { rows, regionAgg };
}

