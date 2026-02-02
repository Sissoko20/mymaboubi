import Dexie, { type Table } from 'dexie';

export interface User {
  id?: number;
  username: string;
  password: string; // En production, il faut hasher le mot de passe !
  fullName: string;
  role: 'admin' | 'user';
  lastLogin: Date;
}

export class MyDatabase extends Dexie {
  users!: Table<User>; 

  constructor() {
    super('MymaboubiDB');
    this.version(1).stores({
      users: '++id, username' // 'username' est indexé pour des recherches rapides
    });
  }
}

export const db = new MyDatabase();