import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import fs from 'node:fs';
process.env.DATABASE_FILE = './data/test-internships.db';
const { app } = await import('../src/app.js');
const { initializeDatabase, run, db } = await import('../src/config/database.js');
const sample = {title:'QA Engineer Intern',domain:'Software Testing',mode:'Remote',location:'India',skills:['Testing','JavaScript'],openings:3};
beforeAll(async()=>{ if(fs.existsSync('./data/test-internships.db')) fs.unlinkSync('./data/test-internships.db'); await initializeDatabase(); });
beforeEach(async()=>{ await run('DELETE FROM internships'); });
afterAll(()=>db.close());
describe('Internship API',()=>{
 it('returns health status',async()=>{const r=await request(app).get('/api/health');expect(r.status).toBe(200);expect(r.body.data.status).toBe('healthy');});
 it('creates and reads an internship',async()=>{const c=await request(app).post('/api/internships').send(sample);expect(c.status).toBe(201);const g=await request(app).get(`/api/internships/${c.body.data.id}`);expect(g.status).toBe(200);expect(g.body.data.skills).toEqual(sample.skills);});
 it('rejects invalid payloads',async()=>{const r=await request(app).post('/api/internships').send({...sample,openings:0});expect(r.status).toBe(400);expect(r.body.error.code).toBe('VALIDATION_ERROR');});
 it('supports filtering and pagination',async()=>{await request(app).post('/api/internships').send(sample);const r=await request(app).get('/api/internships?page=1&limit=5&search=QA');expect(r.status).toBe(200);expect(r.body.data.pagination.total).toBe(1);});
 it('updates and deletes records',async()=>{const c=await request(app).post('/api/internships').send(sample);const id=c.body.data.id;expect((await request(app).patch(`/api/internships/${id}`).send({openings:5})).body.data.openings).toBe(5);expect((await request(app).delete(`/api/internships/${id}`)).status).toBe(200);});
 it('returns a consistent 404 for unknown records',async()=>{const r=await request(app).get('/api/internships/99999');expect(r.status).toBe(404);expect(r.body.error.code).toBe('NOT_FOUND');});
});
