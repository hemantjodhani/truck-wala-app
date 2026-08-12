#!/usr/bin/env node
import { spawnSync, execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'songs', 'mistri');
const MANIFEST_PATH = join(ROOT, 'src', 'data', 'mistriSongs.js');

const SONGS_TO_DOWNLOAD = [
  { title: "Chura Ke Dil Mera", artist: "Alka Yagnik, Kumar Sanu" },
  { title: "Tu Pyar Hai Kisi Aur Ka", artist: "Anuradha Paudwal, Babla Mehta" },
  { title: "Sochenge Tumhe Pyar", artist: "Kumar Sanu" },
  { title: "Ae Mere Humsafar", artist: "Alka Yagnik, Udit Narayan" },
  { title: "Woh Ladki Bahut Yaad Aati", artist: "Kumar Sanu, Alka Yagnik" },
  { title: "Kitna Haseen Chehra", artist: "Kumar Sanu" },
  { title: "Hum Yaar Hai Tumhare", artist: "Udit Narayan, Alka Yagnik" },
  { title: "Abhi to Mohabbat Ka", artist: "Udit Narayan, Alka Yagnik" },
  { title: "Teri Umeed Tera Intezar", artist: "Kumar Sanu, Sadhana Sargam" },
  { title: "Mujhse Mohabbat Ka", artist: "Kumar Sanu, Sadhana Sargam" },
  { title: "Tumsa Koi Pyaara", artist: "Kumar Sanu, Alka Yagnik" },
  { title: "Raah Mein Unse Mulaqat", artist: "Kumar Sanu, Alka Yagnik" },
  { title: "Dil Cheer Ke Dekh", artist: "Kumar Sanu" },
  { title: "Is Pyar Se Meri Taraf Na Dekho", artist: "Alka Yagnik, Kumar Sanu" },
  { title: "Chaaha Toh Bahut", artist: "Kumar Sanu, Alka Yagnik" },
  { title: "Pucho Zara Pucho", artist: "Alka Yagnik, Kumar Sanu" },
  { title: "Tumse Milne Ki Tamanna Hai", artist: "S. P. Balasubrahmanyam" },
  { title: "Too Shayar Hai Main Teri Shayari", artist: "Alka Yagnik" },
  { title: "Lagi Aaj Sawan Ki", artist: "Suresh Wadkar, Anupama Deshpande" },
  { title: "Chhupana Bhi Nahin Aata", artist: "Vinod Rathod" },
  { title: "Kitaben Bahut Si", artist: "Asha Bhosle, Vinod Rathod" },
  { title: "Baazigar O Baazigar", artist: "Kumar Sanu, Alka Yagnik" },
  { title: "Koi Na Koi Chahiye", artist: "Kumar Sanu" },
  { title: "Jeeta Tha Jiske Liye", artist: "Kumar Sanu, Alka Yagnik" },
  { title: "Tumhein Apna Banane Ki Kasam Khai Hai", artist: "Kumar Sanu, Anuradha Paudwal" },
  { title: "Jaadu Teri Nazar", artist: "Udit Narayan" },
  { title: "Ye Kaali Kaali Aankhen", artist: "Kumar Sanu, Alka Yagnik" },
  { title: "Neend Churayee Meri", artist: "Kumar Sanu, Alka Yagnik, Udit Narayan, Kavita Krishnamurthy" },
  { title: "Tum Dil Ki Dhadkan Mein", artist: "Kumar Sanu, Abhijeet" },
  { title: "Chaaha Hai Tujhko", artist: "Udit Narayan, Alka Yagnik" }
];

console.log('🏗️ Raju Mistri Song Downloader');
console.log('=============================');
console.log(`Downloading ${SONGS_TO_DOWNLOAD.length} songs to ${OUT_DIR}\n`);

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

// Refresh PATH to make sure yt-dlp is seen
const userPath = execSync("echo %PATH%", { encoding: 'utf8' }).trim();
process.env.PATH = userPath + ';' + process.env.PATH;

const manifestSongs = [];

for (let i = 0; i < SONGS_TO_DOWNLOAD.length; i++) {
  const song = SONGS_TO_DOWNLOAD[i];
  const idx = String(i + 1).padStart(2, '0');
  const cleanTitle = song.title.replace(/[^a-zA-Z0-9\s]/g, '');
  const searchName = `${song.title} ${song.artist} 90s Bollywood audio`;
  const filename = `${idx} - ${cleanTitle}`;
  const outAudioPath = join(OUT_DIR, `${filename}.mp3`);
  const outThumbPath = join(OUT_DIR, `${filename}.jpg`);

  console.log(`[${idx}/${SONGS_TO_DOWNLOAD.length}] Searching & downloading: "${song.title}"...`);

  // Execute yt-dlp search & download
  const args = [
    `ytsearch1:${searchName}`,
    '--extract-audio',
    '--audio-format', 'mp3',
    '--audio-quality', '5',
    '--write-thumbnail',
    '--convert-thumbnails', 'jpg',
    '--output', join(OUT_DIR, `${filename}.%(ext)s`),
    '--no-warnings',
    '--quiet'
  ];

  const result = spawnSync('yt-dlp', args, {
    shell: true,
    cwd: ROOT
  });

  if (result.status === 0) {
    console.log(`   ✅ Success: saved ${filename}.mp3 & .jpg`);
  } else {
    console.log(`   ⚠️ Failed to download search query: "${searchName}"`);
  }

  manifestSongs.push({
    title: song.title,
    artist: song.artist,
    src: `/songs/mistri/${filename}.mp3`,
    thumb: `/songs/mistri/${filename}.jpg`
  });
}

// Generate the manifest
console.log('\n📋 Writing manifest file...');
const manifestContent = `// Auto-generated manifest for Raju Mistri Mode — 30 songs
// Audio:     public/songs/mistri/*.mp3
// Thumbnails: public/songs/mistri/*.jpg
export const MISTRI_SONGS = ${JSON.stringify(manifestSongs, null, 2)};
`;

writeFileSync(MANIFEST_PATH, manifestContent, 'utf8');
console.log(`✅ Saved manifest to ${MANIFEST_PATH}`);
console.log('🎉 Done! Refresh the app to play Raju Mistri mode!');
