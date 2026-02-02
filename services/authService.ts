import { db, User } from '../lib/db';

export const authService = {
  // Créer un compte
  async register(username: string, password: string, fullName: string) {
    const exists = await db.users.where({ username }).first();
    if (exists) throw new Error("Cet utilisateur existe déjà.");
    
    return await db.users.add({
      username,
      password,
      fullName,
      role: 'user',
      lastLogin: new Date()
    });
  },

  // Se connecter
  async login(username: string, password: string) {
    const user = await db.users.where({ username }).first();
    
    if (!user || user.password !== password) {
      throw new Error("Identifiants incorrects.");
    }

    // Update last login
    await db.users.update(user.id!, { lastLogin: new Date() });
    
    // On stocke une session légère en local (ou via un store d'état)
    localStorage.setItem('currentUser', JSON.stringify({ 
      username: user.username, 
      fullName: user.fullName 
    }));
    
    return user;
  }
};