#!/usr/bin/env node
/**
 * Weryfikuje wygenerowany projekt natywny iOS (expo prebuild --no-install)
 * na Linuksie, Windowsie lub macOS bez konieczności uruchamiania Xcode.
 * Zgodność z BR-REL-009..013 / Rozdział 12.4 BRD-QA-REL 1.0.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const appJson = JSON.parse(readFileSync(join(root, 'app.json'), 'utf8')).expo;
const appName = appJson.name;
const iosScheme = process.env.IOS_SCHEME || appName.replace(/[^a-zA-Z0-9]/g, '');
const iosDir = join(root, 'ios');
const hadIos = existsSync(iosDir);

const errors = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

try {
  if (!hadIos) {
    if (process.platform === 'win32') {
      console.log('[verify-native] Środowisko Windows: sprawdzanie statycznych niezmienników natywnych w app.json (prebuild wymaga macOS/Linux w CI)...');
    } else {
      console.log('[verify-native] Generowanie katalogu ios/ przez expo prebuild --no-install...');
      execSync('npx expo prebuild --platform ios --no-install --clean', {
        cwd: root,
        stdio: 'inherit',
      });
    }
  }

  // 0. Statyczna walidacja app.json (zawsze działa)
  const expectedBundleId = appJson.ios?.bundleIdentifier;
  check(Boolean(expectedBundleId), 'Brak bundleIdentifier w app.json -> expo.ios');
  check(appJson.ios?.infoPlist?.ITSAppUsesNonExemptEncryption === false, 'app.json -> expo.ios.infoPlist musi mieć ITSAppUsesNonExemptEncryption: false');
  
  const ver = appJson.version;
  check(/^\d+\.\d+(\.\d+)?$/.test(ver), `Wersja '${ver}' w app.json musi mieć format X.Y lub X.Y.Z`);

  const forbiddenPermissions = [
    'NSMicrophoneUsageDescription',
    'NSLocationWhenInUseUsageDescription',
    'NSLocationAlwaysUsageDescription',
    'NSContactsUsageDescription',
    'NSBluetoothAlwaysUsageDescription',
    'NSUserTrackingUsageDescription',
    'NSAppleMusicUsageDescription',
  ];
  for (const perm of forbiddenPermissions) {
    check(!appJson.ios?.infoPlist?.[perm], `app.json zawiera niedozwolone uprawnienie: ${perm}`);
  }

  const manifests = appJson.ios?.privacyManifests;
  check(manifests?.NSPrivacyTracking === false, 'app.json privacyManifests musi mieć NSPrivacyTracking: false');
  const declaredCategories = manifests?.NSPrivacyAccessedAPITypes?.map(t => t.NSPrivacyAccessedAPIType) || [];
  for (const cat of [
    'NSPrivacyAccessedAPICategoryUserDefaults',
    'NSPrivacyAccessedAPICategoryFileTimestamp',
    'NSPrivacyAccessedAPICategorySystemBootTime',
    'NSPrivacyAccessedAPICategoryDiskSpace',
  ]) {
    check(declaredCategories.includes(cat), `app.json privacyManifests musi deklarować kategorię Required Reason API: ${cat}`);
  }

  if (existsSync(iosDir)) {
    const pbxPath = join(iosDir, `${iosScheme}.xcodeproj`, 'project.pbxproj');
    const plistPath = join(iosDir, iosScheme, 'Info.plist');
    const privPath = join(iosDir, iosScheme, 'PrivacyInfo.xcprivacy');
    const entPath = join(iosDir, iosScheme, `${iosScheme}.entitlements`);

    check(existsSync(pbxPath), `Brak pliku projektu Xcode: ${pbxPath}`);
    check(existsSync(plistPath), `Brak pliku Info.plist: ${plistPath}`);
    check(existsSync(privPath), `Brak pliku PrivacyInfo.xcprivacy: ${privPath}`);

  if (existsSync(pbxPath) && existsSync(plistPath)) {
    const pbx = readFileSync(pbxPath, 'utf8');
    const plist = readFileSync(plistPath, 'utf8');

    // 1. Bundle Identifier
    const expectedBundleId = appJson.ios?.bundleIdentifier;
    check(
      pbx.includes(`PRODUCT_BUNDLE_IDENTIFIER = ${expectedBundleId};`) ||
        pbx.includes(`PRODUCT_BUNDLE_IDENTIFIER = "${expectedBundleId}";`),
      `PRODUCT_BUNDLE_IDENTIFIER w project.pbxproj nie zgadza się z ${expectedBundleId}`
    );

    // 2. ITSAppUsesNonExemptEncryption = false
    check(
      /<key>ITSAppUsesNonExemptEncryption<\/key>\s*<false\/>/.test(plist),
      'Info.plist musi mieć ITSAppUsesNonExemptEncryption = false'
    );

    // 3. Format wersji X.Y lub X.Y.Z
    const ver = appJson.version;
    check(/^\d+\.\d+(\.\d+)?$/.test(ver), `Wersja '${ver}' w app.json musi mieć format X.Y lub X.Y.Z`);
    check(
      pbx.includes(`MARKETING_VERSION = ${ver};`),
      `MARKETING_VERSION w project.pbxproj nie zgadza się z ${ver}`
    );

    // 4. Zakaz niechcianych uprawnień śledzących
    const forbiddenPermissions = [
      'NSMicrophoneUsageDescription',
      'NSLocationWhenInUseUsageDescription',
      'NSLocationAlwaysUsageDescription',
      'NSContactsUsageDescription',
      'NSBluetoothAlwaysUsageDescription',
      'NSUserTrackingUsageDescription',
      'NSAppleMusicUsageDescription',
    ];
    for (const perm of forbiddenPermissions) {
      check(!plist.includes(`<key>${perm}</key>`), `Info.plist zawiera niedozwolone uprawnienie: ${perm}`);
    }

    // 5. Orientacja pionowa i pełny ekran (gdy supportsTablet: false)
    if (appJson.ios?.supportsTablet === false) {
      check(
        /<key>UIRequiresFullScreen<\/key>\s*<true\/>/.test(plist),
        'Info.plist musi mieć UIRequiresFullScreen = true przy supportsTablet: false'
      );
      check(
        pbx.includes('TARGETED_DEVICE_FAMILY = "1";') || pbx.includes('TARGETED_DEVICE_FAMILY = 1;'),
        'project.pbxproj musi mieć TARGETED_DEVICE_FAMILY = "1" (tylko iPhone)'
      );
    }
  }

    if (existsSync(privPath)) {
      const priv = readFileSync(privPath, 'utf8');
      check(
        /<key>NSPrivacyTracking<\/key>\s*<false\/>/.test(priv),
        'PrivacyInfo.xcprivacy musi mieć NSPrivacyTracking = false'
      );
      for (const cat of [
        'NSPrivacyAccessedAPICategoryUserDefaults',
        'NSPrivacyAccessedAPICategoryFileTimestamp',
        'NSPrivacyAccessedAPICategorySystemBootTime',
        'NSPrivacyAccessedAPICategoryDiskSpace',
      ]) {
        check(priv.includes(cat), `PrivacyInfo.xcprivacy musi deklarować kategorię Required Reason API: ${cat}`);
      }
    }
  } else if (process.platform !== 'win32') {
    check(false, 'Katalog ios/ nie został wygenerowany przez expo prebuild');
  }
} finally {
  if (!hadIos && existsSync(iosDir)) {
    rmSync(iosDir, { recursive: true, force: true });
  }
}

if (errors.length > 0) {
  console.error('\n[verify-native] BŁĘDY KONFIGURACJI NATYWNEJ iOS:');
  for (const e of errors) console.error(`  ✖ ${e}`);
  process.exit(1);
}
console.log('[verify-native] Wszystkie niezmienniki natywnego projektu iOS spełnione.');
