const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'apps', 'docs', 'dist');
const targetDir = path.join(rootDir, 'dist');

if (!fs.existsSync(sourceDir)) {
  console.error(`Docs build output not found at ${sourceDir}`);
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log(`Docs build output copied to ${targetDir}`);
