/**
 * Spartans Facility Management - Standalone Admin Portal Account Generator Script
 * DigiCoders Technologies Private Limited
 * 
 * Usage: node scripts/create-admin.js <email> <password> <name>
 * Example: node scripts/create-admin.js admin@spartansfacility.com admin123 "Pranjal Gupta"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const email = process.argv[2] || 'admin@spartansfacility.com';
const password = process.argv[3] || 'admin123';
const name = process.argv[4] || 'Pranjal Gupta';

console.log('\n======================================================');
console.log('🛡️  SPARTANS FACILITY MANAGEMENT - STANDALONE ADMIN CREATOR');
console.log('======================================================\n');

if (password.length < 6) {
  console.error('❌ Error: Password must be at least 6 characters long.');
  process.exit(1);
}

const adminConfig = {
  name: name,
  email: email,
  role: 'Super Administrator',
  avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'PG',
  phone: '+91-8299726346',
  passwordHash: password,
  createdAt: new Date().toISOString()
};

const outputPath = path.join(__dirname, '../src/admin-credentials.json');

fs.writeFileSync(outputPath, JSON.stringify(adminConfig, null, 2), 'utf-8');

console.log('✅ Admin account configured successfully for Standalone Portal!');
console.log(`👤 Name:     ${adminConfig.name}`);
console.log(`📧 Email:    ${adminConfig.email}`);
console.log(`🔑 Password: ${password}`);
console.log(`🔐 Role:     ${adminConfig.role}`);
console.log(`📂 Stored in: ${outputPath}`);
console.log('\nUse these credentials to log in at: http://localhost:5174/login');
console.log('======================================================\n');
