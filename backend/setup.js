const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up SolveHub Backend...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from .env.example...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created. Please update it with your configuration.\n');
  } else {
    console.log('⚠️  .env.example not found. Please create .env manually.\n');
  }
} else {
  console.log('✅ .env file already exists.\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed.\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Generate Prisma Client
console.log('🔧 Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated.\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client:', error.message);
  console.log('Please run: npm run prisma:generate\n');
}

console.log('✅ Setup complete!\n');
console.log('Next steps:');
console.log('1. Update .env with your MongoDB connection string');
console.log('2. Run: npm run prisma:migrate (if needed)');
console.log('3. Run: npm run prisma:seed (optional - adds sample data)');
console.log('4. Run: npm run dev (start development server)');
console.log('\nHappy coding! 🎉');
