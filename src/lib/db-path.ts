/**
 * Apps4Brew Database Path Protection (SEC-09):
 * Przeniesienie roboczej bazy SQLite poza katalog Dokumenty (`Documents/SQLite/` -> `/Library/Application Support/SQLite/`).
 * Katalog Dokumenty jest widoczny dla użytkownika w aplikacji Pliki (przez UIFileSharingEnabled),
 * a roboczej bazy SQLite nie wolno narażać na przypadkowe usunięcie, modyfikację lub podmianę.
 * Ścieżka `/Library/Application Support/SQLite/` jest w 100% prywatna dla aplikacji
 * i wchodzi do systemowej kopii zapasowej telefonu (iCloud/iTunes).
 */
export function dbDirectory(def?: string | null): string | undefined {
  if (!def) return undefined;
  if (/\/Documents\/SQLite\/?$/.test(def)) {
    return def.replace(/\/Documents\/SQLite\/?$/, '/Library/Application Support/SQLite');
  }
  return undefined;
}
