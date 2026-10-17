#!/usr/bin/env node
/**
 * scripts/patch-expo-modules-jsi.mjs
 * Patches expo-modules-jsi/apple/Package.swift to use swift-tools-version: 6.0
 * aligning with Xcode 16.0..16.2 on macOS CI runners and podspec s.swift_version = '6.0'.
 * Removes Swift 6.2-specific upcoming features and trailing commas before ')' which are invalid in Swift 6.0.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const pkgPath = join(process.cwd(), 'node_modules', 'expo-modules-jsi', 'apple', 'Package.swift');

if (existsSync(pkgPath)) {
  let content = readFileSync(pkgPath, 'utf8');
  let changed = false;

  if (content.includes('// swift-tools-version: 6.2') || content.includes('// swift-tools-version: 6.1')) {
    content = content.replace(/\/\/ swift-tools-version: 6\.[12]/g, '// swift-tools-version: 6.0');
    changed = true;
  }

  if (content.includes('NonisolatedNonsendingByDefault')) {
    content = content.replace(/\s*\/\/ Enable some upcoming features[^\n]*\r?\n/g, '\n');
    content = content.replace(/\s*\/\/ https:\/\/github\.com\/swiftlang\/swift-evolution\/blob\/main\/proposals\/0461-async-function-isolation\.md\r?\n/g, '\n');
    content = content.replace(/\s*\.enableUpcomingFeature\("NonisolatedNonsendingByDefault"\),?\r?\n/g, '\n');
    changed = true;
  }

  if (content.includes('InferIsolatedConformances')) {
    content = content.replace(/\s*\/\/ https:\/\/github\.com\/swiftlang\/swift-evolution\/blob\/main\/proposals\/0470-isolated-conformances\.md\r?\n/g, '\n');
    content = content.replace(/\s*\.enableUpcomingFeature\("InferIsolatedConformances"\),?\r?\n/g, '\n');
    changed = true;
  }

  // Remove trailing commas before closing parentheses (invalid syntax in Swift < 6.2)
  if (/,([ \t\r\n]*\))/.test(content)) {
    content = content.replace(/,([ \t\r\n]*\))/g, '$1');
    changed = true;
  }

  if (changed) {
    writeFileSync(pkgPath, content, 'utf8');
    console.log('[patch-expo-modules-jsi] Pomyślnie spatchowano Package.swift (swift-tools-version: 6.0 + usunięcie trailing commas) dla Xcode 16.');
  }
}
