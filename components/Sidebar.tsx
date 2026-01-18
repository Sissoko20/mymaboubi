"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "🏠 Tableau de bord", href: "/" },
  { label: "📊 Extraction Ubipharm", href: "/ubipharm" },
  { label: "🧾 Extraction Laborex", href: "/laborex" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
     <aside className="w-64 min-h-screen bg-white shadow-md p-6 text-gray-800 flex-shrink-0">

        <img src="logo.png" alt="Logo" className="w-24 mb-8" />
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`block px-4 py-2 rounded-md cursor-pointer ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile navbar */}
      <div className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <img src="/assets/logo.png" alt="Logo" className="w-20" />
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md border border-gray-300"
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <nav className="md:hidden bg-gray-50 shadow-md p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`block px-4 py-2 rounded-md cursor-pointer ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setOpen(false)} // fermer menu après clic
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
