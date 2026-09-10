# Pilowna 💕

Website interaktif front-end dengan JavaScript — responsif di semua perangkat.

## Fitur

- **Kambing Animasi** — Klik makanan, kambing berjalan dan makan. Saat perut kenyang atau makanan habis → muncul "I Love You"
- **Quiz Cinta** — Pertanyaan interaktif; jawaban semua benar → pesan sweet
- **Gatcha Semangat** — Buka kotak, dapat pesan motivasi (1x sehari, disimpan di localStorage)
- **Gelembung Love** — Di empat sudut layar, meledak dan muncul lagi

## Cara Menjalankan

Buka `index.html` di browser, atau jalankan local server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Lalu buka http://localhost:8080

## Struktur

```
Pilowna/
├── index.html
├── css/styles.css
├── js/
│   ├── main.js
│   ├── bubbles.js
│   ├── goat.js
│   ├── quiz.js
│   └── gacha.js
└── README.md
```

## Kustomisasi

- **Quiz**: Edit pertanyaan di `js/quiz.js` → array `QUESTIONS`
- **Gatcha**: Edit pesan di `js/gacha.js` → array `MESSAGES`
- **Warna/tema**: Edit variabel CSS di `css/styles.css` → `:root`
