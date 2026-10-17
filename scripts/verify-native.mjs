#!/usr/bin/env node
/**
 * scripts/verify-native.mjs
 * Apps4Brew / Ferment Studio Native iOS Invariants Verification
 * Standards: BR-REL-009..013, RD-ENG-08, RD-ENG-11, Chapter 12.4
 *
 * Verifies 20 native iOS invariants without requiring Xcode.
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
      console.log('[verify-native] Wykryto środowisko Windows (Expo CLI pomija generowanie ios/ na Windows).');
      console.log('[verify-native] Weryfikacja statyczna app.json, PrivacyManifests i assets/icon.png (pełny prebuild działa w CI na Linux/macOS)...');
      
      // Statyczna weryfikacja pod Windows
      check(appJson.ios?.bundleIdentifier, 'Brak app.json ios.bundleIdentifier');
      check(/^\d+\.\d+(\.\d+)?$/.test(appJson.version), `Wersja '${appJson.version}' w app.json musi mieć format X.Y lub X.Y.Z`);
      check(appJson.ios?.infoPlist?.ITSAppUsesNonExemptEncryption === false, 'app.json ios.infoPlist.ITSAppUsesNonExemptEncryption musi być false');
      check(!appJson.ios?.infoPlist?.UIBackgroundModes, 'app.json nie może zawierać UIBackgroundModes (naruszenie Apple Guideline 2.5.4 i BR-REL-013)');
      check(appJson.ios?.supportsTablet === false, 'app.json ios.supportsTablet musi być false (iPhone-only standard)');
      
      const priv = appJson.ios?.privacyManifests;
      check(priv, 'Brak app.json ios.privacyManifests');
      if (priv) {
        check(priv.NSPrivacyTracking === false, 'app.json NSPrivacyTracking musi być false');
        const types = (priv.NSPrivacyAccessedAPITypes || []).map(t => t.NSPrivacyAccessedAPIType);
        for (const cat of [
          'NSPrivacyAccessedAPICategoryUserDefaults',
          'NSPrivacyAccessedAPICategoryFileTimestamp',
          'NSPrivacyAccessedAPICategorySystemBootTime',
          'NSPrivacyAccessedAPICategoryDiskSpace',
        ]) {
          check(types.includes(cat), `app.json ios.privacyManifests musi zawierać: ${cat}`);
        }
      }

      const iconPath = join(root, 'assets', 'icon.png');
      if (existsSync(iconPath)) {
        const buf = readFileSync(iconPath);
        const w = buf.readUInt32BE(16);
        const h = buf.readUInt32BE(20);
        const colorType = buf[25];
        check(w === 1024 && h === 1024, `Ikona ${iconPath} ma wymiary ${w}x${h} (wymagane 1024x1024)`);
        check(colorType === 2, `Ikona ${iconPath} ma ColorType ${colorType} (wymagany ColorType 2: 24-bit RGB Truecolor bez kanału alfa dla ITMS-90717)`);
      } else {
        check(false, `Brak pliku ikony: ${iconPath}`);
      }

      check(existsSync(join(root, 'assets', 'adaptive-icon.png')), 'Brak assets/adaptive-icon.png');
      check(existsSync(join(root, 'assets', 'splash-icon.png')), 'Brak assets/splash-icon.png');
      check(existsSync(join(root, 'assets', 'favicon.png')), 'Brak assets/favicon.png');
    } else {
      console.log('[verify-native] Generowanie katalogu ios/ przez expo prebuild --no-install...');
      execSync('npx expo prebuild --platform ios --no-install --clean', {
        cwd: root,
        stdio: 'inherit',
      });
    }
  }

  // Ogólne niezmienniki statyczne
  const expectedBundleId = appJson.ios?.bundleIdentifier;
  check(Boolean(expectedBundleId), 'Brak bundleIdentifier w app.json -> expo.ios');
  check(appJson.ios?.infoPlist?.ITSAppUsesNonExemptEncryption === false, 'app.json -> expo.ios.infoPlist musi mieć ITSAppUsesNonExemptEncryption: false');
  check(!appJson.ios?.infoPlist?.UIBackgroundModes, 'app.json nie może zawierać UIBackgroundModes (naruszenie Apple Guideline 2.5.4 i BR-REL-013)');
  check(appJson.ios?.supportsTablet === false, 'app.json ios.supportsTablet musi być false');
  
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

    if (existsSync(entPath) && (!appJson.ios?.entitlements || Object.keys(appJson.ios?.entitlements || {}).length === 0)) {
      const entContent = readFileSync(entPath, 'utf8');
      const hasKeys = /<key>[^<]+<\/key>/.test(entContent);
      check(hasKeys, `Plik ${entPath} jest pusty — usuń go w wtyczce prebuild, aby nie blokować automatycznego podpisywania`);
    }

    if (existsSync(pbxPath) && existsSync(plistPath)) {
      const pbx = readFileSync(pbxPath, 'utf8');
      const plist = readFileSync(plistPath, 'utf8');

      // Bundle Identifier
      check(
        pbx.includes(`PRODUCT_BUNDLE_IDENTIFIER = ${expectedBundleId};`) ||
          pbx.includes(`PRODUCT_BUNDLE_IDENTIFIER = "${expectedBundleId}";`),
        `PRODUCT_BUNDLE_IDENTIFIER w project.pbxproj nie zgadza się z ${expectedBundleId}`
      );

      // ITSAppUsesNonExemptEncryption = false
      check(
        /<key>ITSAppUsesNonExemptEncryption<\/key>\s*<false\/>/.test(plist),
        'Info.plist musi mieć ITSAppUsesNonExemptEncryption = false'
      );

      // Version
      check(
        pbx.includes(`MARKETING_VERSION = ${ver};`),
        `MARKETING_VERSION w project.pbxproj nie zgadza się z ${ver}`
      );

      // Forbidden permissions
      for (const perm of forbiddenPermissions) {
        check(!plist.includes(`<key>${perm}</key>`), `Info.plist zawiera niedozwolone uprawnienie: ${perm}`);
      }
      check(!plist.includes('<key>UIBackgroundModes</key>'), 'Info.plist nie może zawierać UIBackgroundModes');

      // Orientation and fullscreen
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
