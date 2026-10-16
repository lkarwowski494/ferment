// ============================================================================
// Apps4Brew Studio — FERMENT QR Deep-Link Parser Tests
// ============================================================================

import {
  buildBatchDeepLink,
  buildWheelDeepLink,
  parseDeepLinkOrQr,
} from '../../src/core/qr-deeplink';

describe('FERMENT QR Deep-Link & Barcode Parser', () => {
  it('builds canonical URI deep links correctly', () => {
    expect(buildBatchDeepLink('batch_12345')).toBe('ferment://batch/batch_12345');
    expect(buildWheelDeepLink('wheel_gouda_01')).toBe('ferment://wheel/wheel_gouda_01');
  });

  it('parses ferment://batch/<id> deep links', () => {
    const res = parseDeepLinkOrQr('ferment://batch/BATCH-2026-999');
    expect(res.type).toBe('batch');
    expect(res.id).toBe('BATCH-2026-999');
  });

  it('parses ferment://batch?id=<id> query parameter deep links', () => {
    const res = parseDeepLinkOrQr('ferment://batch?id=batch_gouda_42&source=label');
    expect(res.type).toBe('batch');
    expect(res.id).toBe('batch_gouda_42');
  });

  it('parses ferment://wheel/<id> deep links', () => {
    const res = parseDeepLinkOrQr('ferment://wheel/W-05');
    expect(res.type).toBe('wheel');
    expect(res.id).toBe('W-05');
  });

  it('parses ferment://wheel?id=<id> query parameter deep links', () => {
    const res = parseDeepLinkOrQr('ferment://wheel?id=wheel_parmesan_09');
    expect(res.type).toBe('wheel');
    expect(res.id).toBe('wheel_parmesan_09');
  });

  it('parses ferment://recipe deep links with data', () => {
    const res = parseDeepLinkOrQr('ferment://recipe?data=eyJh...==');
    expect(res.type).toBe('recipe');
    expect(res.recipeData).toBe('eyJh...==');
  });

  it('parses JSON payloads from printable labels', () => {
    const batchJson = JSON.stringify({ id: 'batch_cheddar_01', batch: 'BATCH-2026-555' });
    const resBatch = parseDeepLinkOrQr(batchJson);
    expect(resBatch.type).toBe('batch');
    expect(resBatch.id).toBe('BATCH-2026-555');

    const wheelJson = JSON.stringify({ wheelId: 'wheel_777', wheelTag: 'W-07' });
    const resWheel = parseDeepLinkOrQr(wheelJson);
    expect(resWheel.type).toBe('wheel');
    expect(resWheel.id).toBe('wheel_777');
  });

  it('parses plain text tags by convention', () => {
    const resWheelTag = parseDeepLinkOrQr('W-12');
    expect(resWheelTag.type).toBe('wheel');
    expect(resWheelTag.id).toBe('W-12');

    const resWheelId = parseDeepLinkOrQr('wheel_alpine_03');
    expect(resWheelId.type).toBe('wheel');
    expect(resWheelId.id).toBe('wheel_alpine_03');

    const resBatchCode = parseDeepLinkOrQr('BATCH-2026-101');
    expect(resBatchCode.type).toBe('batch');
    expect(resBatchCode.id).toBe('BATCH-2026-101');

    const resUnknown = parseDeepLinkOrQr('SOME-CUSTOM-STRING');
    expect(resUnknown.type).toBe('unknown');
    expect(resUnknown.id).toBe('SOME-CUSTOM-STRING');
  });

  it('handles empty or whitespace payloads safely', () => {
    const res = parseDeepLinkOrQr('   ');
    expect(res.type).toBe('unknown');
    expect(res.raw).toBe('');
  });
});
