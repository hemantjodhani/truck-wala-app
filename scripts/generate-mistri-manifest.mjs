import { readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'songs', 'mistri');
const MANIFEST_PATH = join(ROOT, 'src', 'data', 'mistriSongs.js');

console.log('📋 Building Raju Mistri Songs Manifest...');

const ARTISTS_MAP = {
  "01": { title: "Chura Ke Dil Mera", artist: "Alka Yagnik, Kumar Sanu" },
  "02": { title: "Tu Pyar Hai Kisi Aur Ka", artist: "Anuradha Paudwal, Babla Mehta" },
  "03": { title: "Sochenge Tumhe Pyar", artist: "Kumar Sanu" },
  "04": { title: "Ae Mere Humsafar", artist: "Alka Yagnik, Udit Narayan" },
  "05": { title: "Woh Ladki Bahut Yaad Aati", artist: "Kumar Sanu, Alka Yagnik" },
  "06": { title: "Kitna Haseen Chehra", artist: "Kumar Sanu" },
  "07": { title: "Hum Yaar Hai Tumhare", artist: "Udit Narayan, Alka Yagnik" },
  "08": { title: "Abhi to Mohabbat Ka", artist: "Udit Narayan, Alka Yagnik" },
  "09": { title: "Teri Umeed Tera Intezar", artist: "Kumar Sanu, Sadhana Sargam" },
  "10": { title: "Mujhse Mohabbat Ka", artist: "Kumar Sanu, Sadhana Sargam" },
  "11": { title: "Tumsa Koi Pyaara", artist: "Kumar Sanu, Alka Yagnik" },
  "12": { title: "Raah Mein Unse Mulaqat", artist: "Kumar Sanu, Alka Yagnik" },
  "13": { title: "Dil Cheer Ke Dekh", artist: "Kumar Sanu" },
  "14": { title: "Is Pyar Se Meri Taraf Na Dekho", artist: "Alka Yagnik, Kumar Sanu" },
  "15": { title: "Chaaha Toh Bahut", artist: "Kumar Sanu, Alka Yagnik" },
  "16": { title: "Pucho Zara Pucho", artist: "Alka Yagnik, Kumar Sanu" },
  "17": { title: "Tumse Milne Ki Tamanna Hai", artist: "S. P. Balasubrahmanyam" },
  "18": { title: "Too Shayar Hai Main Teri Shayari", artist: "Alka Yagnik" },
  "19": { title: "Lagi Aaj Sawan Ki", artist: "Suresh Wadkar" },
  "20": { title: "Chhupana Bhi Nahin Aata", artist: "Vinod Rathod" },
  "21": { title: "Kitaben Bahut Si", artist: "Asha Bhosle, Vinod Rathod" },
  "22": { title: "Baazigar O Baazigar", artist: "Kumar Sanu, Alka Yagnik" },
  "23": { title: "Koi Na Koi Chahiye", artist: "Kumar Sanu" },
  "24": { title: "Jeeta Tha Jiske Liye", artist: "Kumar Sanu, Alka Yagnik" },
  "25": { title: "Tumhein Apna Banane Ki Kasam Khai Hai", artist: "Kumar Sanu, Anuradha Paudwal" },
  "26": { title: "Jaadu Teri Nazar", artist: "Udit Narayan" },
  "27": { title: "Ye Kaali Kaali Aankhen", artist: "Kumar Sanu, Alka Yagnik" },
  "28": { title: "Neend Churayee Meri", artist: "Kumar Sanu, Alka Yagnik, Udit Narayan" },
  "29": { title: "Tum Dil Ki Dhadkan Mein", artist: "Kumar Sanu, Abhijeet" },
  "30": { title: "Chaaha Hai Tujhko", artist: "Udit Narayan, Alka Yagnik" }
};

try {
  const files = readdirSync(OUT_DIR)
    .filter(f => f.endsWith('.mp3'))
    .sort();

  const songs = files.map((filename) => {
    const idx = filename.split(' - ')[0];
    const meta = ARTISTS_MAP[idx] || { title: filename.replace(/^\d+\s*-\s*/, '').replace(/\.mp3$/, ''), artist: "90s Hits" };
    
    return {
      title: meta.title,
      artist: meta.artist,
      src: `/songs/mistri/${filename}`,
      thumb: `/songs/mistri/${filename.replace(/\.mp3$/, '.jpg')}`
    };
  });

  const manifestContent = `// Auto-generated manifest for Raju Mistri Mode — ${songs.length} songs
// Audio:     public/songs/mistri/*.mp3
// Thumbnails: public/songs/mistri/*.jpg
export const MISTRI_SONGS = ${JSON.stringify(songs, null, 2)};
`;

  writeFileSync(MANIFEST_PATH, manifestContent, 'utf8');
  console.log(`✅ Generated manifest with ${songs.length} songs in ${MANIFEST_PATH}`);
} catch (e) {
  console.error('Error generating manifest:', e);
}
