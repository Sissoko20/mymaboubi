'use client';
import { useCallback, useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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

  const [accordionOpen, setAccordionOpen] = useState({
    produits: false,
    colonnes: false,
  });


  const toggleAccordion = (key: "produits" | "colonnes") => {
  setAccordionOpen(s => ({ ...s, [key]: !s[key] }));
};


  /* ---------------------------------------
     🔁 Parsing unique (Upload + Drag&Drop)
  ----------------------------------------*/
const handleFile = useCallback((file: File) => {
  if (!file || !file.name.endsWith(".txt")) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const txt = evt.target?.result;
    if (typeof txt !== "string") return;

    const headers = extractHeaders(txt);
    const { rows, regionAgg } = parseUbipharmTxt(txt, headers);

    setRawRows(rows);

    // ✅ FIX TypeScript (string[] garanti)
    const produitsUniques: string[] = Array.from(
      new Set(
        rows
          .map(r => r["Nom Produit"])
          .filter((p): p is string => typeof p === "string" && p.trim() !== "")
      )
    );
    setProduits(produitsUniques);

    const allCols = rows.length > 0 ? Object.keys(rows[0]) : headers;
    setColumnsAll(allCols);
    setColumnsSelected(allCols);

    setVentesRegion(
      Object.entries(regionAgg).map(([Region, Vente]) => ({
        Region,
        Vente,
      }))
    );
  };

  reader.readAsText(file, "utf-8");
}, []);

  /* ---------------------------------------
     📂 Upload classique
  ----------------------------------------*/
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  /* ---------------------------------------
     🧲 Drag & Drop PRO
  ----------------------------------------*/
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  useEffect(() => {
    const prevent = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

  /* ---------------------------------------
     🔄 Filtrage produits
  ----------------------------------------*/
  useEffect(() => {
    const filtered = rawRows.filter(
      r => !exclusions.includes(r["Nom Produit"])
    );
    setVentesDF(filtered);
    recomputeRegionAgg(filtered, columnsSelected);
  }, [exclusions, rawRows, columnsSelected]);

  const handleExcludeProduct = (prod: string) => {
    setExclusions(prev =>
      prev.includes(prod)
        ? prev.filter(p => p !== prod)
        : [...prev, prod]
    );
  };

  /* ---------------------------------------
     📊 Colonnes
  ----------------------------------------*/
  const handleToggleColumn = (col: string) => {
    setColumnsSelected(prev =>
      prev.includes(col)
        ? prev.filter(c => c !== col)
        : [...prev, col]
    );
  };

  const recomputeRegionAgg = (rows: any[], salesCols: string[]) => {
    const agg: Record<string, number> = {};
    rows.forEach(r => {
      const region = r["Région"] ?? "Unknown";
      const sum = salesCols.reduce((acc, c) => acc + (Number(r[c]) || 0), 0);
      agg[region] = (agg[region] || 0) + sum;
    });
    setVentesRegion(
      Object.entries(agg).map(([Region, Vente]) => ({ Region, Vente }))
    );
  };

  /* ---------------------------------------
     📤 Export Excel
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
      }
    });

    const wsSynth = wb.addWorksheet("Synthese");
    wsSynth.addRow(["Region", "Vente"]);
    ventesRegion.forEach(r => wsSynth.addRow([r.Region, r.Vente]));

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), "ubipharm_par_region.xlsx");
  };

  /* ---------------------------------------
     🧩 UI
  ----------------------------------------*/
  return (
    <div className="space-y-6">

      {/* Zone Drag & Drop */}
      <div
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition
          ${dragActive ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
      >
        <p className="font-semibold">Glisser-déposer le fichier Ubipharm (.txt)</p>
        <p className="text-sm text-gray-500 mt-1">ou utiliser le bouton ci-dessous</p>
        <input type="file" accept=".txt" onChange={handleUpload} className="mt-4" />
      </div>

      {ventesDF.length > 0 && (
        
        <>
         {/* HEADER ACCORDÉON */}
    <button
      onClick={() => toggleAccordion("colonnes")}
      className="w-full px-4 py-2 bg-gray-100 font-semibold text-left"
    >
      📊 Colonnes à exporter
      <span className="float-right">
        {accordionOpen.colonnes ? "▲" : "▼"}
      </span>
    </button>

    {/* CONTENU ACCORDÉON */}
    {accordionOpen.colonnes && (
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {columnsAll.map(col => (
          <label key={col} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={columnsSelected.includes(col)}
              onChange={() => handleToggleColumn(col)}
            />
            {col}
          </label>
        ))}
      </div>
    )}
       

          <DataTable data={ventesDF.map(r => {
            const o:any = {};
            columnsSelected.forEach(c => o[c] = r[c]);
            return o;
          })} 
          />
   <button
            onClick={handleExportFiltered}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ⬇️ Télécharger Excel (par région)
          </button>
       
        </>
      )}
    </div>
  );
}

/* ---------------- Helpers ---------------- */

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

function parseUbipharmTxt(
  txt: string,
  headers: string[]
): {
  rows: Record<string, any>[];
  regionAgg: Record<string, number>;
} {
  const lines = txt.split(/\r?\n/);

  let currentRegion: string | null = null;
  const rows: Record<string, any>[] = [];
  const regionAgg: Record<string, number> = {};

  for (const line of lines) {
    // 🔹 Détection région
    const regionMatch = line.match(/Pays.*R.gion\s+\d+\/\w+\s+(.*)/i);
    if (regionMatch) {
      currentRegion = regionMatch[1].trim();
      continue;
    }

    // 🔹 Ligne produit
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

