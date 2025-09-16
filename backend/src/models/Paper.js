import mongoose from 'mongoose';

const PaperSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, index: true },
    semester: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    tags: { type: [String], default: [], index: true },
    fileUrl: { type: String, required: true },
    uploader: { type: String, default: 'anonymous' },
    status: { type: String, enum: ['pending', 'ready', 'rejected'], default: 'pending', index: true },
    extractedText: { type: String, default: '' },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Paper || mongoose.model('Paper', PaperSchema);
