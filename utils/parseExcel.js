import * as XLSX from "xlsx";

export const parseExcel = async (file) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });

  const zones = {};

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const headers = jsonData[0];
    const rows = jsonData.slice(1);

    zones[sheetName] = rows.map((row) => ({
      product: row[0],
      nrv: row[1],
      units: row[2],
      laborex: row[3],
      ubipharm: row[4],
      camed: row[5],
    }));
  });

  return zones;
};
export default parseExcel;