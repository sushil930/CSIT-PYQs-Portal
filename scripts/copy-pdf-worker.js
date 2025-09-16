// Copies pdf.js worker from node_modules to public so react-pdf can load it from same-origin
const fs = require('fs');
const path = require('path');

function findWorkerPath() {
  // Prefer the pdfjs-dist that ships with react-pdf to ensure version match
  try {
    const nestedLegacy = path.join(process.cwd(), 'node_modules', 'react-pdf', 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.mjs');
    if (fs.existsSync(nestedLegacy)) return nestedLegacy;
  } catch {}
  try {
    const nestedStd = path.join(process.cwd(), 'node_modules', 'react-pdf', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
    if (fs.existsSync(nestedStd)) return nestedStd;
  } catch {}
  try {
    // Try legacy build first (recommended for broader compatibility)
    const legacyPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.mjs');
    if (fs.existsSync(legacyPath)) return legacyPath;
  } catch {}
  try {
    // Fallback to standard build path
    const stdPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
    if (fs.existsSync(stdPath)) return stdPath;
  } catch {}
  return null;
}

const src = findWorkerPath();
const dest = path.join(process.cwd(), 'public', 'pdf.worker.min.mjs');

if (!src) {
  console.warn('[copy-pdf-worker] Could not locate pdf.worker.min.js in pdfjs-dist. Skipping copy.');
  process.exit(0);
}

try {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  const size = fs.statSync(dest).size;
  // Attempt to read version
  let version = 'unknown';
  try {
    let pkgPath = src.includes(path.join('react-pdf', 'node_modules'))
      ? path.join(process.cwd(), 'node_modules', 'react-pdf', 'node_modules', 'pdfjs-dist', 'package.json')
      : path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'package.json');
    if (fs.existsSync(pkgPath)) {
      version = JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version || version;
    }
  } catch {}
  console.log(`[copy-pdf-worker] Copied worker (pdfjs-dist ${version}) to ${dest} (${size} bytes)`);
} catch (err) {
  console.error('[copy-pdf-worker] Failed to copy worker:', err.message);
  process.exit(1);
}
