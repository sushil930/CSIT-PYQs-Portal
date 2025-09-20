import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import papersRouter from './routes/papers.js';
import adminRouter from './routes/admin.js';

// Load env from backend/.env explicitly so it works no matter where you launch from
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Health route
app.get('/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// Mongo connection with improved error handling and fallback
const mongoPrimaryUri = process.env.MONGODB_URI;
const mongoFallbackUri = process.env.MONGODB_URI_FALLBACK || 'mongodb://127.0.0.1:27017/csit-pyqs';

if (mongoPrimaryUri) {
  let triedFallback = false;

  const connectWithRetry = async (attempt = 1) => {
    const usingFallback = triedFallback;
    const uriToUse = usingFallback ? mongoFallbackUri : mongoPrimaryUri;

    try {
      await mongoose.connect(uriToUse, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        maxPoolSize: 10,
        retryWrites: true,
        family: 4, // Prefer IPv4 to avoid some Windows/ISP IPv6 issues
      });
      console.log(`✅ MongoDB connected successfully (${usingFallback ? 'fallback' : 'primary'} URI)`);
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);

      if (/ETIMEDOUT|EAI_AGAIN/i.test(err.message)) {
        console.log('💡 Network/DNS timeout:');
        console.log('   - Check internet connection');
        console.log('   - If using MongoDB Atlas, ensure IP is allowed (0.0.0.0/0 for dev)');
        console.log('   - Corporate/VPN firewalls may block DNS SRV or port 27017');
        console.log('   - Try switching networks (e.g., mobile hotspot)');
      } else if (/authentication failed/i.test(err.message)) {
        console.log('💡 Authentication failed - verify username/password in MONGODB_URI');
      } else if (/ENOTFOUND/i.test(err.message)) {
        console.log('💡 DNS resolution failed - check MongoDB URI and DNS settings');
      }

      // Retry strategy: 3 attempts on current URI, then try fallback
      const nextAttempt = attempt + 1;
      const shouldSwitchToFallback = !usingFallback && nextAttempt > 3;

      if (shouldSwitchToFallback) {
        if (mongoFallbackUri) {
          triedFallback = true;
          console.log('🔁 Switching to fallback MongoDB URI (local) ...');
        }
      }

      console.log('⏳ Retrying connection in 5 seconds...');
      setTimeout(() => connectWithRetry(shouldSwitchToFallback ? 1 : nextAttempt), 5000);
    }
  };

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
  });

  connectWithRetry();
} else {
  console.warn('⚠️  MONGODB_URI not set. Skipping Mongo connection. Ensure backend/.env exists (not .env.example).');
}

app.use('/api/papers', papersRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
