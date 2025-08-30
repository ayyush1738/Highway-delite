import { Router } from 'express'
import {createNotes, deleteNotes } from '../controllers/notes.controller';
import { authenticateToken } from '../middlewares/auth.middleware'
const router = Router();

router.post('/create-notes', authenticateToken, createNotes);
router.post('/delete-notes', authenticateToken, deleteNotes);

export default router;