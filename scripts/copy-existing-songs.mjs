import { readdirSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const MISTRI_DIR = join(ROOT, 'public', 'songs', 'mistri');
const SALON_DIR = join(ROOT, 'public', 'songs', 'salon');
const TRUCK_DIR = join(ROOT, 'public', 'songs', 'truck');

if (!existsSync(MISTRI_DIR)) {
  mkdirSync(MISTRI_DIR, { recursive: true });
}

const SONGS = [
  { title: "Chura Ke Dil Mera", query: "Chura Ke Dil Mera" },
  { title: "Tu Pyar Hai Kisi Aur Ka", query: "Tu Pyar" },
  { title: "Sochenge Tumhe Pyar", query: "Sochenge Tumhe" },
  { title: "Ae Mere Humsafar", query: "Ae Mere Humsafar" },
  { title: "Woh Ladki Bahut Yaad Aati", query: "Woh Ladki Bahut" },
  { title: "Kitna Haseen Chehra", query: "Kitna Haseen Chehra" },
  { title: "Hum Yaar Hai Tumhare", query: "Hum Yaar" },
  { title: "Abhi to Mohabbat Ka", query: "Abhi to Mohabbat" },
  { title: "Teri Umeed Tera Intezar", query: "Teri umeed" },
  { title: "Mujhse Mohabbat Ka", query: "Mujhse Mohabbat" },
  { title: "Tumsa Koi Pyaara", query: "Tumsa Koi Pyaara" },
  { title: "Raah Mein Unse Mulaqat", query: "Raah Mein" },
  { title: "Dil Cheer Ke Dekh", query: "Dil Cheer" },
  { title: "Is Pyar Se Meri Taraf Na Dekho", query: "Is Pyar Se" },
  { title: "Chaaha Toh Bahut", query: "Chaaha Toh" },
  { title: "Pucho Zara Pucho", query: "Pucho Zara" },
  { title: "Tumse Milne Ki Tamanna Hai", query: "Tumse Milne" },
  { title: "Too Shayar Hai Main Teri Shayari", query: "Too Shayar" },
  { title: "Lagi Aaj Sawan Ki", query: "Lagi Aaj" },
  { title: "Chhupana Bhi Nahin Aata", query: "Chhupana" },
  { title: "Kitaben Bahut Si", query: "Kitaben" },
  { title: "Baazigar O Baazigar", query: "Baazigar O" },
  { title: "Koi Na Koi Chahiye", query: "Koi Na" },
  { title: "Jeeta Tha Jiske Liye", query: "Jeeta Tha" },
  { title: "Tumhein Apna Banane Ki Kasam Khai Hai", query: "Kasam" },
  { title: "Jaadu Teri Nazar", query: "Jaadu Teri" },
  { title: "Ye Kaali Kaali Aankhen", query: "Kaali" },
  { title: "Neend Churayee Meri", query: "Neend" },
  { title: "Tum Dil Ki Dhadkan Mein", query: "Dhadkan" },
  { title: "Chaaha Hai Tujhko", query: "Chaaha" }
];

const salonFiles = readdirSync(SALON_DIR);
const truckFiles = readdirSync(TRUCK_DIR);

const missing = [];

SONGS.forEach((song, i) => {
  const idx = String(i + 1).padStart(2, '0');
  const cleanTitle = song.title.replace(/[^a-zA-Z0-9\s]/g, '');
  const destName = `${idx} - ${cleanTitle}`;

  // Find matching mp3 file in salon or truck
  let foundFile = null;
  let sourceDir = null;

  // Search salon
  const matchSalon = salonFiles.find(f => f.toLowerCase().includes(song.query.toLowerCase()) && f.endsWith('.mp3'));
  if (matchSalon) {
    foundFile = matchSalon;
    sourceDir = SALON_DIR;
  } else {
    // Search truck
    const matchTruck = truckFiles.find(f => f.toLowerCase().includes(song.query.toLowerCase()) && f.endsWith('.mp3'));
    if (matchTruck) {
      foundFile = matchTruck;
      sourceDir = TRUCK_DIR;
    }
  }

  if (foundFile && sourceDir) {
    const srcMp3 = join(sourceDir, foundFile);
    const srcJpg = srcMp3.replace(/\.mp3$/, '.jpg');
    
    copyFileSync(srcMp3, join(MISTRI_DIR, `${destName}.mp3`));
    if (existsSync(srcJpg)) {
      copyFileSync(srcJpg, join(MISTRI_DIR, `${destName}.jpg`));
    }
    console.log(`✅ Copied: "${song.title}" from ${sourceDir === SALON_DIR ? 'Salon' : 'Truck'}`);
  } else {
    missing.push({ ...song, idx });
  }
});

console.log('\nMissing songs to download:', missing.length);
console.log(JSON.stringify(missing, null, 2));
