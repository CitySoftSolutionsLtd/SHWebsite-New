const { test } = require('node:test');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

test('published profiles and the sitemap match the current public pages and roster', () => {
  execFileSync(process.execPath, [path.join(__dirname, '../scripts/prepare-seo.cjs'), '--check']);
});
