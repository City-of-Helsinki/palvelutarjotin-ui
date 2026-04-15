/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const targetDir = path.join(
  process.cwd(),
  'node_modules',
  'hds-core',
  'lib',
  'components',
  'cookie-consent'
);

const targetFile = path.join(targetDir, 'cookieConsent.js');
const cssFile = path.join(targetDir, 'cookieConsent.css');

if (!fs.existsSync(targetDir)) {
  console.error(
    '[fix-hds-core-cookie-consent] Failed: hds-core cookie-consent directory not found.'
  );
  process.exit(1);
}
if (!fs.existsSync(cssFile)) {
  console.error(
    '[fix-hds-core-cookie-consent] Failed: cookieConsent.css not found; cannot create shim.'
  );
  process.exit(1);
}

const cssContent = fs.readFileSync(cssFile, 'utf8');
const shimContent = `'use strict';\n\nconst css = ${JSON.stringify(cssContent)};\n\nmodule.exports = { __esModule: true, default: css };\n`;

if (!fs.existsSync(targetFile)) {
  fs.writeFileSync(targetFile, shimContent, 'utf8');
  console.log(
    '[fix-hds-core-cookie-consent] Created cookieConsent.js shim for hds-react compatibility.'
  );
} else {
  console.log(
    '[fix-hds-core-cookie-consent] cookieConsent.js already exists; skipping shim generation.'
  );
}
