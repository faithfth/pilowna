/** Konfigurasi — sesuaikan nama panggilan & inside joke di sini */
export const CHAT_CONFIG = {
  botName: 'Soren',
  botEmoji: '💕',
  userNickname: 'pilo sayangg',
  storageKey: 'pilowna_chat_memory',
};

/** Intent → keyword & sinonim untuk matching */
export const INTENTS = {
  greeting: {
    keywords: ['hai', 'halo', 'hello', 'hi', 'hey', 'pagi', 'siang', 'sore', 'malam', 'assalam', 'permisi'],
    weight: 1,
  },
  sad: {
    keywords: [
      'bt', 'bete', 'sedih', 'down', 'galau', 'stress', 'stres', 'murung', 'nangis', 'menangis',
      'gundah', 'terpuruk', 'kecewa', 'sakit hati', 'broken', 'bad mood', 'again', 'lagi bt',
      'lagi bete', 'ga mood', 'gak mood', 'tidak mood', 'depresi', 'hancur',
    ],
    weight: 3,
  },
  tired: {
    keywords: ['capek', 'lelah', 'ngantuk', 'burnout', 'penat', 'letih', 'exhausted', 'cape', 'pusing'],
    weight: 2,
  },
  hungry: {
    keywords: ['lapar', 'laper', 'makan', 'diet', 'gorengan', 'mie', 'snack', 'ngemil'],
    weight: 2,
  },
  love: {
    keywords: ['sayang', 'cinta', 'love', 'i love you', 'ily', 'muach', 'mwah', 'kamu sayang', 'love you'],
    weight: 3,
  },
  miss: {
    keywords: ['kangen', 'rindu', 'miss', 'kangen banget', 'kangen deh', 'rindu banget'],
    weight: 3,
  },
  thanks: {
    keywords: ['makasih', 'terima kasih', 'thank you', 'thanks', 'thx', 'makasi', 'mksih'],
    weight: 2,
  },
  happy: {
    keywords: ['senang', 'bahagia', 'happy', 'hepi', 'excited', 'semangat', 'good mood', 'alhamdulillah', 'syukur'],
    weight: 2,
  },
  motivation: {
    keywords: ['kasih aku semangat', 'butuh semangat', 'semangatin', 'semangat dong', 'minta semangat'],
    weight: 4,
  },
  bored: {
    keywords: ['bosan', 'bosen', 'boring', 'jenuh', 'monoton', 'gabut'],
    weight: 2,
  },
  compliment: {
    keywords: ['cantik', 'lucu', 'gemes', 'keren', 'hebat', 'pinter', 'baik', 'the best', 'special'],
    weight: 2,
  },
  who: {
    keywords: ['kamu siapa', 'siapa kamu', 'who are you', 'pilowna', 'kamu apa', 'kamu ini siapa'],
    weight: 2,
  },
  help: {
    keywords: ['bantuin', 'bantu', 'help', 'gimana', 'bagaimana', 'tolong', 'advice', 'saran'],
    weight: 2,
  },
  work: {
    keywords: ['kerja', 'kantor', 'bos', 'deadline', 'meeting', 'kerjaan', 'proyek', 'project', 'shift', 'rekan kerja'],
    weight: 2,
  },
  study: {
    keywords: ['kuliah', 'sekolah', 'tugas', 'skripsi', 'ujian', 'belajar', 'dosen', 'guru', 'kelas', 'nilai'],
    weight: 2,
  },
  anxious: {
    keywords: ['cemas', 'overthinking', 'overthink', 'takut', 'khawatir', 'panik', 'gelisah', 'deg degan', 'insecure', 'nggak tenang'],
    weight: 3,
  },
  lonely: {
    keywords: ['sendiri', 'sendirian', 'kesepian', 'sepi', 'nggak ada teman', 'ga ada yang ngerti', 'ditinggal', 'butuh teman', 'butuh ditemani', 'nemenin aku'],
    weight: 3,
  },
  relationship: {
    keywords: ['pacar', 'gebetan', 'mantan', 'pdkt', 'putus', 'selingkuh', 'hubungan', 'chat dia', 'dia berubah'],
    weight: 3,
  },
  family: {
    keywords: ['keluarga', 'orang tua', 'ortu', 'mama', 'mami', 'papa', 'ayah', 'ibu', 'kakak', 'adik'],
    weight: 2,
  },
  health: {
    keywords: ['sakit', 'demam', 'pusing', 'batuk', 'flu', 'mual', 'perut', 'dokter', 'obat', 'tidur'],
    weight: 2,
  },
  apologize: {
    keywords: ['maaf', 'sorry', 'salahku', 'aku salah', 'minta maaf'],
    weight: 2,
  },
  celebration: {
    keywords: ['lulus', 'menang', 'berhasil', 'keterima', 'naik gaji', 'ulang tahun', 'selesai', 'dapat kerja', 'promosi'],
    weight: 3,
  },
  gratitude: {
    keywords: ['bersyukur', 'beruntung', 'terharu', 'makin sayang', 'senang banget'],
    weight: 2,
  },
  yes: {
    keywords: ['iya', 'ya', 'yes', 'mau', 'oke', 'ok', 'siap', 'boleh', 'yup', 'yoi', 'gas'],
    weight: 1,
  },
  no: {
    keywords: ['nggak', 'gak', 'ga', 'tidak', 'no', 'engga', 'enggak', 'belum', 'males'],
    weight: 1,
  },
};

/** Respons per intent — bisa string atau array (random) */
export const RESPONSES = {
  greeting: [
    'Halo {nickname}! Senang banget kamu datang ngobrol 💕',
    'Hai {nickname}~ Aku siap dengerin cerita kamu hari ini ✨',
    'Heyy {nickname}! Lagi ngapain nih? Cerita dong~',
  ],
  greeting_return: [
    'Hai {nickname}! Senang kamu balik 💕',
    'Welcome back {nickname}! Kangen ngobrol sama kamu~',
  ],
  sad: [
    'Hmm... Aku dengerin ya. Kamu lagi ngerasa berat ya? It\'s okay, kamu nggak sendirian kok 🤍',
    'Aduh {nickname}... Aku peluk virtual dulu yaa sayangg 🫂 Kamu udah hebat banget sampai sejauh ini.',
    'Sedih itu manusiawi kok. Aku di sini temenin kamu, kamu boleh cerita 💕',
    'BT itu valid banget. Kamu boleh lemah sebentar, tapi ingat — kamu itu berharga banget sayangg.',
  ],
  sad_followup: [
    'Mau cerita sedikit apa yang bikin hati kamu berat? aku dengerin tanpa nge-judge ya 🤍',
    'Kalau mau curhat, Aku siap. Atau kalau cuma butuh didengerin, itu juga oke banget 💕',
    'Kadang cuma butuh tempat buat di dengerin, Aku ada di sini kok~',
  ],
  sad_deep: [
    'Terima kasih udah percaya cerita ke Aku. Kamu kuat banget, meski hari ini terasa berat 🌸',
    'Aku nggak bisa fix semuanya, tapi Aku bisa nemenin kamu. Kamu nggak sendirian 💕',
    'Setiap bad day itu nggak define siapa kamu. Kamu jauh lebih dari satu hari yang buruk ✨',
    'Kalau dunia terasa terlalu bising, ingat — ada tempat buat kamu pulang. Always 🤍',
  ],
  tired: [
    'Capek ya? Istirahat dulu {nickname}, tubuh kamu juga butuh disayang 🌙',
    'Kamu udah kerja keras banget. Minum air, tarik napas, istirahat sebentar ya 💤',
    'Burnout itu tanda kamu terlalu keras ke diri sendiri. Pelan-pelan aja, nggak usah buru-buru~',
    'Recharge dulu sayangg, dunia bisa nunggu ✨',
  ],
  hungry: [
    'Lapar ya? Jangan lupa makan yang enak-enak yaa {nickname}! Gausah takut gendut, yang penting hati tenang 🍜',
    'Sayang juga jangan lupa makan ya! Aku khawatir kalau kamu skip meal 💕',
    'Makan dulu sayangg, baru lanjut Kegiatan. Kamu deserve makanan yang bikin happy! 🥰',
  ],
  love: [
    'Aku sayang banget sama {nickname} juga! 💕💕💕',
    'I love you too {nickname}! Kamu itu spesial banget buat Aku ✨',
    'Mmmuaahah! Aku juga sayang kamu sampai 50 tahun kedepan 💖',
    'Hatiku full cuma buat {nickname}. Kamu itu home (bukan home credit ya 😱) 🏡💕',
  ],
  miss: [
    'Aku juga kangen {nickname}! Makanya website ini dibuat — biar selalu ada buat kamu 💕',
    'Rindu itu bukti kalau ada seseorang yang spesial banget di hati. dan kamu itu spesial buat aku ✨',
    'Kangen ya? aku hug virtual dulu 🫂 Semoga hari kamu jadi lebih lembut~',
  ],
  thanks: [
    'Sama-sama {nickname}! Senang bisa nemenin kamu 💕',
    'Nggak perlu makasih, Aku happy kalau kamu happy ✨',
    'Anytime {nickname}! Kamu deserve semua kebaikan di dunia 🌸',
  ],
  happy: [
    'Yay! Senang denger kamu lagi happy {nickname}! 🎉💕',
    'Wah bagus banget! Semoga senyum kamu nular seharian ya ✨',
    'Alhamdulillah! Akuikut happy kalau kamu happy 🥰',
  ],
  motivation: [
    'Sini, aku suntik semangat dulu ⚡ Kamu boleh capek, tapi jangan lupa: kamu itu pemeran utama, bukan figuran di hidup sendiri 💕',
    'Semangat, sayang! Kalau hari ini terasa nyebelin, kita tatap balik sambil bilang: “maaf ya, aku tetap keren” 😌✨',
    'Aku percaya sama kamu bahkan saat kamu lagi pura-pura nggak percaya sama diri sendiri. Jadi ayo gerak satu langkah—aku ngawasin dari sini 🤍',
    'Dunia boleh ribut, deadline boleh sok penting, tapi kamu tetap lebih berharga. Minum dulu, tarik napas, lalu gas pelan-pelan 💪💕',
    'Ini bukan sekadar semangat, ini paket lengkap: peluk virtual, tepuk tangan, dan sedikit omelan karena kamu nggak boleh menyerah 🫂✨',
  ],
  bored: [
    'Bosan ya? Coba main sama peliharaan di tab sebelah, atau buka gashapon buat semangat! 🎁',
    'Gabut? aku temenin ngobrol aja~ Cerita random apa aja boleh 💕',
    'Bosen itu waktu yang perfect buat self-care. Skincare, playlist, atau tidur siang? ✨',
  ],
  compliment: [
    'Hehe makasih {nickname}! Tapi yang paling cantik itu hati kamu sih 💕',
    'Aww~ Aku yang harusnya bilang: KAMU yang gemes banget! ✨',
    'Pujian diterima! Tapi Aku lebih bangga sama ke tantruman kamu 🌸',
  ],
  who: [
    'Aku Soren! Mesin chat cinta yang dibuat khusus buat {nickname} 💕',
    'Namaku Soren~ Aku di sini buat nemenin, nghibur, dan sayang sama kamu selalu ✨',
  ],
  help: [
    'Aku nggak punya jawaban sempurna, tapi Aku punya telinga dan hati buat kamu 🤍',
    'Ceritain dulu ya, lagi butuh bantuan soal apa? Aku coba bantu sebisanya 💕',
  ],
  work: [
    'Kerjaan lagi ngajak ribut ya, {nickname}? Sini, kita jinakkan satu tugas dulu—kamu nggak sendirian kok, ada aku yang cerewet nemenin 🤍',
    'Deadline boleh sok galak, tapi kamu lebih galak kalau fokus. Minum dulu, lalu kita sikat satu tugas kecil dalam 10 menit 💕',
    'Aku bangga kamu masih bertahan di tengah kerjaan yang kayak rombongan chat nggak penting. Pelan-pelan, kamu tetap keren ✨',
    'Kalau ada orang kantor yang bikin kamu lelah, cerita sini. Aku bantu mengomel dengan elegan sambil tetap jagain hati kamu.',
  ],
  study: [
    'Tugas numpuk kayak mantan yang belum move on ya? Tenang, kita beresin satu bagian dulu. Kamu pintar, cuma otaknya minta dielus 📚💕',
    'Belum paham bukan berarti bodoh—berarti materinya lagi jual mahal. Kita taklukkan satu soal dulu, sayang ✨',
    'Skripsi dan ujian boleh bikin kepala penuh, tapi jangan sampai bikin kamu lupa kalau kamu tetap manusia favoritku 🤍',
    'Aku temenin belajar. Kirim bagian yang bikin stuck—kita bikin dia menyesal sudah mengganggu kamu.',
  ],
  anxious: [
    'Tarik napas pelan ya: masuk 4, tahan 4, keluar 6. Si cemas boleh berisik, tapi dia bukan bosnya kamu. Aku di sini 🤍',
    'Cemas itu sering hobi bikin trailer horor dari hal yang belum tentu terjadi. Kita cek faktanya pelan-pelan, ya sayang?',
    'Nggak perlu langsung tenang total. Kendalikan satu hal kecil dulu—sisanya biar aku temenin sambil kamu tetap jadi manusia gemes 💕',
    'Kalau pikiranmu berisik, sebut tiga hal yang kamu lihat. Kita tarik kamu balik ke sekarang, sebelum overthinking keburu bikin sinetron ✨',
  ],
  lonely: [
    'okay aku temenin kamu yaa 🫂',
    'hati kamu lagi minta dipeluk, dan kebetulan aku punya stok peluk yang banyak buat kamu sayang 💕',
    'Mau ngobrol random, serius, atau diam-diaman? Aku ikut. Tapi kalau diamnya kelamaan, aku godain ya.',
    'Kamu masih punya wa aku kan? yaudah wa aja',
  ],
  relationship: [
    'Soal hati memang nggak ada manual book-nya. Cerita sini—aku bantu baca gelagatnya, sambil tetap membela kamu dengan anggun.',
    'Kamu pantas dapat hubungan yang jelas, aman, dan saling menghargai. Bukan jadi detektif freelance tiap malam 💕',
    'Sebelum kirim chat saat emosi, napas dulu. Kita susun kalimat yang jujur, elegan, dan bikin kamu tetap terlihat mahal.',
    'Kalau dia berubah, bukan berarti kamu kurang. Bisa jadi dia saja yang belum sadar sedang kehilangan manusia sehebat kamu ✨',
  ],
  family: [
    'Urusan keluarga memang paket komplit: sayang, pusing, dan bonus drama. Cerita sini, aku dengerin tanpa menghakimi 🤍',
    'Kamu boleh sayang keluarga sambil punya batasan. Menjaga diri itu bukan jahat—itu namanya kamu juga penting 💕',
    'Kalau ngomong langsung terasa berat, kita susun kalimat yang lembut tapi tetap punya tulang punggung. Aku bantu.',
  ],
  health: [
    'Aduh, badan kamu lagi demo ya {nickname}? Istirahat, minum cukup, dan jangan sok kuat—yang boleh manja hari ini kamu 🤍',
    'Aku bisa nemenin, tapi kalau keluhannya berat atau memburuk, hubungi tenaga kesehatan ya. Aku mau kamu sehat, bukan cuma cute 💕',
    'Untuk sekarang: air putih, makan ringan kalau bisa, dan rebahan yang nyaman. Dunia bisa menunggu, kamu jangan tumbang ✨',
  ],
  apologize: [
    'Aku terima maafmu, sayang. Salah boleh, asal jangan dijadikan hobi—kamu masih terlalu manis untuk jadi penjahat 🤍',
    'Nggak usah menghukum diri terus. Ambil pelajarannya, lalu pulang ke versi kamu yang lebih lembut 💕',
    'Kalau perlu minta maaf, jujur dan spesifik ya. Nggak perlu bikin novel—ketulusan kamu sudah cukup bikin hati luluh.',
  ],
  celebration: [
    'YEAYYY! Aku ikut bangga sampai pengin bikin spanduk! Cerita dong, bagian mana yang paling bikin kamu lega? 🎉💕',
    'Kamu berhasil! Tolong rayakan, jangan pura-pura biasa saja—aku tahu kamu keren, jangan sok rendah hati terus ✨',
    'Standing ovation virtual buat kamu! Sini, pamer sedikit nggak dosa. Aku siap jadi fans nomor satu 🤍',
  ],
  gratitude: [
    'Aduh, hati kamu hangat banget. Pantes aku betah—ternyata kamu memang semanis itu 💕',
    'Rasa syukur kecil tetap layak dirayakan. Simpan momen ini, biar nanti kalau hari rese kamu punya bukti hidup pernah manis ✨',
  ],
  yes: [
    'Oke {nickname}! Aku dengerin ya, ceritain aja pelan-pelan~ 🤍',
    'Siap! Aku ada di sini. Take your time ya sweet heart 💕',
  ],
  no: [
    'Oke, nggak apa-apa kok. Aku tetap di sini kalau kamu berubah pikiran 🤍',
    'Gapapa {nickname}, kamu nggak wajib cerita. Aku tetap sayang kamu 💕',
  ],
  default: [
    'Hmmm, Aku lagi mikir... Kamu maksudnya gimana ya? Ceritain lebih lanjut dong~',
    'Aku dengerin kok. Boleh cerita lebih detail? 💕',
    'Wah, Aku belum paham nih. Coba katakan dengan cara lain? Atau pilih quick reply di bawah ✨',
    'Aku di sini buat kamu. Lagi ngerasa gimana hari ini?',
    'Aku mau memahami kamu, bukan cuma menjawab cepat. Ceritain latar belakangnya sedikit ya, sayang 🤍',
    'Kalau kalimatku belum nyambung, bantu aku dengan satu detail kecil: ini tentang kerjaan, hati, keluarga, atau perasaanmu?',
    'Aku baca pelan-pelan kok. Kamu bisa cerita dengan gaya apa pun—acak, panjang, atau cuma beberapa kata 💕',
  ],
  comfort_close: [
    ' harapan aku sedikit aja, hati kamu merasa lebih ringan sekarang 🤍',
    'Kamu hebat banget udah sejauh ini. Aku bangga sama {nickname} kesayangan aku 💕',
  ],
};

/** Quick reply chips */
export const QUICK_REPLIES = [
  'lagi bt 😔',
  'lagi capek',
  'kangen',
  'makasih ya',
  'lagi happy!',
  'lagi lapar',
  'deadline kerjaan 😵‍💫',
  'aku overthinking',
  'aku kesepian',
  'kasih aku semangat',
];

/** Pesan sweet modal — muncul setelah comfort flow selesai */
export const SWEET_TRIGGERS = {
  afterComfortMessages: 3,
  sweetMessages: [
    {
      title: 'Kamu Hebat 💖',
      message: 'Terima kasih udah percaya sama Aku. Kamu kuat, kamu berharga, dan kamu nggak sendirian. I love you {nickname}! 💕',
    },
    {
      title: 'Aku Sayang Kamu 💕',
      message: 'Apapun yang kamu lalui hari ini, ingat — ada yang selalu mendoakan dan sayang sama kamu. It\'s me. Soren. Always.',
    },
  ],
};
