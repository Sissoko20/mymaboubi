// components/FileUploader.tsx
"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DataTable from "./DataTable";
import ChartZone from "./ChartZone";

export default function FileUploader() {
  const [ventesDF, setVentesDF] = useState<any[]>([]);
  const [ventesZone, setVentesZone] = useState<any[]>([]);
  const [produits, setProduits] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const processFile = (file: File) => {
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Supprimer les 3 premières lignes
      let rows = json.slice(3);

      // 🔍 Couper après "Total général"
      const indexTotal = rows.findIndex(
        (r: any) => r[0] && r[0].toString().toLowerCase().includes("total")
      );
      if (indexTotal !== -1) {
        rows = rows.slice(0, indexTotal + 1);
      }

      // Construire ventes
      const ventes = rows.map((r: any) => {
        const obj: any = { Produit: r[0] };
        for (let i = 1; i < r.length; i += 2) {
          obj[`Zone_${i}`] = r[i];
        }
        return obj;
      });

      setVentesDF(ventes);
      setProduits([...new Set(rows.map((r: any) => r[0]).filter((x) => x))]);

      // Format long
      const ventesLong: any[] = [];
      ventes.forEach((row: any) => {
        Object.keys(row).forEach((col) => {
          if (col !== "Produit") {
            ventesLong.push({
              Produit: row["Produit"],
              Zone: col,
              Vente: Number(row[col]) || 0,
            });
          }
        });
      });

      // Agrégation
      const zoneAgg: any = {};
      ventesLong.forEach((v) => {
        zoneAgg[v.Zone] = (zoneAgg[v.Zone] || 0) + v.Vente;
      });

      setVentesZone(
        Object.entries(zoneAgg).map(([Zone, Vente]) => ({ Zone, Vente }))
      );
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleExclude = (prod: string) => {
    let newExclusions: string[];
    if (exclusions.includes(prod)) {
      newExclusions = exclusions.filter((p) => p !== prod);
    } else {
      newExclusions = [...exclusions, prod];
    }
    setExclusions(newExclusions);
    setVentesDF((prev) => prev.filter((row) => !newExclusions.includes(row.Produit)));
  };

const handleExport = async () => {
  const wb = new ExcelJS.Workbook();

  // --- Feuille 1 : Ventes filtrées ---
  const ws1 = wb.addWorksheet("Ventes_par_zone");
  ws1.columns = [
    { header: "Produit", key: "Produit", width: 30 },
    ...Object.keys(ventesDF[0])
      .filter((c) => c !== "Produit")
      .map((c) => ({ header: c, key: c, width: 15 })),
  ];
  ws1.addRows(ventesDF);

  // --- Feuille 2 : Format analytique ---
  const ws2 = wb.addWorksheet("Format_analytique");
  ws2.columns = [
    { header: "Produit", key: "Produit", width: 30 },
    { header: "Zone", key: "Zone", width: 20 },
    { header: "Vente", key: "Vente", width: 15 },
  ];
  ws2.addRows(
    ventesDF.flatMap((row) =>
      Object.keys(row)
        .filter((c) => c !== "Produit")
        .map((c) => ({
          Produit: row.Produit,
          Zone: c,
          Vente: row[c],
        }))
    )
  );

  // --- Feuille 3 : Synthèse par zone ---
  const ws3 = wb.addWorksheet("Synthese_par_zone");
  ws3.columns = [
    { header: "Zone", key: "Zone", width: 20 },
    { header: "Vente", key: "Vente", width: 15 },
  ];
  ws3.addRows(ventesZone);

  // Sauvegarde
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), "ventes_par_zone.xlsx");
};


  return (
    <div className="space-y-6">
      {/* Zone drag & drop */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition ${
          dragActive ? "border-blue-600 bg-blue-50" : "border-gray-300"
        }`}
      >
        <span className="text-blue-600 font-medium">
          📂 Glissez-déposez ou cliquez pour importer
        </span>
        <input
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      {/* Affichage du fichier choisi */}
      {fileName && (
        <p className="mt-2 text-sm text-gray-700">
          ✅ Fichier sélectionné : <span className="font-semibold">{fileName}</span>
        </p>
      )}

      {produits.length > 0 && (
        <div className="border rounded shadow-sm">
          {/* Accordion header */}
          <button
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold"
          >
            🚫 Produits à exclure
            <span>{accordionOpen ? "▲" : "▼"}</span>
          </button>

          {/* Accordion content */}
          {accordionOpen && (
            <div className="p-4 max-h-64 overflow-y-auto">
              <ul className="space-y-2">
                {produits.map((p) => (
                  <li key={p} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exclusions.includes(p)}
                      onChange={() => handleExclude(p)}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-800">{p}</label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {ventesDF.length > 0 && <DataTable data={ventesDF} />}
      {ventesZone.length > 0 && <ChartZone data={ventesZone} />}

      {ventesDF.length > 0 && (
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ⬇️ Télécharger le fichier Excel
        </button>
      )}
    </div>
  );
}
