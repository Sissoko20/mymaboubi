"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileSpreadsheet } from "lucide-react"; // icons
import { useState } from "react";

const navItems = [
  { label: "🏠 Tableau de bord", href: "/" },
  { label: "📦 Extraction Ubipharm", href: "/ubipharm" },
  { label: "🧾 Extraction Laborex", href: "/laborex" },
   { label: "🧾 Extraction Camed", href: "/camed" },
  { label: "📊 Analyse ECLA", href: "/analyse" },
];

export default function Header({ fileName }: { fileName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + titre */}
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-primary rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">
                My MABOUI
              </h1>
              <p className="text-xs text-muted-foreground">
                Tableau de bord des ventes
              </p>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium ${
                  pathname === item.href
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Fichier actif */}
          {fileName && (
            <div className="hidden md:flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg">
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {fileName}
              </span>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md border border-gray-300"
          >
            {open ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile navigation */}
        {open && (
          <nav className="md:hidden mt-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-md ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
