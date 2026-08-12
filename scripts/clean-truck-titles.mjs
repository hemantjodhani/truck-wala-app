import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const MANIFEST_PATH = join(ROOT, 'src', 'data', 'truckSongs.js');

console.log('🧼 Cleaning Truck Song Titles...');

try {
  const content = readFileSync(MANIFEST_PATH, 'utf8');
  // Temporary import style parsing
  const jsonStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
  const songs = JSON.parse(jsonStr);

  const cleanSongs = songs.map(song => {
    let rawTitle = song.title;

    // Clean up typical YouTube tags
    let title = rawTitle
      .replace(/\s*\|.*$/, '')                  // Remove anything after | or ｜
      .replace(/\s*｜.*$/, '')
      .replace(/\s*\(.*?Lyrical.*?\)/gi, '')    // Remove (Lyrical Video) etc.
      .replace(/\s*\[.*?Lyrical.*?\]/gi, '')
      .replace(/\s*\(.*?Official.*?\)/gi, '')
      .replace(/\s*\[.*?Official.*?\]/gi, '')
      .replace(/\s*\(.*?Video.*?\)/gi, '')
      .replace(/\s*\[.*?Video.*?\]/gi, '')
      .replace(/\s*\(.*?HD.*?\)/gi, '')
      .replace(/\s*\[.*?HD.*?\]/gi, '')
      .replace(/\s*\(.*?Full Song.*?\)/gi, '')
      .replace(/\s*\[.*?Full Song.*?\]/gi, '')
      .replace(/\s*4K Video/gi, '')
      .replace(/\s*Lyrical Video/gi, '')
      .replace(/\s*Full Video Song/gi, '')
      .replace(/\s*Song/gi, '')
      .trim();

    let artist = "90s Hits";
    
    // If title has a dash "-", try to split into Title and Movie/Artist
    if (title.includes(' - ')) {
      const parts = title.split(' - ');
      title = parts[0].trim();
      artist = parts[1].trim();
    } else if (title.includes(' – ')) {
      const parts = title.split(' – ');
      title = parts[0].trim();
      artist = parts[1].trim();
    }

    // Hand clean some specific famous ones
    if (title.toLowerCase().includes("mujhse mohabbat ka")) {
      title = "Mujhse Mohabbat Ka Izhaar";
      artist = "Hum Hain Rahi Pyar Ke";
    } else if (title.toLowerCase().includes("tumsa koi pyaara")) {
      title = "Tumsa Koi Pyaara";
      artist = "Govinda, Karisma Kapoor";
    } else if (title.toLowerCase().includes("waada raha sanam")) {
      title = "Waada Raha Sanam";
      artist = "Khiladi";
    } else if (title.toLowerCase().includes("chhupana bhi nahin")) {
      title = "Chhupana Bhi Nahin Aata";
      artist = "Baazigar";
    } else if (title.toLowerCase().includes("saaton janam main tere")) {
      title = "Saaton Janam Main Tere";
      artist = "Dilwale";
    } else if (title.toLowerCase().includes("oye raju pyar na")) {
      title = "Oye Raju Pyar Na Kariyo";
      artist = "Hadh Kar Di Aapne";
    } else if (title.toLowerCase().includes("bas ek sanam chahiye")) {
      title = "Bas Ek Sanam Chahiye";
      artist = "Aashiqui";
    } else if (title.toLowerCase().includes("tu pyar hai kisi aur ka")) {
      title = "Tu Pyar Hai Kisi Aur Ka";
      artist = "Dil Hai Ke Manta Nahin";
    } else if (title.toLowerCase().includes("sochenge tumhe pyar")) {
      title = "Sochenge Tumhe Pyar";
      artist = "Deewana";
    } else if (title.toLowerCase().includes("raah mein unse mulaqat")) {
      title = "Raah Mein Unse Mulaqat";
      artist = "Vijaypath";
    } else if (title.toLowerCase().includes("main duniya bhula doonga")) {
      title = "Main Duniya Bhula Doonga";
      artist = "Aashiqui";
    } else if (title.toLowerCase().includes("tumhein apna banane ki kasam")) {
      title = "Tumhein Apna Banane Ki Kasam";
      artist = "Sadak";
    } else if (title.toLowerCase().includes("kitna haseen chehra")) {
      title = "Kitna Haseen Chehra";
      artist = "Dilwale";
    } else if (title.toLowerCase().includes("dheere dheere pyar ko")) {
      title = "Dheere Dheere Pyar Ko Badhana";
      artist = "Phool Aur Kaante";
    } else if (title.toLowerCase().includes("jeeye to jeeye kaise")) {
      title = "Jeeye To Jeeye Kaise";
      artist = "Saajan";
    } else if (title.toLowerCase().includes("hum lakh chupaye pyar magar")) {
      title = "Hum Lakh Chupaye Pyar Magar";
      artist = "Jaan Tere Naam";
    } else if (title.toLowerCase().includes("kitna pyaara tujhe rabne banaya")) {
      title = "Kitna Pyaara Tujhe Rabne Banaya";
      artist = "Raja Hindustani";
    } else if (title.toLowerCase().includes("ek ladki ko dekha")) {
      title = "Ek Ladki Ko Dekha";
      artist = "1942 A Love Story";
    } else if (title.toLowerCase().includes("chura ke dil mera")) {
      title = "Chura Ke Dil Mera";
      artist = "Main Khiladi Tu Anari";
    } else if (title.toLowerCase().includes("tu meri zindagi hai")) {
      title = "Tu Meri Zindagi Hai";
      artist = "Aashiqui";
    } else if (title.toLowerCase().includes("achha sila diya toone")) {
      title = "Achha Sila Diya Toone Mere Pyar Ka";
      artist = "Sonu Nigam";
    } else if (title.toLowerCase().includes("aankh hai bhari bhari")) {
      title = "Aankh Hai Bhari Bhari";
      artist = "Tum Se Achcha Kaun Hai";
    } else if (title.toLowerCase().includes("dekhne waalon ne")) {
      title = "Dekhne Waalon Ne";
      artist = "Chori Chori Chupke Chupke";
    } else if (title.toLowerCase().includes("tum to thehre pardesi")) {
      title = "Tum To Thehre Pardesi";
      artist = "Altaf Raja";
    } else if (title.toLowerCase().includes("chehra kya dekhte ho")) {
      title = "Chehra Kya Dekhte Ho";
      artist = "Asha Bhosle, Kumar Sanu";
    } else if (title.toLowerCase().includes("too shayar hai main teri shayari")) {
      title = "Too Shayar Hai Main Teri Shayari";
      artist = "Saajan";
    } else if (title.toLowerCase().includes("paas woh aane lage")) {
      title = "Paas Woh Aane Lage";
      artist = "Main Khiladi Tu Anari";
    } else if (title.toLowerCase().includes("tumse milna")) {
      title = "Tumse Milna";
      artist = "Tere Naam";
    } else if (title.toLowerCase().includes("kyo kisi ko")) {
      title = "Kyo Kisi Ko";
      artist = "Tere Naam";
    } else if (title.toLowerCase().includes("dil ka aalam")) {
      title = "Dil Ka Aalam";
      artist = "Aashiqui";
    } else if (title.toLowerCase().includes("pehli pehli baar mohabbat ki hai")) {
      title = "Pehli Pehli Baar Mohabbat Ki Hai";
      artist = "Sirf Tum";
    } else if (title.toLowerCase().includes("toda")) {
      title = "Tune Dil Mera Toda";
      artist = "Sanam Bewafa";
    } else if (title.toLowerCase().includes("kaash kahin aisa hota")) {
      title = "Kaash Kahin Aisa Hota";
      artist = "Mohra";
    } else if (title.toLowerCase().includes("aawara hawa ka jhonka hoon")) {
      title = "Aawara Hawa Ka Jhonka Hoon";
      artist = "Altaf Raja";
    } else if (title.toLowerCase().includes("love tujhe love main karta hoon")) {
      title = "Love Tujhe Love Main Karta Hoon";
      artist = "Barsaat";
    } else if (title.toLowerCase().includes("tere dard se dil aabad raha")) {
      title = "Tere Dard Se Dil Aabad Raha";
      artist = "Deewana";
    } else if (title.toLowerCase().includes("dil cheer ke dekh")) {
      title = "Dil Cheer Ke Dekh";
      artist = "Rang";
    } else if (title.toLowerCase().includes("premi aashiq aawaara")) {
      title = "Premi Aashiq Aawaara";
      artist = "Phool Aur Kaante";
    } else if (title.toLowerCase().includes("dil diwana")) {
      title = "Dil Diwana";
      artist = "Maine Pyar Kiya";
    }

    return {
      title,
      artist,
      src: song.src,
      thumb: song.thumb
    };
  });

  const manifestContent = `// Auto-generated manifest — ${cleanSongs.length} songs from the Truck Driver playlist
// Audio:     public/songs/truck/*.mp3
// Thumbnails: public/songs/truck/*.jpg
export const TRUCK_SONGS = ${JSON.stringify(cleanSongs, null, 2)};
`;

  writeFileSync(MANIFEST_PATH, manifestContent, 'utf8');
  console.log('✅ Cleaned up title format successfully.');
} catch (e) {
  console.error('Error cleaning titles:', e);
}
