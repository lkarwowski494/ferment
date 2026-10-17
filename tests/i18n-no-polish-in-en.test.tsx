import { EN } from '../src/lib/i18n.en';
import { t, setLang, lang } from '../src/lib/i18n';

describe('i18n hygiene & no Polish characters in English dictionary (NFR-I18N-001..008)', () => {
  const polishDiacriticsRegex = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;

  it('No Polish diacritics in English translation values (except legitimate source recipe names/terms)', () => {
    const allowedBorrowings = new Set([
      'Gouda Zagrodowa',
      'Koryciński',
      'Oscypek',
      'Bryndza',
      'Kombucha',
      'Nukazuke',
      'Żurek',
    ]);

    const violations: { key: string; value: string }[] = [];

    for (const [key, value] of Object.entries(EN)) {
      if (allowedBorrowings.has(value) || allowedBorrowings.has(key)) {
        continue;
      }
      if (polishDiacriticsRegex.test(value)) {
        violations.push({ key, value });
      }
    }

    if (violations.length > 0) {
      const details = violations.map((v) => `"${v.key}" -> "${v.value}"`).join('\n');
      throw new Error(`[NFR-I18N-002 Violation] Polish diacritics found in EN translations:\n${details}`);
    }

    expect(violations.length).toBe(0);
  });

  it('setLang switches language correctly and t() interpolates parameters', () => {
    setLang('en');
    expect(lang()).toBe('en');
    expect(t('Anuluj')).toBe('Cancel');
    expect(t('Zapisz')).toBe('Save');

    setLang('pl');
    expect(lang()).toBe('pl');
    expect(t('Anuluj')).toBe('Anuluj');
  });

  it('t() parameter interpolation works seamlessly in both languages', () => {
    setLang('pl');
    const plRes = t('Partia {code}', { code: 'FERM-001' });
    expect(plRes).toBe('Partia FERM-001');

    setLang('en');
    const enRes = t('Partia {code}', { code: 'FERM-001' });
    expect(enRes).toContain('FERM-001');
    setLang('pl');
  });
});
