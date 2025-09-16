import { Router } from 'express';
import upload from '../middlewares/upload.js';
import Paper from '../models/Paper.js';

const router = Router();

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    const { subject, semester, year, tags = '', uploader = 'anonymous' } = req.body;
    if (!subject || !semester || !year) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const paper = await Paper.create({
      subject,
      semester,
      year: Number(year),
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      fileUrl,
      uploader,
      status: 'pending',
    });

    res.json({ success: true, paperId: paper._id, fileUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

export default router;
