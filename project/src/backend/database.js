// backend/database.js
import sqlite3 from 'sqlite3';
sqlite3.verbose();

const db = new sqlite3.Database('/home/rachad/JOURNEE PORTE OUVERTE/project/visitors.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS visitors (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      sexe TEXT,
      age INTEGER,
      profession TEXT,
      email TEXT,
      telephone TEXT,
      dateParticipation TEXT,
      certificatGenere INTEGER DEFAULT 0
    )
  `);
});

export default db;
