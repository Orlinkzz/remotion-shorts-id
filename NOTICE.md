# Pihak ketiga

Kode asli proyek ini berlisensi MIT (lihat `LICENSE`). Komponen di bawah ini **tidak** ikut lisensi
itu dan tetap tunduk pada ketentuannya masing-masing.

## Remotion (wajib dibaca)

Seluruh paket `remotion` dan `@remotion/*` berlisensi **Remotion License**
(https://www.remotion.dev/license, salinannya ada di `node_modules/remotion/LICENSE.md`).

- **Gratis** (termasuk untuk video komersial) bagi: individu, perusahaan for-profit dengan
  maksimal 3 karyawan, organisasi nirlaba, dan untuk evaluasi.
- **Company License wajib** bagi perusahaan for-profit di atas batas itu
  (https://www.remotion.pro).
- **Dilarang** menyalin atau memodifikasi kode Remotion untuk menjual, menyewakan, atau
  melisensikan ulang turunan Remotion. Lisensi MIT proyek ini tidak memberi hak tersebut.
- Siapa pun yang memakai atau mem-fork proyek ini harus memeriksa sendiri kelayakannya
  terhadap Remotion License.

## Template dan basis kode

- **RVE Remotion Templates** (`src/templates/*`, serta `src/scenes/Hook.tsx`, `Points.tsx`,
  `Outro.tsx` yang diadaptasi), dari https://www.reactvideoeditor.com: dibagikan gratis untuk
  dipakai di proyek apa pun, atribusi dihargai. Header asli tiap file dipertahankan.
- **remotion-dev/template-tiktok** (https://github.com/remotion-dev/template-tiktok): basis
  proyek, caption gaya TikTok (`src/components/Captions.tsx`) dan `scripts/transcribe.mjs`.
  Ikut ketentuan repositori tersebut dan Remotion License.
- Gambar bawaan template `ken-burns`, `parallax-pan`, `zoom-pulse` diambil dari Unsplash/Pexels
  saat render dan tunduk pada lisensi situs tersebut.

## Library dan alat

- `msedge-tts` (MIT), `prism-react-renderer` (MIT), `prismjs` (MIT), `zod` (MIT), React (MIT).
- Whisper.cpp (MIT) dan model Whisper (MIT, OpenAI) diunduh saat `npm run transcribe`,
  tidak disertakan di repositori.
- Font Inter dan JetBrains Mono (SIL Open Font License 1.1) dimuat lewat Google Fonts.

## Layanan TTS

Audio hasil `npm run tts` tunduk pada ketentuan provider yang dipakai:

- `edge`: layanan Read Aloud Microsoft Edge, tidak resmi dan tanpa jaminan; ketentuan untuk
  pemakaian komersial tidak jelas.
- `azure`: Microsoft Azure Speech, ikut ketentuan layanan Azure.
- `google`: Google Cloud Text-to-Speech, ikut ketentuan layanan Google Cloud.
- `gtranslate`: endpoint Google Translate, tidak resmi.

Untuk konten komersial, gunakan provider resmi (`azure` / `google`) atau rekaman sendiri.
