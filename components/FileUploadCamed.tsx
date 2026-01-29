"use client";
import React from "react";
import * as XLSX from "xlsx";
import { SalesEntry } from "@/types/sales";

interface FileUploadProps {
  onDataLoaded: (data: SalesEntry[], fileName: string) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const parsed: SalesEntry[] = [];

    // --- 1. TROUVER LES LIGNES CLÉS ---
    let zoneRowIndex = -1;
    let firstProductIndex = -1;

    for (let i = 0; i < rows.length; i++) {
      const rowStr = JSON.stringify(rows[i]);
      // On cherche la ligne qui contient BAMAKO (la ligne des zones)
      if (rowStr.includes("BAMAKO") && zoneRowIndex === -1) {
        zoneRowIndex = i;
      }
      // On cherche la ligne qui contient "ventes" (juste avant les produits)
      if (rowStr.includes("ventes") && rowStr.includes("C A")) {
        firstProductIndex = i + 1;
      }
    }

    // Si on n'a pas trouvé les repères, on ne peut pas parser
    if (zoneRowIndex === -1 || firstProductIndex === -1) {
      console.error("Structure non reconnue");
      return;
    }

    // --- 2. PROPAGER LES ZONES FUSIONNÉES ---
    const zones: string[] = [];
    let lastValidZone = "";
    const headerZoneRow = rows[zoneRowIndex];

    for (let j = 0; j < headerZoneRow.length; j++) {
      const val = headerZoneRow[j]?.toString().trim();
      if (val && val !== "" && val.toLowerCase() !== "villes") {
        lastValidZone = val;
      }
      zones[j] = lastValidZone;
    }

    // --- 3. PARCOURIR LES PRODUITS ---
    for (let i = firstProductIndex; i < rows.length; i++) {
      const row = rows[i];
      const productName = row[0];

      if (!productName || typeof productName !== "string") continue;
      
      // On ignore les lignes de totaux ou de titres de labo
      if (productName.includes("LABO") || productName.toLowerCase().includes("total")) continue;

      for (let j = 1; j < row.length; j += 2) {
        const zoneName = zones[j];
        const ventes = Number(row[j]);
        const caRaw = row[j + 1];

        // On n'ajoute que s'il y a un chiffre (ventes > 0)
        if (ventes > 0 && zoneName) {
          const ca = typeof caRaw === 'string' 
            ? Number(caRaw.replace(/[^0-9]/g, "")) 
            : Number(caRaw) || 0;

          parsed.push({
            product: productName.trim(),
            zone: zoneName,
            ventes: ventes,
            ca: ca,
            nrvCif: 0,
            laborex: 0,
            ubipharm: 0,
            camed: ventes,
            totalUnits: ventes,
            totalValue: ca,
          });
        }
      }
    }

    onDataLoaded(parsed, file.name);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
      />
    </div>
  );
}