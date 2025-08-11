import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // query params
    const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const offsetRaw = Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset;

    const limit = Math.min(Math.max(parseInt(limitRaw as string, 10) || 10, 1), 100); 
    const offset = Math.max(parseInt(offsetRaw as string, 10) || 0, 0);              

    // Count & fetch
    const [total, users] = await Promise.all([
      User.countDocuments({}),
      User.find({})
        .sort({ created_at: -1 }) // newest first
        .skip(offset)
        .limit(limit)
        .lean()
    ]);

    return res.json({
      data: users,
      pagination: {
        total,
        limit,
        offset
      }
    });
  } catch (err) {
    next(err)
  }
};
