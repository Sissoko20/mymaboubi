"use client";

import { useCallback, useState } from "react";
import { Upload, FileSpreadsheet, X, Loader2 } from "lucide-react";
import { parseExcelFile } from "@/lib/excelParser";
import { SalesEntry } from "@/types/sales";

interface FileUploadProps {
  onDataLoaded: (data: SalesEntry[], fileName: string) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError("Veuillez sélectionner un fichier Excel (.xlsx ou .xls)");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const data = await parseExcelFile(file);
      
      if (data.length === 0) {
        setError("Aucune donnée valide trouvée dans le fichier. Vérifiez le format.");
        setIsLoading(false);
        return;
      }

      onDataLoaded(data, file.name);
    } catch (err) {
      console.error("Error parsing file:", err);
      setError("Erreur lors de la lecture du fichier. Vérifiez le format.");
    } finally {
      setIsLoading(false);
    }
  }, [onDataLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const clearError = () => {
    setError(null);
    setFileName(null);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Charger un fichier de ventes
        </h3>
        <p className="text-sm text-muted-foreground">
          Glissez-déposez ou sélectionnez un fichier Excel (.xlsx)
        </p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
          ${isLoading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Analyse en cours...</p>
            {fileName && (
              <p className="text-xs text-muted-foreground">{fileName}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Glissez votre fichier ici
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                ou <span className="text-primary font-medium">cliquez pour parcourir</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Format attendu: VENTES_PAR_ZONE_*.xlsx</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
          <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <button 
              onClick={clearError}
              className="text-xs text-destructive/70 hover:text-destructive mt-1"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Format attendu:</strong> Fichier Excel avec colonnes PRODUCTS, NRV/CIF, LABOREX, UBIPHARM, CAMED par zone. 
          Les lignes décoratives (Power Brand, Top 10, etc.) seront ignorées automatiquement.
        </p>
      </div>
    </div>
  );
}
