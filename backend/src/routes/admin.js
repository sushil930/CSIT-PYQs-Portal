import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Admin verification middleware
export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
};

// Get admin dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const Paper = (await import('../models/Paper.js')).default;
    
    const [
      totalPapers,
      pendingPapers,
      readyPapers,
      totalDownloads
    ] = await Promise.all([
      Paper.countDocuments(),
      Paper.countDocuments({ status: 'pending' }),
      Paper.countDocuments({ status: 'ready' }),
      Paper.aggregate([{ $group: { _id: null, total: { $sum: '$downloads' } } }])
    ]);

    res.json({
      success: true,
      stats: {
        totalPapers,
        pendingPapers,
        readyPapers,
        totalDownloads: totalDownloads[0]?.total || 0
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// Get pending papers for approval
router.get('/pending', verifyAdmin, async (req, res) => {
  try {
    const Paper = (await import('../models/Paper.js')).default;
    
    const pendingPapers = await Paper.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: pendingPapers
    });
  } catch (err) {
    console.error('Pending papers error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch pending papers' });
  }
});

// Get all papers for management
router.get('/papers', verifyAdmin, async (req, res) => {
  try {
    const Paper = (await import('../models/Paper.js')).default;
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    
    const papers = await Paper.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Paper.countDocuments(query);

    res.json({
      success: true,
      data: papers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('All papers error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch papers' });
  }
});

// Approve/reject paper
router.patch('/papers/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const paperId = req.params.id;

    if (!['ready', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const Paper = (await import('../models/Paper.js')).default;
    const paper = await Paper.findByIdAndUpdate(
      paperId,
      { status },
      { new: true }
    );

    if (!paper) {
      return res.status(404).json({ success: false, error: 'Paper not found' });
    }

    res.json({
      success: true,
      data: paper
    });
  } catch (err) {
    console.error('Update paper status error:', err);
    res.status(500).json({ success: false, error: 'Failed to update paper status' });
  }
});

// Update paper details
router.put('/papers/:id', verifyAdmin, async (req, res) => {
  try {
    const paperId = req.params.id;
    const { subject, department, year, semester, fileName } = req.body;

    if (!subject || !department || !year || !semester) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const Paper = (await import('../models/Paper.js')).default;
    const paper = await Paper.findByIdAndUpdate(
      paperId,
      { 
        subject: subject.trim(),
        department: department.trim(),
        year: parseInt(year),
        semester: semester.trim(),
        fileName: fileName?.trim(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!paper) {
      return res.status(404).json({ success: false, error: 'Paper not found' });
    }

    res.json({
      success: true,
      data: paper,
      message: 'Paper updated successfully'
    });
  } catch (err) {
    console.error('Update paper error:', err);
    res.status(500).json({ success: false, error: 'Failed to update paper' });
  }
});

// Delete paper permanently
router.delete('/papers/:id', verifyAdmin, async (req, res) => {
  try {
    const paperId = req.params.id;
    const Paper = (await import('../models/Paper.js')).default;
    
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({ success: false, error: 'Paper not found' });
    }

    // Delete the paper from database
    await Paper.findByIdAndDelete(paperId);

    // Optional: Delete the physical file
    // const fs = await import('fs/promises');
    // const path = await import('path');
    // if (paper.filePath) {
    //   try {
    //     await fs.unlink(paper.filePath);
    //   } catch (fileErr) {
    //     console.error('File deletion error:', fileErr);
    //   }
    // }

    res.json({
      success: true,
      message: 'Paper deleted successfully'
    });
  } catch (err) {
    console.error('Delete paper error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete paper' });
  }
});

export default router;