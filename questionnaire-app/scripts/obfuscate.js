import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const DIST_DIR = join(import.meta.dirname, '..', 'dist', 'assets');

// Skip vendor/library chunks — obfuscating them just bloats the bundle
const SKIP_PATTERNS = [
  'html2canvas',
  'index.es-',     // i18next
  'purify.es-',    // DOMPurify
  'workbox-',
  'Stats-',        // recharts
  'ThankYou-',     // jspdf
  'index-',        // React core
];

const OPTIONS = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.2,
  stringArray: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayThreshold: 0.5,
  stringArrayEncoding: ['base64'],
  splitStrings: true,
  splitStringsChunkLength: 10,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  selfDefending: false,
  target: 'browser',
};

function getJsFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...getJsFiles(full));
    } else if (entry.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = getJsFiles(DIST_DIR);
const files = allFiles.filter(f => {
  const name = f.split('/').pop();
  return !SKIP_PATTERNS.some(p => name.includes(p));
});
console.log(`Obfuscating ${files.length}/${allFiles.length} JS files (skipping vendor libs)...`);

for (const file of files) {
  const code = readFileSync(file, 'utf8');
  const result = JavaScriptObfuscator.obfuscate(code, OPTIONS);
  writeFileSync(file, result.getObfuscatedCode());
  const originalKB = (code.length / 1024).toFixed(1);
  const obfuscatedKB = (result.getObfuscatedCode().length / 1024).toFixed(1);
  console.log(`  ${file.split('/').pop()}: ${originalKB}KB → ${obfuscatedKB}KB`);
}

console.log('Obfuscation complete.');
