// ============================================================================
// Apps4Brew Studio — SQL Security & Parameterized Query Guard (GAP-SEC-01, W9)
// Enforces 100% parameterized queries via '?' and forbids SQL template interpolation
// ============================================================================

import fs from 'fs';
import path from 'path';

describe('SQL Security & Parameterized Query Guard (GAP-SEC-01, W9/SEC)', () => {
  const dataDir = path.resolve(__dirname, '../../src/data');
  const dbFiles = fs.readdirSync(dataDir).filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'));

  it('SEC-SQL-01: forbids template string interpolation in all SQL query executions', () => {
    // Regex matches db.runAsync(`...${...}...`), db.getAllAsync(`...${...}...`), db.getFirstAsync(`...${...}...`)
    const dangerousSqlInterpolation = /db\.(runAsync|getAllAsync|getFirstAsync|execAsync)\s*\(\s*`[^`]*\$\{[^}]+\}[^`]*`/g;

    for (const file of dbFiles) {
      const fullPath = path.join(dataDir, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const matches = content.match(dangerousSqlInterpolation);

      if (matches) {
        throw new Error(
          `[SEC-SQL Violation] Found non-parameterized SQL query interpolation in ${file}:\n${matches.join('\n')}\nUse '?' placeholders with parameterized argument arrays.`
        );
      }
    }
  });

  it('SEC-SQL-02: verifies that dynamic queries in sqlite-store.ts supply argument arrays', () => {
    const storePath = path.join(dataDir, 'sqlite-store.ts');
    const content = fs.readFileSync(storePath, 'utf-8');

    // Count calls to db.runAsync with placeholders '?'
    const runAsyncWithPlaceholders = /db\.runAsync\s*\(\s*[`'"][^`'"]*\?[^`'"]*[`'"]\s*,/g;
    const runMatches = content.match(runAsyncWithPlaceholders);
    expect(runMatches).not.toBeNull();
    expect(runMatches!.length).toBeGreaterThanOrEqual(10);

    // Count calls to db.getAllAsync / db.getFirstAsync with placeholders '?'
    const getWithPlaceholders = /db\.(getAllAsync|getFirstAsync)\s*(<[^>]*>)?\s*\(\s*[`'"][^`'"]*\?[^`'"]*[`'"]\s*,/g;
    const getMatches = content.match(getWithPlaceholders);
    expect(getMatches).not.toBeNull();
    expect(getMatches!.length).toBeGreaterThanOrEqual(2);
  });
});
