import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));

console.log('[check:licenses] Verifying licenses of production dependencies...');

const ALLOWED_LICENSES = new Set([
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'ISC',
  'CC0-1.0',
  'Unlicense',
  '0BSD',
]);

const FORBIDDEN_LICENSES = [
  /\bAGPL\b/i,
  /\bGPL\b/i,
  /\bSSPL\b/i,
  /\bCC-BY-NC\b/i,
];

const deps = Object.keys(pkg.dependencies || {});
const violations = [];

for (const dep of deps) {
  const depPkgPath = join(root, 'node_modules', dep, 'package.json');
  if (!existsSync(depPkgPath)) {
    continue;
  }
  const depPkg = JSON.parse(readFileSync(depPkgPath, 'utf-8'));
  const license = typeof depPkg.license === 'string'
    ? depPkg.license
    : depPkg.license?.type || depPkg.licenses?.[0]?.type || 'UNKNOWN';

  for (const forbidden of FORBIDDEN_LICENSES) {
    if (forbidden.test(license)) {
      violations.push({ dep, license, reason: 'Viral copyleft / Non-commercial license' });
    }
  }
}

if (violations.length > 0) {
  console.error('[check:licenses] ✗ LICENSE VIOLATIONS DETECTED:');
  for (const v of violations) {
    console.error(`  - ${v.dep}: ${v.license} (${v.reason})`);
  }
  process.exit(1);
}

console.log(`[check:licenses] ✓ All ${deps.length} production dependencies verified and compliant.`);
