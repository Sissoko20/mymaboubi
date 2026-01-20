import * as XLSX from "xlsx";

export const parseExcel = async (file) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });

  const zones = {};

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // On saute les lignes vides ou décoratives
    const rows = jsonData.filter(
      (row) => row && row.length > 0 && typeof row[0] === "string"
    );

    // Exemple : structure typique
    // [Produit, NRV, Units, Laborex, Ubipharm, CAMED]
    zones[sheetName] = rows.map((row) => ({
      product: row[0] || "",
      nrv: Number(row[1]) || 0,
      units: Number(row[2]) || 0,
      laborex: Number(row[3]) || 0,
      ubipharm: Number(row[4]) || 0,
      camed: Number(row[5]) || 0,
    }));
  });

  return zones;
};
