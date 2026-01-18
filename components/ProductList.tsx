// components/ProductList.tsx
export default function ProductList({
  produits,
  exclusions,
  onToggle,
}: {
  produits: string[];
  exclusions: string[];
  onToggle: (prod: string) => void;
}) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">🚫 Produits à exclure</h3>
      <ul className="space-y-2">
        {produits.map((p) => (
          <li key={p}>
            <button
              onClick={() => onToggle(p)}
              className={`w-full text-left px-4 py-2 rounded border ${
                exclusions.includes(p)
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
