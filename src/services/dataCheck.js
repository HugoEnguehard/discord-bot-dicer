const fs = require('node:fs');
const path = require('node:path');
// Refuse an incomplete migration before connecting to Discord.
const root = path.join(__dirname, '..', 'data');
for (const name of ['classes.json', 'races.json', 'weapons.json', 'insults.json', 'raf.json']) {
  JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
}
JSON.parse(fs.readFileSync(process.env.TRUTHS_FILE || path.join(root, 'truths.json'), 'utf8'));
for (const name of fs.readdirSync(root).filter(name => /^dice_.*\.json$/.test(name))) {
  JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
}
const probe = path.join(root, '.write-check-' + require('node:crypto').randomUUID());
try { fs.writeFileSync(probe, '', {flag: 'wx', mode: 0o600}); }
finally { if (fs.existsSync(probe)) fs.unlinkSync(probe); }
