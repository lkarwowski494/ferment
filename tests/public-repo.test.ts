import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

describe('Public Repository & CI/CD Security (NFR-SEC-001..015, BR-REL-019..022)', () => {
  const wfDir = join(root, '.github', 'workflows');
  const wfFiles = existsSync(wfDir)
    ? readdirSync(wfDir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
    : [];

  test('all .github/workflows/*.yml respect least-privilege permissions and isolation', () => {
    expect(wfFiles.length).toBeGreaterThan(0);
    for (const file of wfFiles) {
      const content = readFileSync(join(wfDir, file), 'utf8');
      // 1. No pull_request_target
      expect(content).not.toMatch(/pull_request_target/);
      // 2. Explicit top-level permissions
      expect(content).toMatch(/^permissions:\s*\n\s+contents:\s*(read|write)/m);
      // 3. Explicit timeout-minutes
      expect(content).toMatch(/timeout-minutes:\s*\d+/);
      // 4. No direct user input interpolation in run:
      const runBlocks = content.split(/\n\s*-\s+name:/);
      for (const block of runBlocks) {
        if (block.includes('run:')) {
          const runPart = block.slice(block.indexOf('run:'));
          expect(runPart).not.toMatch(/\$\{\{\s*github\.event\.(inputs|pull_request|head_commit|issue|comment)/);
          expect(runPart).not.toMatch(/\$\{\{\s*github\.head_ref/);
        }
      }
      // 5. Official actions actions/* or pinned SHA
      const usesMatches = [...content.matchAll(/uses:\s*([^\s#]+)/g)];
      for (const m of usesMatches) {
        const action = m[1];
        const isOfficial = action.startsWith('actions/');
        const isPinnedSha = /@[0-9a-f]{40}$/.test(action);
        expect(isOfficial || isPinnedSha).toBe(true);
      }
    }
  });

  test('testflight.yml filters logs and never uploads raw .ipa or .xcarchive to artifacts', () => {
    const tfPath = join(wfDir, 'testflight.yml');
    if (!existsSync(tfPath)) return;
    const tf = readFileSync(tfPath, 'utf8');
    expect(tf).toContain('EXPO_PUBLIC_STORE_FAKE');
    expect(tf).not.toMatch(/path:.*\.(ipa|xcarchive)/);
  });

  test('no tracked git file contains private keys, certificates, or .env files', () => {
    let tracked: string[] = [];
    try {
      tracked = execSync('git ls-files', { cwd: root, encoding: 'utf8' })
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    } catch {
      // In case git is not initialized in certain sub-environments
      return;
    }

    const forbiddenExt = /\.(p8|p12|mobileprovision|cer|keystore|jks|ipa)$/i;
    for (const f of tracked) {
      expect(f).not.toMatch(forbiddenExt);
      expect(f).not.toMatch(/(^|\/)\.env(\..+)?$/);
      if (
        /\.(ts|tsx|js|mjs|json|md|yml|yaml|html)$/.test(f) &&
        f !== 'tests/public-repo.test.ts'
      ) {
        const body = readFileSync(join(root, f), 'utf8');
        expect(body).not.toMatch(/-----BEGIN [A-Z ]*PRIVATE KEY-----/);
      }
    }
  });

  test('app.json has ITSAppUsesNonExemptEncryption: false and complete privacyManifests', () => {
    const appJson = JSON.parse(readFileSync(join(root, 'app.json'), 'utf8')).expo;
    expect(appJson.ios?.infoPlist?.ITSAppUsesNonExemptEncryption).toBe(false);
    const apiTypes = (appJson.ios?.privacyManifests?.NSPrivacyAccessedAPITypes || []).map(
      (x: { NSPrivacyAccessedAPIType: string }) => x.NSPrivacyAccessedAPIType
    );
    expect(apiTypes).toEqual(
      expect.arrayContaining([
        'NSPrivacyAccessedAPICategoryUserDefaults',
        'NSPrivacyAccessedAPICategoryFileTimestamp',
        'NSPrivacyAccessedAPICategorySystemBootTime',
        'NSPrivacyAccessedAPICategoryDiskSpace',
      ])
    );
  });

  test('site pages (index.html, privacy.html, support.html) exist with valid DOCTYPE and no placeholders', () => {
    for (const page of ['index.html', 'privacy.html', 'support.html']) {
      const p = join(root, 'site', page);
      expect(existsSync(p)).toBe(true);
      const html = readFileSync(p, 'utf8');
      expect(html).toMatch(/<!DOCTYPE html>/i);
      expect(html).not.toMatch(/\b(TODO|FIXME|PLACEHOLDER|example\.com)\b/i);
    }
  });
});
