import * as XLSX from "xlsx";

export const parseExcel = async (file) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });

  const zones = {};

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // On saute les lignes vides
    const rows = jsonData.filter((row) => row && row.length > 0);

    // Fonction de nettoyage des nombres
    const safeNumber = (val) => {
      if (typeof val === "string") {
        return Number(val.replace(",", ".").trim()) || 0;
      }
      return Number(val) || 0;
    };

    const zoneTotals = {};

    rows.forEach((row) => {
      const product = row[0] ? String(row[0]).trim() : "";
      const nrv = safeNumber(row[1]);
      const laborex = safeNumber(row[2]);
      const ubipharm = safeNumber(row[3]);
      const camed = safeNumber(row[4]);

      // On ignore les lignes décoratives
      if (!product || product.toLowerCase().includes("total")) return;

      const cumulPharmacies = laborex + ubipharm + camed;
      const totalSales = nrv * cumulPharmacies;

      if (!zoneTotals[sheetName]) {
        zoneTotals[sheetName] = {
          zone: sheetName,
          products: [],
          totalSales: 0,
          totalUnits: 0,
        };
      }

      zoneTotals[sheetName].products.push({
        product,
        nrv,
        laborex,
        ubipharm,
        camed,
        cumulPharmacies,
        totalSales,
      });

      zoneTotals[sheetName].totalSales += totalSales;
      zoneTotals[sheetName].totalUnits += cumulPharmacies;
    });

    zones[sheetName] = zoneTotals[sheetName];
  });

  return zones;
};
