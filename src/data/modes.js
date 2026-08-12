// Pure Mode Data Structure for the 3 Desi Cultural Modes:
// 1. Nauaa / Deluxe Saloon Mode ("डीलक्स सैलून")
// 2. Truck Driver Playlist Mode ("हॉर्न ओके प्लीज")
// 3. Raju Mistri Mode ("राजू मिस्त्री")

export const MODES = [
  {
    id: 'nauaa',
    label: 'Nauaa / Deluxe Saloon',
    shortLabel: 'सैलून',
    hindiTitle: 'डीलक्स सैलून',
    subtitle: 'banger songs that play at indian barber shops',
    bgImage: '/assets/saloon-backdrop-DJP5lZDF.jpg',
    hasHorn: false,
    accentColor: '#e63946',
    // Spotify embed playlist ID — plays directly in iframe, no API key needed
    spotifyPlaylistId: '2AVjI8Z57bqMJVtU3V9X1Q',
    playlist: []
  },
  {
    id: 'truck',
    label: 'Truck Driver Playlist',
    shortLabel: 'ट्रक ड्राइवर',
    hindiTitle: 'हॉर्न ओके प्लीज',
    subtitle: 'High Voltage Highway Beats',
    bgImage: '/assets/bg.jpg',
    hasHorn: true,
    accentColor: '#f77f00',
    spotifyPlaylistId: null,
    playlist: []
  },
  {
    id: 'mistri',
    label: 'Raju Mistri Mode',
    shortLabel: 'राजू मिस्त्री',
    hindiTitle: 'राजू मिस्त्री',
    subtitle: 'Energetic Construction & Worker Anthems',
    bgImage: '/assets/background-CdREQPkK.webp',
    hasHorn: false,
    accentColor: '#d62828',
    spotifyPlaylistId: null,
    playlist: []
  }
];
