export const generateScatteredPhotos = (count) => {
  const photoUrls = [
    'https://picsum.photos/400/400?random=1',
    'https://picsum.photos/400/400?random=2',
    'https://picsum.photos/400/400?random=3',
    'https://picsum.photos/400/400?random=4',
    'https://picsum.photos/400/400?random=5',
    'https://picsum.photos/400/400?random=6',
    'https://picsum.photos/400/400?random=7',
    'https://picsum.photos/400/400?random=8',
    'https://picsum.photos/400/400?random=9',
    'https://picsum.photos/400/400?random=10',
    'https://picsum.photos/400/400?random=11',
    'https://picsum.photos/400/400?random=12',
    'https://picsum.photos/400/400?random=13',
    'https://picsum.photos/400/400?random=14',
    'https://picsum.photos/400/400?random=15',
    'https://picsum.photos/400/400?random=16',
    'https://picsum.photos/400/400?random=17',
    'https://picsum.photos/400/400?random=18',
    'https://picsum.photos/400/400?random=19',
    'https://picsum.photos/400/400?random=20',
  ];

  const titles = [
    'Matahari Terbenam', 'Kopi Pagi', 'Jalan-jalan Sore', 'Bunga di Taman',
    'Kucing Lucu', 'Pemandangan Gunung', 'Makanan Favorit', 'Teman Dekat',
    'Pantai Indah', 'Langit Biru', 'Hujan Deras', 'Pelangi Cantik',
    'Buku Bagus', 'Musik Favorit', 'Olahraga Pagi', 'Malam Berbintang',
    'Keluarga Tercinta', 'Perjalanan Jauh', 'Moment Bahagia', 'Kenangan Indah'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    title: titles[i % titles.length],
    date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
    description: `Moment indah dari ${titles[i % titles.length].toLowerCase()}.`,
    url: photoUrls[i % photoUrls.length],
    mainPhoto: `https://picsum.photos/600/400?random=${i + 100}`,
    rotation: Math.random() * 40 - 20,  // Rotasi acak
  }));
};

export const generatePhotoPositions = (scatteredPhotos, windowSize) => {
  const positions = [];
  const photoSize = windowSize.width >= 1024 ? 176 : 160;
  const margin = 50;
  const startingY = 50;

  const availableWidth = Math.max(windowSize.width - (margin * 2), 600);
  const availableHeight = Math.max(1200, windowSize.height * 1.5);

  const spacing = photoSize * 0.7;
  const cols = Math.floor(availableWidth / spacing);
  const rows = Math.ceil(scatteredPhotos.length / cols);

  for (let i = 0; i < scatteredPhotos.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const baseX = (col * spacing) + margin;
    const baseY = (row * spacing) + startingY;

    const randomOffsetX = (Math.random() - 0.5) * spacing * 0.4;
    const randomOffsetY = (Math.random() - 0.5) * spacing * 0.4;

    positions.push({
      left: Math.max(margin, Math.min(baseX + randomOffsetX, availableWidth - photoSize + margin)),
      top: Math.max(startingY, baseY + randomOffsetY),
    });
  }

  return positions;
};

export const calculateContainerHeight = (photoPositions) => {
  if (photoPositions.length === 0) return 1200;
  const maxTop = Math.max(...photoPositions.map(pos => pos.top));
  return Math.max(maxTop + 250, 1200);
};
