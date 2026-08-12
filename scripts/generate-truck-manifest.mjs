import { readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'songs', 'truck');
const MANIFEST_PATH = join(ROOT, 'src', 'data', 'truckSongs.js');

console.log('📋 Building Truck Songs Manifest...');

try {
  const files = readdirSync(OUT_DIR)
    .filter(f => f.endsWith('.mp3'))
    .sort();

  if (!files.length) {
    console.error('❌ No MP3 files found in', OUT_DIR);
    process.exit(1);
  }

  const songs = files.map((filename) => {
    // Clean up filename for clean title display
    let title = filename
      .replace(/^\d+\s*-\s*/, '')   // Remove index prefix e.g. "01 - "
      .replace(/\.mp3$/, '')         // Remove extension
      .replace(/\s*\|.*$/, '')       // Remove youtube divider pipes
      .replace(/\s*\(.*?\)/g, '')    // Remove parentheses text like (HD), (Full Song)
      .replace(/\s*\[.*?\]/g, '')    // Remove bracket text like [Lyrical]
      .replace(/\s*Lyrical.*/i, '')  // Remove "Lyrical" and trailing words
      .trim();

    return {
      title,
      artist: "Truck Driver Playlist",
      src: `/songs/truck/${filename}`,
      thumb: `/songs/truck/${filename.replace(/\.mp3$/, '.jpg')}`
    };
  });

  const manifestContent = `// Auto-generated manifest — ${songs.length} songs from the Truck Driver playlist
// Audio:     public/songs/truck/*.mp3
// Thumbnails: public/songs/truck/*.jpg
export const TRUCK_SONGS = ${JSON.stringify(songs, null, 2)};
`;

  writeFileSync(MANIFEST_PATH, manifestContent, 'utf8');
  console.log(`✅ Generated manifest with ${songs.length} songs in ${MANIFEST_PATH}`);
} catch (e) {
  console.error('Error generating manifest:', e);
}
