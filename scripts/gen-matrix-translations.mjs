import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));

function getFiles(dir, ext = ['.ts', '.tsx']) {
  const res = [];
  if (!existsSync(dir)) return res;
  for (const item of readdirSync(dir)) {
    if (['node_modules', '.git', '.expo', 'dist'].includes(item)) continue;
    const p = join(dir, item);
    const s = statSync(p);
    if (s.isDirectory()) {
      res.push(...getFiles(p, ext));
    } else if (ext.some((e) => p.endsWith(e))) {
      res.push(p);
    }
  }
  return res;
}

const files = [...getFiles(join(root, 'app')), ...getFiles(join(root, 'src', 'components'))];
const keys = new Set();

for (const f of files) {
  const content = readFileSync(f, 'utf-8');
  for (const m of content.matchAll(/\bt\(\s*['"]((?:[^'"\\]|\\.)*)['"]/g)) {
    keys.add(m[1]);
  }
}

const sortedKeys = Array.from(keys).sort();
console.log(`[gen-matrix-translations] Found ${sortedKeys.length} unique UI & TEKST translation keys.`);

let code = `import { t } from '../src/lib/i18n';

describe('AST Matrix UI & TEKST Coverage (BR-TEST-028)', () => {
  const ALL_UI_AND_TEXT_KEYS = [
`;

for (const k of sortedKeys) {
  code += `    ${JSON.stringify(k)},\n`;
}

code += `  ];

  it('translates all UI & TEKST keys to non-empty string in active locale (100% matrix coverage)', () => {
    for (const key of ALL_UI_AND_TEXT_KEYS) {
      expect(t(key)).toBeTruthy();
    }
  });
});
`;

const target = join(root, 'tests', 'matrix-translations.test.ts');
writeFileSync(target, code, 'utf-8');
console.log(`[gen-matrix-translations] Wrote ${target}`);
