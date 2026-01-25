export default function DataTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  // 🔍 Filtrer les colonnes vides ou inutiles
  const columns = Object.keys(data[0]).filter((col) => {
    if (!col || col.trim() === "") return false;
    return data.some((row) => row[col] !== undefined && row[col] !== null && row[col] !== "");
  });

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">📋 Ventes par zone (format large)</h3>
      <div className="overflow-auto">
        <table className="table-auto min-w-max w-full border-collapse border border-gray-300 shadow-sm font-sans text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {columns.map((col) => {
                  const value = row[col];
                  const isNumeric = typeof value === "number" || /^\d/.test(value);

                  // Styliser les valeurs entre parenthèses
                  const formattedValue =
                    typeof value === "string" && value.includes("(") ? (
                      <>
                        {value.split("(")[0].trim()}{" "}
                        <span className="text-gray-500">({value.split("(")[1]}</span>
                      </>
                    ) : (
                      value
                    );

                  return (
                    <td
                      key={col}
                      className={`border border-gray-300 px-4 py-3 whitespace-nowrap text-gray-900 ${
                        isNumeric ? "text-right" : "text-left"
                      }`}
                    >
                      {formattedValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
