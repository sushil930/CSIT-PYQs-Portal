# CSIT-PYQs Backend (Local Only)

This backend powers upload, search, and admin review for the CSIT PYQs Portal.

Local dev only. No production security guarantees yet.

## Quick start

1. Install deps
```
cd backend
npm install
```

2. Copy env
```
cp .env.example .env
```

3. Run dev
```
npm run dev
```

## Notes
- MongoDB can be local or Atlas.
- Cloudinary optional; if not configured, files are stored locally under `uploads/`.
- OCR uses tesseract.js and runs after upload (simple async).
