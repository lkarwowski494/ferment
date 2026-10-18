// ============================================================================
// Apps4Brew Studio — App Store Review Guidelines Compliance (GAP-LAW-01, W9)
// Guidelines 3.1.1 (IAP/Restore), 4.0 (Design), 5.1.1 (Zero Telemetry & Offline)
// ============================================================================

import fs from 'fs';
import path from 'path';

describe('App Store Review Guidelines & Offline Privacy Compliance (GAP-LAW-01, W9)', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const pkgJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
  const appJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'app.json'), 'utf-8'));

  it('Apple Guideline 5.1.1: 100% Zero Telemetry — No third-party ad or tracking trackers in dependencies', () => {
    const allDeps = {
      ...(pkgJson.dependencies || {}),
      ...(pkgJson.devDependencies || {}),
    };

    const forbiddenTrackingSdks = [
      'react-native-firebase',
      '@react-native-firebase/analytics',
      '@segment/analytics-react-native',
      'react-native-appsflyer',
      'react-native-adjust',
      'react-native-fbsdk-next',
      'mixpanel-react-native',
      'amplitude-js',
      '@sentry/react-native',
      '@datadog/mobile-react-native',
    ];

    for (const sdk of forbiddenTrackingSdks) {
      expect(allDeps[sdk]).toBeUndefined();
    }
  });

  it('Apple Guideline 3.1.1: Restore Purchases capability is implemented in app-access module', () => {
    const appAccessFile = path.join(rootDir, 'src', 'lib', 'app-access.ts');
    expect(fs.existsSync(appAccessFile)).toBe(true);

    const content = fs.readFileSync(appAccessFile, 'utf-8');
    expect(content).toContain('restorePurchases');
  });

  it('Apple Guideline 5.1.1: Official Privacy Manifests declares Zero Tracking & Data Not Collected', () => {
    const expo = appJson.expo;
    expect(expo).toBeDefined();
    expect(expo.name).toBe('SEROWAR');
    expect(expo.slug).toBe('serowar');
    expect(expo.version).toMatch(/^\d+\.\d+\.\d+/);
    expect(expo.ios).toBeDefined();
    expect(['com.apps4brew.ferment', 'com.apps4brew.serowar']).toContain(expo.ios.bundleIdentifier);

    // Apple Privacy Manifests (NSPrivacyTracking & NSPrivacyCollectedDataTypes)
    const manifests = expo.ios.privacyManifests;
    expect(manifests).toBeDefined();
    expect(manifests.NSPrivacyTracking).toBe(false);
    expect(manifests.NSPrivacyCollectedDataTypes).toEqual([]);
    expect(manifests.NSPrivacyAccessedAPITypes).toBeInstanceOf(Array);
    expect(manifests.NSPrivacyAccessedAPITypes.length).toBeGreaterThanOrEqual(2);
  });
});
