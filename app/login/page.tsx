"use client";

import { useState } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
// CORRECTION : Importation du bon Link
import Link from 'next/link'; 
// CORRECTION : Importation des icônes séparément
import { BarChart3, LogIn, UserPlus } from 'lucide-react'; 

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.login(username, password);
      router.push('/'); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-sm">
        {/* Logo ou Titre */}
        <div className="text-center mb-8">
          <BarChart3 className="h-10 w-10 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">My MABOUI</h1>
          <p className="text-gray-500 mt-2">Gestion & Analyse de données</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Connexion</h2>
          
          <div className="space-y-4">
            <input 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="Nom d'utilisateur"
              autoCapitalize='none'
              autoCorrect='off'
              spellCheck='false'
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            
            <input 
              type="password"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="Mot de passe"
              autoCapitalize='none'
              autoCorrect='off'
              spellCheck='false'
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="h-5 w-5" />
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Section Invitation Inscription */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm mb-4">Nouveau sur l'application ?</p>
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center gap-2 w-full py-4 border-2 border-blue-600 text-blue-600 rounded-2xl font-bold active:scale-95 transition-transform bg-transparent"
          >
            <UserPlus className="h-5 w-5" />
            Créer un compte professionnel
          </Link>
        </div>
      </div>
    </div>
  );
}