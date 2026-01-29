"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  FileText, 
  Layers, 
  Table as TableIcon, 
  Trash2,
  UploadCloud 
} from "lucide-react";
import Sidebar from "@/components/Sidebar"; // Vérifiez le chemin de votre Sidebar
import DataTable from "./DataTable";

export default function FileUploaderUbipharm() {
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [ventesDF, setVentesDF] = useState<any[]>([]);
  const [ventesRegion, setVentesRegion] = useState<any[]>([]);
  const [produits, setProduits] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [columnsAll, setColumnsAll] = useState<string[]>([]);
  const [columnsSelected, setColumnsSelected] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const [accordionOpen, setAccordionOpen] = useState({
    produits: false,
    colonnes: false,
  });

  const toggleAccordion = (key: keyof typeof accordionOpen) => {
    setAccordionOpen(s => ({ ...s, [key]: !s[key] }));
  };

  /* ---------------------------------------
     🔁 Parsing & Handling
  ----------------------------------------*/
  const handleFile = useCallback((file: File) => {
    if (!file || !file.name.endsWith(".txt")) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const txt = evt.target?.result;
      if (typeof txt !== "string") return;

      const headers = extractHeaders(txt);
      const { rows, regionAgg } = parseUbipharmTxt(txt, headers);

      setRawRows(rows);

      const produitsUniques: string[] = Array.from(
        new Set(rows.map(r => r["Nom Produit"]).filter((p): p is string => !!p))
      ).sort();
      setProduits(produitsUniques);

      const allCols = rows.length > 0 ? Object.keys(rows[0]) : headers;
      setColumnsAll(allCols);
      setColumnsSelected(allCols);

      setVentesRegion(
        Object.entries(regionAgg).map(([Region, Vente]) => ({ Region, Vente }))
      );
    };
    reader.readAsText(file, "utf-8");
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  /* ---------------------------------------
     🔄 Filtrage & Re-calcul
  ----------------------------------------*/
  useEffect(() => {
    const filtered = rawRows.filter(r => !exclusions.includes(r["Nom Produit"]));
    setVentesDF(filtered);
    
    // Re-calcul de la synthèse région basée sur le filtrage
    const agg: Record<string, number> = {};
    filtered.forEach(r => {
      const region = r["Région"] ?? "Unknown";
      // On somme les colonnes qui sont des mois (headers dynamiques)
      const sum = columnsSelected.reduce((acc, c) => {
          const val = Number(r[c]);
          return !isNaN(val) ? acc + val : acc;
      }, 0);
      agg[region] = (agg[region] || 0) + sum;
    });
    setVentesRegion(Object.entries(agg).map(([Region, Vente]) => ({ Region, Vente })));
  }, [exclusions, rawRows, columnsSelected]);

  /* ---------------------------------------
     📤 Export Excel Pro
  ----------------------------------------*/
  const handleExportFiltered = async () => {
    const wb = new ExcelJS.Workbook();
    const rowsByRegion: Record<string, any[]> = {};

    ventesDF.forEach(r => {
      const region = r["Région"] ?? "Unknown";
      rowsByRegion[region] ||= [];
      const filtered: any = {};
      columnsSelected.forEach(c => filtered[c] = r[c]);
      rowsByRegion[region].push(filtered);
    });

    Object.entries(rowsByRegion).forEach(([region, rows]) => {
      const ws = wb.addWorksheet(sanitizeSheetName(region));
      if (rows.length) {
        ws.addRow(Object.keys(rows[0]));
        rows.forEach(r => ws.addRow(Object.values(r)));
        ws.getRow(1).font = { bold: true };
      }
    });

    const wsSynth = wb.addWorksheet("Synthese");
    wsSynth.addRow(["Région", "Total Ventes"]);
    ventesRegion.forEach(r => wsSynth.addRow([r.Region, r.Vente]));
    wsSynth.getRow(1).font = { bold: true };

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `Ubipharm_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50 overflow-hidden">
     
      
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Extraction Ubipharm
            </h1>
            <p className="text-slate-500 mt-1">Convertissez vos relevés .txt en fichiers Excel structurés.</p>
          </div>
          {ventesDF.length > 0 && (
            <button
              onClick={handleExportFiltered}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-green-200"
            >
              <Download size={18} />
              Exporter Excel (.xlsx)
            </button>
          )}
        </div>

        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Zone d'Upload Style Camed */}
          <div 
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
            }}
            className={`relative group border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 bg-white
              ${dragActive ? "border-indigo-500 bg-indigo-50 shadow-inner" : "border-slate-300 hover:border-slate-400"}`}
          >
            <input type="file" accept=".txt" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center">
              <div className="p-4 bg-indigo-50 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud size={32} className="text-indigo-600" />
              </div>
              <p className="text-lg font-semibold text-slate-700">
                {fileName ? fileName : "Déposez votre fichier Ubipharm (.txt)"}
              </p>
              <p className="text-sm text-slate-500 mt-1">Analyse automatique des régions et des stocks</p>
            </div>
          </div>

          {ventesDF.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Accordéon Colonnes */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                <button 
                  onClick={() => toggleAccordion("colonnes")} 
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors font-semibold text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-indigo-500" /> 
                    Colonnes à exporter
                  </div>
                  {accordionOpen.colonnes ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                </button>
                {accordionOpen.colonnes && (
                  <div className="p-4 border-t bg-slate-50/50 grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {columnsAll.map(col => (
                      <label key={col} className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-indigo-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={columnsSelected.includes(col)}
                          onChange={() => {
                            setColumnsSelected(prev =>
                                prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
                            );
                          }}
                          className="rounded text-indigo-600"
                        />
                        {col}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordéon Produits/Exclusions */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit lg:col-span-2">
                <button 
                  onClick={() => toggleAccordion("produits")} 
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors font-semibold text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 size={18} className="text-red-500" /> 
                    Gérer les Exclusions ({exclusions.length})
                  </div>
                  {accordionOpen.produits ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                </button>
                {accordionOpen.produits && (
                  <div className="p-4 border-t bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                      {produits.map(prod => (
                        <label key={prod} className="flex items-center gap-2 text-xs text-slate-600 py-1 border-b border-slate-100 last:border-0 truncate">
                          <input
                            type="checkbox"
                            checked={exclusions.includes(prod)}
                            onChange={() => {
                                setExclusions(prev =>
                                    prev.includes(prod) ? prev.filter(p => p !== prod) : [...prev, prod]
                                );
                            }}
                            className="rounded text-red-500"
                          />
                          <span className="truncate">{prod}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tableau des données style Camed */}
          {ventesDF.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                <h3 className="flex items-center gap-2 font-bold text-slate-800 uppercase tracking-wider text-sm">
                  <TableIcon size={18} className="text-indigo-600"/> 
                  Aperçu des données Ubipharm
                </h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  {ventesDF.length} lignes extraites
                </span>
              </div>
              
              <div className="overflow-x-auto">
                {/* On passe les données filtrées à DataTable */}
                <DataTable data={ventesDF.map(r => {
                  const o:any = {};
                  columnsSelected.forEach(c => o[c] = r[c]);
                  return o;
                })} />
              </div>
            </div>
          )}

          {/* Message si vide */}
          {ventesDF.length === 0 && !fileName && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="italic">Aucune donnée chargée. Veuillez importer un fichier .txt</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------------- Helpers & Parsing (Inchangés mais conservés pour fonctionnement) ---------------- */

const MONTH_RE = /^\d{2}\/\d{2}$/;

function extractHeaders(txt: string): string[] {
  const lines = txt.split(/\r?\n/);
  for (const line of lines) {
    if (line.includes("Stocks / CR")) {
      const tokens = line.trim().split(/\s+/).slice(3).filter(h => h !== "/");
      if (tokens.length === 7) return tokens;
      const m = tokens.find(t => MONTH_RE.test(t));
      return m ? [m,"M-1","M-2","M-3","M-4","M-5","M-6"] :
        ["MOIS","M-1","M-2","M-3","M-4","M-5","M-6"];
    }
  }
  return ["MOIS","M-1","M-2","M-3","M-4","M-5","M-6"];
}

function sanitizeSheetName(name: string) {
  return name.replace(/[\\/*?:[\]]/g, "").slice(0, 31) || "Region";
}

function parseUbipharmTxt(txt: string, headers: string[]) {
  const lines = txt.split(/\r?\n/);
  let currentRegion: string | null = null;
  const rows: Record<string, any>[] = [];
  const regionAgg: Record<string, number> = {};

  for (const line of lines) {
    const regionMatch = line.match(/Pays.*R.gion\s+\d+\/\w+\s+(.*)/i);
    if (regionMatch) {
      currentRegion = regionMatch[1].trim();
      continue;
    }

    const productMatch = line.match(
      /^\s*([A-Z0-9\-]+)\s+(.+?)\s+(\d+)?\s*\/\s*(\d+)\s+(\d*)\s+(\d*)\s+(\d*)\s+(\d*)\s+(\d*)\s+(\d*)\s+(\d*)/
    );

    if (!productMatch || !currentRegion) continue;

    const code = productMatch[1].trim();
    const name = productMatch[2].trim();
    const stock = productMatch[3] ? Number(productMatch[3]) : null;
    const cr = Number(productMatch[4] || 0);

    const ventes: number[] = [];
    for (let i = 5; i <= 11; i++) {
      const v = Number(productMatch[i] || 0);
      ventes.push(Number.isNaN(v) ? 0 : v);
    }

    if (headers.length !== ventes.length) continue;

    const row: Record<string, any> = {
      Région: currentRegion,
      "Code Produit": code,
      "Nom Produit": name,
      Stock: stock,
      CR: cr,
    };

    headers.forEach((h, i) => {
      row[h] = ventes[i];
      const region = currentRegion!;
      regionAgg[region] = (regionAgg[region] || 0) + ventes[i];
    });

    rows.push(row);
  }
  return { rows, regionAgg };
}