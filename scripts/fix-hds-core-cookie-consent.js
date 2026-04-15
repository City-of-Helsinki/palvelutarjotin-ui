const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(
  process.cwd(),
  'node_modules/hds-core/lib/components/cookie-consent'
);
const tsFile = path.join(targetDir, 'cookieConsent.ts');
const jsFile = path.join(targetDir, 'cookieConsent.js');

function ensureCookieConsentJs() {
  if (!fs.existsSync(tsFile)) {
    return;
  }

  // Prefer an existing JS artifact when present.
  if (fs.existsSync(jsFile)) {
    return;
  }

  const tsContent = fs.readFileSync(tsFile, 'utf8');

  if (!tsContent.startsWith('export default ')) {
    console.warn(
      '[fix-hds-core-cookie-consent] Unexpected cookieConsent.ts format, skipping.'
    );
    return;
  }

  const jsContent = tsContent.replace('export default ', 'module.exports = ');
  fs.writeFileSync(jsFile, jsContent, 'utf8');

  console.log(
    '[fix-hds-core-cookie-consent] Created node_modules/hds-core/lib/components/cookie-consent/cookieConsent.js'
  );
}

ensureCookieConsentJs();
