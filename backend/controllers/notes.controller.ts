import { Request, Response } from 'express'
import pool from "../config/db";
import redisClient from "../config/redis";

export const createNotes = async(req: Request, res: Response) =>{
    try{
        const user = (req as any).user;
        const { title, content } = req.body;
        
        if(!title || !content) res.status(400).json({ error: "title and content are required"});
        const query = `INSERT INTO notes(user_id, title, content) VALUES $($1, $2, $3) RETURNING *`;
        const { rows } = await pool.query(query, [user.id, title, content]);

        await redisClient.set(`note:${rows[0].id}`, JSON.stringify(rows[0]), { EX: 3600 });

        return res.status(201).json({ note: rows[0] });

    }catch(err: unknown){
        console.error(err);
        return res.status(500).json({ error: "Failed to create note" });
    }
}

