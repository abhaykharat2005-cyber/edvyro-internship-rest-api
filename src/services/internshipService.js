import { all, get, run } from '../config/database.js';
const map = row => row && ({ ...row, skills: JSON.parse(row.skills) });
export async function listInternships({ page, limit, domain, search }) {
  const where = []; const values = [];
  if (domain) { where.push('domain = ?'); values.push(domain); }
  if (search) { where.push('(title LIKE ? OR domain LIKE ? OR location LIKE ?)'); values.push(...Array(3).fill(`%${search}%`)); }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const total = (await get(`SELECT COUNT(*) AS count FROM internships ${clause}`, values)).count;
  const rows = await all(`SELECT * FROM internships ${clause} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`, [...values, limit, (page - 1) * limit]);
  return { items: rows.map(map), pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}
export async function getInternship(id) { return map(await get('SELECT * FROM internships WHERE id = ?', [id])); }
export async function createInternship(data) {
  const result = await run('INSERT INTO internships (title,domain,mode,location,skills,openings) VALUES (?,?,?,?,?,?)', [data.title,data.domain,data.mode,data.location,JSON.stringify(data.skills),data.openings]);
  return getInternship(result.id);
}
export async function updateInternship(id, data) {
  const current = await getInternship(id); if (!current) return null;
  const next = { ...current, ...data };
  await run('UPDATE internships SET title=?,domain=?,mode=?,location=?,skills=?,openings=?,updated_at=CURRENT_TIMESTAMP WHERE id=?', [next.title,next.domain,next.mode,next.location,JSON.stringify(next.skills),next.openings,id]);
  return getInternship(id);
}
export async function deleteInternship(id) {
  const result = await run('DELETE FROM internships WHERE id = ?', [id]); return result.changes > 0;
}
