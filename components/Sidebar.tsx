"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LogOut, User as UserIcon } from "lucide-react"; 
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "🏠 Tableau de bord", href: "/" },
  { label: "📦 Extraction Ubipharm", href: "/ubipharm" },
  { label: "🧾 Extraction Laborex", href: "/laborex" },
  { label: "🧾 Extraction Camed", href: "/camed" },
  { label: "📊 Analyse ECLA", href: "/analyse" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md">
      {/* Zone de sécurité pour l'encoche iPhone */}
      <div className="h-[env(safe-area-inset-top)] w-full" />

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Section Gauche : Logo & Titre */}
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-primary rounded-lg shadow-sm">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight text-gray-900">
                My MABOUI
              </h1>
              {user && (
                <p className="text-[10px] uppercase tracking-wider font-semibold text-blue-600">
                  Connecté : {user.fullName.split(' ')[0]}
                </p>
              )}
            </div>
          </div>

          {/* Section Droite : Actions & Menu */}
          <div className="flex items-center gap-2">
            {/* Bouton de déconnexion rapide (Desktop) */}
            <button 
              onClick={logout}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 p-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Quitter
            </button>

            {/* Toggle Menu Mobile */}
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              {open ? (
                <span className="text-xl font-bold text-gray-600 px-1">✕</span>
              ) : (
                <div className="space-y-1.5 p-1">
                  <span className="block w-6 h-0.5 bg-gray-600 rounded-full"></span>
                  <span className="block w-6 h-0.5 bg-gray-600 rounded-full"></span>
                  <span className="block w-6 h-0.5 bg-gray-600 rounded-full"></span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Mobile Dropdown */}
        {open && (
          <nav className="md:hidden mt-3 pb-3 space-y-1 animate-fade-in">
            <div className="px-4 py-2 mb-2 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{user?.fullName}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-red-500 active:scale-90 transition-transform"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>

            <hr className="border-gray-100 mb-2" />

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
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