const { withFinalizedMod, createRunOncePlugin } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo Config Plugin do finalizacji niezmienników natywnych iOS:
 * 1. Synchronizuje MARKETING_VERSION w project.pbxproj z expo.version z app.json.
 * 2. Usuwa automatycznie generowany pusty plik Ferment.entitlements oraz
 *    referencję CODE_SIGN_ENTITLEMENTS z project.pbxproj, zapobiegając
 *    błędom automatycznego podpisywania w TestFlight / App Store.
 */
const withIosReleaseConfig = (config) => {
  return withFinalizedMod(config, [
    'ios',
    async (finalConfig) => {
      const projectRoot = finalConfig.modRequest.projectRoot;
      const iosDir = finalConfig.modRequest.platformProjectRoot || path.join(projectRoot, 'ios');
      const scheme = finalConfig.modRequest.projectName || finalConfig.name || 'Ferment';

      // 1. Usuń pusty plik entitlements, jeśli aplikacja nie wymaga niestandardowych uprawnień
      const entPath = path.join(iosDir, scheme, `${scheme}.entitlements`);
      if (fs.existsSync(entPath)) {
        const entContent = fs.readFileSync(entPath, 'utf8');
        const hasKeys = /<key>[^<]+<\/key>/.test(entContent);
        if (!hasKeys && (!finalConfig.ios?.entitlements || Object.keys(finalConfig.ios.entitlements).length === 0)) {
          fs.unlinkSync(entPath);
        }
      }

      // 2. Synchronizuj project.pbxproj: MARKETING_VERSION i wyczyść CODE_SIGN_ENTITLEMENTS
      const pbxPath = path.join(iosDir, `${scheme}.xcodeproj`, 'project.pbxproj');
      if (fs.existsSync(pbxPath)) {
        let pbx = fs.readFileSync(pbxPath, 'utf8');
        const version = finalConfig.version || '1.0.0';
        pbx = pbx.replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${version};`);
        if (!fs.existsSync(entPath)) {
          pbx = pbx.replace(/\t*CODE_SIGN_ENTITLEMENTS = [^;]+;\r?\n?/g, '');
        }
        fs.writeFileSync(pbxPath, pbx, 'utf8');
      }

      return finalConfig;
    },
  ]);
};

module.exports = createRunOncePlugin(withIosReleaseConfig, 'withIosReleaseConfig', '1.0.0');
