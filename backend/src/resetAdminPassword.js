import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from './models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env explicitly
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function main() {
  const [, , usernameArg, passwordArg] = process.argv;
  const username = (usernameArg || process.env.ADMIN_USERNAME || 'admin').trim();
  const newPassword = (passwordArg || process.env.NEW_ADMIN_PASSWORD || '').trim();

  if (!newPassword) {
    console.error('Usage: node src/resetAdminPassword.js <username> <newPassword>');
    console.error('Or set NEW_ADMIN_PASSWORD in backend/.env');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/csit-pyqs';

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log('Connected to MongoDB');

    let admin = await Admin.findOne({ username });
    if (!admin) {
      console.warn(`Admin user "${username}" not found. Creating a new one...`);
      admin = new Admin({ username, passwordHash: '' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    admin.passwordHash = passwordHash;
    await admin.save();

    console.log('✅ Admin password reset successful');
    console.log(`Username: ${username}`);
    console.log(`New Password: ${newPassword}`);
    console.log('Please store this password securely and change it after login.');
  } catch (err) {
    console.error('❌ Failed to reset admin password:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

main();
