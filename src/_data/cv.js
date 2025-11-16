import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function() {
  const files = readdirSync(join(__dirname, '../assets/files'));
  const cvs = files
    .map(file => file.match(/^Mikael Kohlmyr CV (\d+)\.(\d+)\.(\d+)\.pdf$/))
    .filter(Boolean)
    .map(match => {
      return {
        filename: match[0],
        version: {
          major: parseInt(match[1]),
          minor: parseInt(match[2]),
          patch: parseInt(match[3])
        }
      }
    });
  
  const ordered = cvs.sort((a, b) => {
    return b.version.major - a.version.major || b.version.minor - a.version.minor || b.version.patch - a.version.patch;
  });
  const current = ordered[0];
  
  return {
    filename: current.filename,
    url: `/assets/files/${encodeURIComponent(current.filename)}`,
    version: current.version
  }
}