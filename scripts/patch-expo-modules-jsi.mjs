#!/usr/bin/env node
/**
 * scripts/patch-expo-modules-jsi.mjs
 * Patches expo-modules-jsi for Xcode 16 (Swift 6.0) compatibility:
 * 1. Package.swift: sets swift-tools-version: 6.0, removes Swift 6.2 upcoming features,
 *    and removes trailing commas before ')' which are invalid in Swift < 6.2.
 * 2. RuntimeScheduler.h: defines fallback for SWIFT_RETURNS_RETAINED when building
 *    under Swift < 6.2 (where <swift/bridging> does not define it yet).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

// 1. Patch Package.swift
const pkgPath = join(root, 'node_modules', 'expo-modules-jsi', 'apple', 'Package.swift');
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
    console.log('[patch-expo-modules-jsi] Pomyślnie spatchowano Package.swift (swift-tools-version: 6.0) dla Xcode 16.');
  }
}

// 2. Patch RuntimeScheduler.h for SWIFT_RETURNS_RETAINED fallback in Swift 6.0
const schedulerPath = join(root, 'node_modules', 'expo-modules-jsi', 'apple', 'Sources', 'ExpoModulesJSI-Cxx', 'include', 'RuntimeScheduler.h');
if (existsSync(schedulerPath)) {
  let content = readFileSync(schedulerPath, 'utf8');
  if (!content.includes('#ifndef SWIFT_RETURNS_RETAINED')) {
    content = content.replace(
      '#include <swift/bridging>',
      '#include <swift/bridging>\n\n#ifndef SWIFT_RETURNS_RETAINED\n#define SWIFT_RETURNS_RETAINED\n#endif'
    );
    writeFileSync(schedulerPath, content, 'utf8');
    console.log('[patch-expo-modules-jsi] Pomyślnie spatchowano RuntimeScheduler.h (SWIFT_RETURNS_RETAINED fallback) dla Xcode 16.');
  }
}
