import path from "node:path";

// Lokasi instalasi Whisper.cpp
export const WHISPER_PATH = path.join(process.cwd(), "whisper.cpp");

// Versi Whisper.cpp
export const WHISPER_VERSION = "1.6.0";

// Model. Konten campuran Indonesia + Inggris WAJIB model multibahasa
// (tanpa akhiran .en). Pilih sesuai mesin:
// | small    | 466 MB | ~1.0 GB RAM | cepat, cukup untuk rekaman bersih (dipakai sekarang)
// | medium   | 1.5 GB | ~2.6 GB RAM | lebih akurat untuk rekaman berisik
// | large-v3 | 2.9 GB | ~4.7 GB RAM | paling akurat, paling lambat
// Ganti model = unduhan baru saat `npm run transcribe` berikutnya.
/** @type {import('@remotion/install-whisper-cpp').WhisperModel} */
export const WHISPER_MODEL = "small";

// Bahasa dominan. Karena teks caption diambil dari naskah (bukan dari Whisper),
// salah dengar istilah Inggris tidak muncul di layar; Whisper hanya memberi
// timestamp. Ganti ke "auto" jika rasio Indonesia/Inggris berimbang.
/** @type {import('@remotion/install-whisper-cpp').Language} */
export const WHISPER_LANG = "id";
