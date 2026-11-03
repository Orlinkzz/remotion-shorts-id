// Pengaturan `npm run tts <id>`: membuat voice.mp3 dari `narration` (atau `speech`) tiap scene.
//
// Provider dicoba berurutan untuk SELURUH video. Kalau satu gagal (limit, jaringan,
// key belum diisi), semua scene dibuat ulang dengan provider berikutnya supaya
// suaranya tetap satu orang. Paksa satu provider: npm run tts <id> -- --provider=azure
export const TTS_PROVIDERS = ["edge", "azure", "google", "gtranslate"];

// Jeda antar scene (ms) saat potongan audio digabung.
export const TTS_SCENE_GAP_MS = 250;

// Kecepatan bicara relatif, dalam persen (0 = normal, 10 = 10% lebih cepat).
export const TTS_RATE = 0;

export const TTS_VOICES = {
  // Gratis, tanpa key (layanan Read Aloud Microsoft Edge, tidak resmi).
  // id-ID-ArdiNeural (pria) | id-ID-GadisNeural (wanita).
  // Istilah Inggris lebih fasih dengan suara multibahasa, mis.
  // { voice: "en-US-AndrewMultilingualNeural", locale: "id-ID" }
  edge: { voice: "id-ID-ArdiNeural", locale: "id-ID" },

  // Resmi, kuota gratis bulanan (tier F0). Suara sama dengan Edge.
  // Butuh AZURE_SPEECH_KEY dan AZURE_SPEECH_REGION di .env
  azure: { voice: "id-ID-ArdiNeural", locale: "id-ID" },

  // Resmi, kuota gratis bulanan. Butuh GOOGLE_TTS_API_KEY di .env
  // Nama suara: id-ID-Standard-*, id-ID-Wavenet-*, id-ID-Chirp3-HD-*
  google: { voice: "id-ID-Wavenet-B", locale: "id-ID" },

  // Cadangan terakhir: gratis tanpa key, kualitas robotik (Google Translate).
  gtranslate: { locale: "id" },
};
