// components/ProductAccordion.tsx
'use client';
import { useState } from "react";

export default function ProductAccordion({
  produits,
  exclusions,
  onToggle,
}: {
  produits: string[];
  exclusions: string[];
  onToggle: (prod: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6 border rounded shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold"
      >
        🚫 Produits à exclure
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="p-4 max-h-64 overflow-y-auto">
          <ul className="space-y-2">
            {produits.map((p) => (
              <li key={p} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exclusions.includes(p)}
                  onChange={() => onToggle(p)}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-800">{p}</label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
