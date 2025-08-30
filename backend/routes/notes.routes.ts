import { Router } from 'express'
import {createNotes, deleteNotes, getNotes  } from '../controllers/notes.controller';
import { authenticateToken } from '../middlewares/auth.middleware'
const router = Router();

router.post('/create-notes', authenticateToken, createNotes);
router.post('/delete-notes', authenticateToken, deleteNotes);
router.get('/', authenticateToken, getNotes); // ✅ fetch notes

export default router;