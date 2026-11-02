import * as service from '../services/internshipService.js';
import { createInternshipSchema, updateInternshipSchema } from '../validators/internshipSchemas.js';
const send = (res, data, status = 200) => res.status(status).json({ success: true, data });
const parseId = req => { const id = Number(req.params.id); return Number.isSafeInteger(id) && id > 0 ? id : null; };
export async function list(req,res) {
  const page = Number(req.query.page ?? 1), limit = Number(req.query.limit ?? 10);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) return res.status(400).json({success:false,error:{code:'INVALID_PAGINATION',message:'page must be >= 1 and limit must be between 1 and 100'}});
  return send(res, await service.listInternships({page,limit,domain:req.query.domain,search:req.query.search}));
}
export async function getOne(req,res) { const id=parseId(req); if (!id) return res.status(400).json({success:false,error:{code:'INVALID_ID',message:'Internship id must be a positive integer'}}); const item=await service.getInternship(id); return item ? send(res,item) : res.status(404).json({success:false,error:{code:'NOT_FOUND',message:'Internship not found'}}); }
export async function create(req,res) { const parsed=createInternshipSchema.safeParse(req.body); if(!parsed.success) return res.status(400).json({success:false,error:{code:'VALIDATION_ERROR',message:'Request validation failed',details:parsed.error.issues}}); return send(res,await service.createInternship(parsed.data),201); }
export async function update(req,res) { const id=parseId(req); if(!id) return res.status(400).json({success:false,error:{code:'INVALID_ID',message:'Internship id must be a positive integer'}}); const parsed=updateInternshipSchema.safeParse(req.body); if(!parsed.success) return res.status(400).json({success:false,error:{code:'VALIDATION_ERROR',message:'Request validation failed',details:parsed.error.issues}}); const item=await service.updateInternship(id,parsed.data); return item ? send(res,item) : res.status(404).json({success:false,error:{code:'NOT_FOUND',message:'Internship not found'}}); }
export async function remove(req,res) { const id=parseId(req); if(!id) return res.status(400).json({success:false,error:{code:'INVALID_ID',message:'Internship id must be a positive integer'}}); const removed=await service.deleteInternship(id); return removed ? send(res,{message:'Internship deleted successfully'}) : res.status(404).json({success:false,error:{code:'NOT_FOUND',message:'Internship not found'}}); }
