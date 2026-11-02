import sqlite3 from 'sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultFile = path.resolve(here, '../../data/internships.db');
const dbFile = process.env.DATABASE_FILE ? path.resolve(process.cwd(), process.env.DATABASE_FILE) : defaultFile;
fs.mkdirSync(path.dirname(dbFile), { recursive: true });
export const db = new sqlite3.Database(dbFile);
export const run = (sql, params = []) => new Promise((resolve, reject) => db.run(sql, params, function (err) { err ? reject(err) : resolve({ id: this.lastID, changes: this.changes }); }));
export const get = (sql, params = []) => new Promise((resolve, reject) => db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));
export const all = (sql, params = []) => new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
export async function initializeDatabase() {
  await run(`CREATE TABLE IF NOT EXISTS internships (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, domain TEXT NOT NULL,
    mode TEXT NOT NULL CHECK(mode IN ('Remote','On-site','Hybrid')), location TEXT NOT NULL,
    skills TEXT NOT NULL DEFAULT '[]', openings INTEGER NOT NULL DEFAULT 1 CHECK(openings > 0),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  const count = await get('SELECT COUNT(*) AS count FROM internships');
  if (count.count === 0) {
    const seed = [
      ['Frontend Developer Intern','Web Development','Remote','India','["HTML","CSS","JavaScript","React"]',4],
      ['Node.js API Intern','Full Stack Development','Hybrid','Pune, India','["Node.js","Express","SQL"]',2],
      ['Data Analyst Intern','Data Science','On-site','Mumbai, India','["Python","SQL","Power BI"]',3],
      ['Embedded Systems Intern','Electronics','Remote','India','["C","Microcontrollers","UART"]',2]
    ];
    for (const row of seed) await run('INSERT INTO internships (title,domain,mode,location,skills,openings) VALUES (?,?,?,?,?,?)', row);
  }
}
