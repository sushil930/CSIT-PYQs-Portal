import { Router } from 'express';
import upload from '../middlewares/upload.js';
import Paper from '../models/Paper.js';
import fs from 'fs/promises';
import cloudinaryPkg from 'cloudinary';

const cloudinary = cloudinaryPkg.v2;
const hasCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// In development, auto-approve new uploads so they show up immediately in Results
const autoApproveUploads = process.env.AUTO_APPROVE_UPLOADS === 'true' || process.env.NODE_ENV !== 'production';

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const router = Router();

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    const { subject, semester, year, tags = '', uploader = 'anonymous', department } = req.body;
    if (!subject || !year) {
      return res.status(400).json({ success: false, error: 'Missing required fields: subject, year' });
    }

    let fileUrl = `/uploads/${req.file.filename}`;

    if (hasCloudinary) {
      try {
        const uploadRes = await cloudinary.uploader.upload(req.file.path, {
          resource_type: 'raw',
          folder: 'csit-pyqs/papers',
          use_filename: true,
          unique_filename: true,
        });
        fileUrl = uploadRes.secure_url;
      } catch (e) {
        console.error('Cloudinary upload failed, falling back to local:', e.message);
      } finally {
        // Clean up local file regardless of upload success to avoid clutter
        try { await fs.unlink(req.file.path); } catch {}
      }
    }

    const paper = await Paper.create({
      subject,
      department,
      semester: semester || '',
      year: Number(year),
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      fileUrl,
      uploader,
      status: autoApproveUploads ? 'ready' : 'pending',
    });

    res.json({ success: true, paperId: paper._id, fileUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

export default router;

// List papers with filters
router.get('/', async (req, res) => {
  try {
    const { subject, department, semester, year, tags, q, status = 'ready', sort = 'newest', limit = 20 } = req.query;
    const filter = {};
    if (subject) filter.subject = new RegExp(subject, 'i');
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (year) filter.year = Number(year);
    if (status && status !== 'all') filter.status = status;
    if (tags) filter.tags = { $in: tags.split(',').map((t) => t.trim()).filter(Boolean) };
    if (q) {
      filter.$or = [
        { subject: new RegExp(q, 'i') },
        { extractedText: new RegExp(q, 'i') },
      ];
    }

    let sortSpec = { createdAt: -1 };
    if (sort === 'downloads') sortSpec = { downloads: -1 };
    if (sort === 'oldest') sortSpec = { createdAt: 1 };

    const docs = await Paper.find(filter).sort(sortSpec).limit(Number(limit));
    res.json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    console.error('List papers error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch papers' });
  }
});

// Get paper by id
router.get('/:id', async (req, res) => {
  try {
    const doc = await Paper.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid id' });
  }
});
