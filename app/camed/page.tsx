"use client";

import { useCallback, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { SalesEntry } from "@/types/sales";
import { FileUpload } from "@/components/FileUploadCamed";
import * as XLSX from "xlsx";
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Filter, 
  Layers, 
  Table as TableIcon, 
  Trash2 
} from "lucide-react";

export default function CamedPage() {
  const [salesData, setSalesData] = useState<SalesEntry[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>("Toutes");

  const [accordionOpen, setAccordionOpen] = useState({
    produits: false,
    colonnes: false,
    zones: false
  });

  const toggleAccordion = (key: keyof typeof accordionOpen) => {
    setAccordionOpen((s) => ({ ...s, [key]: !s[key] }));
  };

  const allColumns = useMemo(() => [
    "product", "zone", "ventes", "ca", "totalUnits", 
    "totalValue", "laborex", "ubipharm", "camed", "nrvCif"
  ], []);

  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "product", "zone", "ventes", "ca"
  ]);

  const [exclusions, setExclusions] = useState<string[]>([]);

  const handleDataLoaded = useCallback((data: SalesEntry[], name: string) => {
    setSalesData(data);
    setFileName(name);
  }, []);

  const productOptions = useMemo(() => 
    Array.from(new Set(salesData.map((d) => d.product))).filter(Boolean).sort(),
    [salesData]
  );

  const zoneOptions = useMemo(() => 
    ["Toutes", ...Array.from(new Set(salesData.map((d) => d.zone))).filter(Boolean).sort()],
    [salesData]
  );

  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const filteredData = useMemo(() => {
    return salesData.filter((row) => {
      const isNotExcluded = !exclusions.includes(row.product);
      const matchesZone = selectedZone === "Toutes" || row.zone === selectedZone;
      return isNotExcluded && matchesZone;
    });
  }, [salesData, exclusions, selectedZone]);

const handleDownload = () => {
    // 1. Extraire toutes les zones uniques présentes dans vos données
    const zonesUniques = Array.from(new Set(filteredData.map(d => d.zone))).sort();

    // 2. Extraire tous les produits uniques
    const produitsUniques = Array.from(new Set(filteredData.map(d => d.product))).sort();

    // 3. Reconstruire les données horizontalement
    const rowsForExport = produitsUniques.map((productName) => {
      // Chaque ligne commence par le nom du produit
      const exportRow: Record<string, any> = {
        "PRODUIT": productName
      };

      // Pour chaque zone, on ajoute les colonnes Ventes et CA
      zonesUniques.forEach((zone) => {
        const entry = filteredData.find(d => d.product === productName && d.zone === zone);
        
        // On crée les entêtes dynamiques comme dans votre capture Excel
        exportRow[`${zone} (ventes)`] = entry ? entry.ventes : 0;
        exportRow[`${zone} (C A)`] = entry ? entry.ca : 0;
      });

      return exportRow;
    });

    // 4. Création du classeur Excel
    const ws = XLSX.utils.json_to_sheet(rowsForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Extraction Horizontale");

    // 5. Mise en forme (optionnelle) : ajuster la largeur des colonnes
    const colWidths = [{ wch: 40 }]; // Largeur pour la colonne Produit
    zonesUniques.forEach(() => {
      colWidths.push({ wch: 12 }, { wch: 15 }); // Largeur pour ventes et CA
    });
    ws['!cols'] = colWidths;

    // 6. Téléchargement
    XLSX.writeFile(wb, `Camed_Export_Horizontal_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    /* CONTENEUR PRINCIPAL : 
       'flex' pour mettre Sidebar et Main côte à côte.
       'h-screen' pour que l'app prenne toute la hauteur sans scroll global.
    */
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* 1. Sidebar : Garde sa propre largeur définie dans son composant */}
      <Sidebar />
      
      {/* 2. Zone de Contenu : 
         'flex-1' occupe tout l'espace restant.
         'overflow-y-auto' permet de scroller le tableau sans faire bouger la sidebar.
      */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
        
        {/* Header - Aligné proprement */}
        <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Extraction Camed
            </h1>
            <p className="text-slate-500 mt-1 italic">{fileName || "En attente de fichier..."}</p>
          </div>
          {salesData.length > 0 && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg"
            >
              <Download size={18} />
              Exporter (.xlsx)
            </button>
          )}
        </div>

        {/* Corps du dashboard */}
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Upload Card */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <FileUpload onDataLoaded={handleDataLoaded} />
          </div>

          {/* Filtres Rapides (Horizontaux sur PC) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button onClick={() => toggleAccordion("zones")} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors font-semibold text-slate-700">
                <div className="flex items-center gap-2"><Filter size={18} className="text-indigo-500"/> Zone</div>
                {accordionOpen.zones ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
              </button>
              {accordionOpen.zones && (
                <div className="p-4 border-t bg-slate-50/50">
                  <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)} className="w-full p-2 rounded border border-slate-300 text-sm outline-none">
                    {zoneOptions.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Colonnes */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button onClick={() => toggleAccordion("colonnes")} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors font-semibold text-slate-700">
                <div className="flex items-center gap-2"><Layers size={18} className="text-indigo-500"/> Colonnes</div>
                {accordionOpen.colonnes ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
              </button>
              {accordionOpen.colonnes && (
                <div className="p-4 border-t bg-slate-50/50 grid grid-cols-2 gap-2 text-xs">
                  {allColumns.map((col) => (
                    <label key={col} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                      <input type="checkbox" checked={visibleColumns.includes(col)} onChange={() => toggleColumn(col)} className="rounded text-indigo-600" />
                      <span className="capitalize">{col}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Exclusions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button onClick={() => toggleAccordion("produits")} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors font-semibold text-slate-700">
                <div className="flex items-center gap-2"><Trash2 size={18} className="text-red-400"/> Exclure ({exclusions.length})</div>
                {accordionOpen.produits ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
              </button>
              {accordionOpen.produits && (
                <div className="p-4 border-t bg-slate-50/50">
                  <div className="max-h-32 overflow-y-auto space-y-1 text-xs pr-2">
                    {productOptions.map((p) => (
                      <label key={p} className="flex items-center gap-2 py-1">
                        <input type="checkbox" checked={exclusions.includes(p)} onChange={() => setExclusions(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])} className="rounded text-red-500" />
                        <span className="truncate">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TABLEAU MODERNE (Celui-ci ne sera plus écrasé) */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
              <h3 className="flex items-center gap-2 font-bold text-slate-800 uppercase tracking-wider text-sm">
                <TableIcon size={18} className="text-indigo-600"/> Aperçu des données
              </h3>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                {filteredData.length} lignes
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    {visibleColumns.map((col) => (
                      <th key={col} className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        {col === "ca" ? "CHIFFRE D'AFFAIRES" : col.replace(/([A-Z])/g, ' $1')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.length > 0 ? (
                    filteredData.map((row, i) => (
                      <tr key={i} className="hover:bg-indigo-50/40 transition-colors">
                        {visibleColumns.map((col) => {
                          const val = (col === "ventes") ? ((row as any).ventes ?? (row as any).totalUnits) :
                                      (col === "ca") ? ((row as any).ca ?? (row as any).totalValue) : (row as any)[col];
                          return (
                            <td key={col} className="px-6 py-4 text-sm text-slate-700 font-medium">
                              {typeof val === 'number' && col === 'ca' 
                                ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(val) 
                                : val ?? "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={visibleColumns.length} className="px-6 py-10 text-center text-slate-400 italic">
                        Importez un fichier Camed pour voir les résultats.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}