import { readFileSync } from 'fs';

const filePath = 'C:/Users/Hemant Jodhani/.gemini/antigravity-ide/brain/74b04b53-eabe-4f38-b6cb-29e24a876552/.system_generated/steps/609/content.md';
const content = readFileSync(filePath, 'utf8');

const matches = [];
const regex = /href="\/track\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  const trackId = match[1];
  const innerHtml = match[2];
  const text = innerHtml.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
  if (text) {
    matches.push({ trackId, text });
  }
}

console.log('Total matches found:', matches.length);
console.log('All matches:', matches);
