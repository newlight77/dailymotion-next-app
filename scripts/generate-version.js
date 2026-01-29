const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (err) {
    return null;
  }
}

function formatPrefix(dateRaw) {
  if (!dateRaw) return '';
  const d = new Date(dateRaw);
  if (isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

function main() {
  const commitDateRaw = run('git show -s --format=%ci HEAD');
  const describe = run('git describe --always');

  const prefix = formatPrefix(commitDateRaw);
  const suffix = describe || '';
  const version = (prefix && suffix) ? `${prefix}-${suffix}` : (suffix || prefix || 'unknown');

  const content = {
    version,
    prefix,
    suffix,
    commitDate: commitDateRaw || null,
  };

  const filePath = '.version';
  const publicFilePath = './public/.version';
  try {
    fs.writeFileSync(filePath, JSON.stringify(content));
    // ensure public directory exists and write a copy for static fetching
    fs.mkdirSync('./public', { recursive: true });
    fs.writeFileSync(publicFilePath, JSON.stringify(content));

    // also write a TypeScript module so the frontend can import version at build time
    const generatedDir = './src/generated';
    fs.mkdirSync(generatedDir, { recursive: true });
    const tsFilePath = `${generatedDir}/version.ts`;
    const tsContent = `export const version = ${JSON.stringify(content.version)};
export const prefix = ${JSON.stringify(content.prefix)};
export const suffix = ${JSON.stringify(content.suffix)};
export const commitDate = ${JSON.stringify(content.commitDate)};

const versionModule = { version, prefix, suffix, commitDate };
export default versionModule;
`;
    fs.writeFileSync(tsFilePath, tsContent);

    console.log(`.version written: ${JSON.stringify(content)}`);
    console.log(`public/.version written: ${JSON.stringify(content)}`);
    console.log(`src/generated/version.ts written: ${tsFilePath}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to write .version file', err);
    process.exit(1);
  }
}

main();
