// components/DataTable.tsx
export default function DataTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  // 🔍 Filtrer les colonnes vides ou nulles (aucune valeur utile dans la colonne)
  const columns = Object.keys(data[0]).filter((col) => {
    if (!col || col.trim() === "") return false;
    // garder seulement si au moins une valeur non vide existe dans cette colonne
    return data.some((row) => row[col] !== undefined && row[col] !== null && row[col] !== "");
  });

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">📋 Ventes par zone (format large)</h3>
      <div className="overflow-auto">
        <table className="table-auto w-full border-collapse border border-gray-400 shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="border border-gray-400 px-4 py-2 text-left font-medium text-gray-700 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col}
                    className="border border-gray-400 px-4 py-2 text-sm text-gray-800 whitespace-nowrap"
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
