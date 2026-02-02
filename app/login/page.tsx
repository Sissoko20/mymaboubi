"use client";
import { useState } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(username, password);
      router.push('/'); // Redirection vers le dashboard
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <input 
          className="w-full p-3 mb-4 border rounded-xl" 
          placeholder="Nom d'utilisateur"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password"
          className="w-full p-3 mb-6 border rounded-xl" 
          placeholder="Mot de passe"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold active:scale-95 transition-transform">
          Se connecter
        </button>
      </form>
    </div>
  );
}