---
name: remotion-shorts
description: Menulis naskah video Shorts edukasi coding (public/videos/<id>/video.json) untuk proyek remotion-shorts-id, lalu memvalidasi, membuat suara TTS, dan merender. Pakai saat pengguna minta membuat, merevisi, atau mengecek video pendek/Reels/TikTok/Shorts di repo ini. Hanya memakai tipe scene dan field yang ada di skema; tidak mengubah kode sumber.
---

# remotion-shorts

Skill ini membuat **satu file**: `public/videos/<id>/video.json`, lalu menjalankan perintah npm
yang sudah ada. Semua visual, animasi, caption, dan timing dibuat otomatis oleh proyek.

## Batas skill (wajib dipatuhi)

Skill ini **hanya** boleh:

1. Membuat atau mengedit `public/videos/<id>/video.json`.
2. Menjalankan: `npm run validate <id>`, `npm run tts <id>`, `npm run transcribe <id>`,
   `npm run render <id>`, `npm run dev`.

Skill ini **tidak boleh**:

- Menambah tipe scene, field, atau properti yang tidak ada di tabel "Skema" di bawah.
- Mengedit apa pun di `src/`, `scripts/`, `tts-config.mjs`, `whisper-config.mjs`, atau `src/templates/*`.
- Memakai nama template di luar daftar "Template yang tersedia".
- Membuat atau mengunduh file audio dengan cara lain selain `npm run tts`.
- Menjalankan `npm run tts <id> -- --force` tanpa izin jelas dari pengguna (perintah itu menimpa rekaman).
- Mengedit `captions.json` secara manual.

Kalau permintaan pengguna butuh sesuatu di luar batas ini (scene baru, warna per scene, gambar,
musik latar, transisi khusus, dll.), **jangan dikerjakan diam-diam**. Jelaskan bahwa fitur itu
belum ada di proyek, tawarkan tipe scene terdekat yang tersedia, dan sebutkan bahwa penambahan
fitur adalah pekerjaan pengembangan terpisah (lihat `AGENTS.md`), bukan bagian skill ini.

## Alur kerja

1. **Tanya seperlunya**: topik, target penonton (pemula/menengah), bahasa kode, durasi
   (default 30–45 detik). Kalau tidak dijawab, pakai default.
2. **Pilih `id`**: huruf kecil, angka, dan tanda hubung (kebab-case), mis. `git-rebase-vs-merge`.
   Pastikan folder `public/videos/<id>/` belum dipakai video lain.
3. **Tulis `video.json`** sesuai skema dan aturan naskah di bawah.
4. `npm run validate <id>` dan perbaiki semua baris `X`. Baris `!` boleh tersisa hanya untuk
   `voice.mp3`/`captions.json` yang belum dibuat.
5. **Suara**, pilih salah satu:
   - TTS: `npm run tts <id>` (membuat `voice.mp3` + `captions.json`).
   - Rekaman pengguna: pengguna menaruh `voice.mp3`, lalu `npm run transcribe <id>`.
6. `npm run validate <id>` lagi (harus OK semua), lalu `npm run render <id>` → `out/<id>.mp4`,
   atau minta pengguna mengecek di `npm run dev` (ubah `videoId` di panel Props).

## Skema `video.json`

```json
{
  "$schema": "../../../video.schema.json",
  "title": "Judul video",
  "voice": "voice.mp3",
  "scenes": [ ... ]
}
```

| Field | Wajib | Keterangan |
|---|---|---|
| `$schema` | ya | Selalu `"../../../video.schema.json"` |
| `title` | ya | Judul video (tidak tampil di layar) |
| `voice` | tidak | Default `"voice.mp3"`. Jangan diubah kecuali pengguna memakai file lain |
| `scenes` | ya | Minimal 1 scene, disarankan 4–6 |

Field yang dimiliki **semua** scene:

| Field | Wajib | Keterangan |
|---|---|---|
| `type` | ya | `hook`, `code`, `points`, `outro`, atau `template` |
| `narration` | ya | Kalimat yang diucapkan di scene ini. Jadi teks caption di layar |
| `speech` | tidak | Teks untuk TTS kalau pelafalan harus beda dari caption |

Field per tipe (hanya ini, tidak ada yang lain):

| type | Field | Aturan |
|---|---|---|
| `hook` | `text`, `subtext?` | `text` ≤ 36 karakter (≤ 22 paling besar). `*kata*` diberi warna aksen. `subtext` 1 kalimat pendek, tanpa `*` |
| `code` | `language`, `filename?`, `code`, `highlightLines?` | Lihat "Aturan scene code" |
| `points` | `title?`, `items` | `items` 1–6 butir (ideal 3), masing-masing ≤ 40 karakter. `*kata*` boleh di `title` dan `items` |
| `outro` | `cta`, `handle?` | `cta` ≤ 40 karakter, tanpa `*`. `handle` dikosongkan saja (default: nama brand) |
| `template` | `template`, `props?` | `template` = nama dari daftar di bawah. `props` = isi template, lihat "Template yang tersedia" |

### Aturan scene `code`

- `language`: salah satu dari `javascript`, `js`, `typescript`, `ts`, `jsx`, `tsx`, `php`, `python`,
  `py`, `go`, `rust`, `kotlin`, `swift`, `dart`, `sql`, `bash`, `sh`, `shell`, `json`, `yaml`, `yml`,
  `docker`, `dockerfile`, `css`, `html`, `xml`, `markdown`, `graphql`, `c`, `cpp`, `objectivec`, `text`.
- `code`: string JSON, baris dipisah `\n`, tanda kutip ganda di-escape `\"`.
  **Setiap baris ≤ 38 karakter** (lebih panjang = font mengecil), **maksimal 12 baris**.
  Indentasi 2 atau 4 spasi, jangan tab.
- `filename`: nama file yang masuk akal, mis. `PostController.php`. Kalau kosong, yang tampil nama bahasa.
- `highlightLines`: daftar rentang `[awal, akhir]` (1-based, inklusif), mis. `[[1, 1], [3, 4]]`.
  Rentang disorot bergantian di 60% akhir scene, jadi urutkan sesuai urutan penjelasan di
  `narration`. Nomor baris tidak boleh melebihi jumlah baris `code`. Maksimal 3 rentang.

## Aturan naskah (`narration` dan `speech`)

- `narration` = kalimat yang **benar-benar diucapkan**. Batas scene ditentukan dari kata pertama
  `narration`, jadi isinya harus urut sesuai yang dibicarakan di scene itu.
- Gaya: bahasa Indonesia santai, kalimat pendek, sapaan "kamu". Istilah teknis ditulis dengan ejaan
  aslinya (Laravel, PostgreSQL, Next.js, useEffect).
- Panjang: TTS bicara ±2 kata/detik. 30 detik ≈ 60 kata, 45 detik ≈ 90 kata, 60 detik ≈ 120 kata.
  Per scene: hook 8–15 kata, code 15–30 kata, points 20–30 kata, outro 5–10 kata.
- Struktur yang disarankan: `hook` (masalah/janji) → `code` (contoh salah) → `code` (solusi) →
  `points` (ringkasan) → `outro` (ajakan follow).
- Hindari simbol yang sulit diucapkan di `narration` (`||`, `??`, `=>`, `->`, `N+1`). Kalau simbol
  itu perlu tampil di caption, isi `speech` dengan versi yang bisa diucapkan.
- `speech` dipakai **hanya** kalau perlu. Isinya harus kalimat yang sama dengan `narration`, hanya
  beda ejaan/pelafalan. Jangan menambah atau membuang kalimat.

Ejaan bantu yang sudah terbukti untuk suara TTS Indonesia (`id-ID-ArdiNeural`):

| Di narration | Di speech |
|---|---|
| N+1 | N plus one |
| foreach | for each |
| preventLazyLoading | prevent lazy loading |
| Debugbar | debug bar |
| nullish coalescing | nalis kolesing |
| falsy | fol si |
| optional chaining | opsional ceining |
| undefined | andefaind |

## Template yang tersedia

Hanya nama di tabel ini (persis, huruf kecil). Isi template diatur lewat `props`; semua field opsional, field yang tidak diisi memakai contoh bawaan (yang **tidak** terkait topik, jadi isi field yang tercantum). Field di luar daftar ini DILARANG:

| Field `props` | Isi |
|---|---|
| `title` | Judul, ≤ 36 karakter, `*kata*` = warna aksen |
| `subtitle` | Keterangan pendek, ≤ 40 karakter, tanpa `*` |
| `text` | Kalimat panjang (kutipan, pesan, teks yang diketik), ≤ 120 karakter |
| `items` | 1–8 teks pendek (≤ 28 karakter) |
| `values` | 1–8 angka, urut sesuai `items` |
| `value` | Satu angka |
| `unit` | Akhiran angka, mis. `"%"`, `"ms"`, `"x"` |
| `images` | Path gambar relatif folder video. **Jangan diisi** kecuali pengguna menyebut file gambarnya |
| `accent` | Warna CSS. Jangan diisi kecuali diminta |

| Kategori | Template | Field yang dipakai |
|---|---|---|
| Angka | `stat-counter` | `value`, `unit`, `title` (label), `subtitle` |
| | `circular-progress` | `value` (0–100), `unit`, `title`, `subtitle` |
| | `countdown-timer` | `value` (detik), `title`, `subtitle` |
| Chart | `chart-animation`, `line-chart`, `area-chart`, `progress-bars` | `title`, `subtitle`, `items` (label), `values`, `unit` |
| | `comparison-chart` | `title`, `items` (2 label), `values` (2 angka), `unit` |
| | `pie-chart`, `donut-chart` | `title`, `items`, `values` (`donut-chart`: + `subtitle`, `value`, `unit` di tengah) |
| Daftar | `animated-list`, `progress-steps` | `title`, `items` |
| | `credits-roll` | `title`, `items` |
| | `split-screen` | `title`, `items` (2 label, mis. "Sebelum", "Sesudah") |
| | `card-flip` | `title` (istilah), `text` (artinya) |
| Teks | `animated-text`, `bounce-text`, `bubble-pop-text`, `floating-bubble-text`, `glitch-text`, `popping-text`, `pulsing-text`, `slide-text`, `text-highlight`, `cinematic-title-intro`, `sound-wave` | `title`, `subtitle` (`bubble-pop-text`, `popping-text`, `pulsing-text`: `title` 1–2 kata) |
| | `title-split` | `title`, `subtitle`, `text` |
| | `typewriter-subtitle` | `text`, `title` (label kecil) |
| | `chapter-title` | `value` (nomor bab), `title`, `subtitle` |
| | `quote-card` | `text` (kutipan), `subtitle` (penulis) |
| | `notification-pop` | `title` (aplikasi), `text` (pesan), `subtitle` (waktu), `items` (notifikasi lain) |
| | `countdown-intro` | `value` (1–10), `title`, `subtitle` |
| Brand | `lower-third` | `title` (nama), `subtitle` (jabatan) |
| | `subscribe-reminder`, `end-card` | `title`, `subtitle` (`end-card`: + `items`, `text`) |
| | `logo-blur-reveal`, `logo-bounce-drop`, `logo-fade-reveal`, `logo-glitch-reveal`, `logo-scale-rotate`, `logo-spin-reveal`, `logo-split-reveal`, `logo-stroke-draw`, `logo-typewriter` | `title` (brand), `subtitle` (tagline) |
| Transisi | `clock-wipe`, `blinds-transition`, `cross-dissolve`, `fade-through-black`, `iris-transition`, `morph-transition`, `pixel-transition`, `push-transition`, `slide-wipe`, `whip-pan`, `zoom-through` | `items` (1 teks: layar A, mis. masalah), `title` + `subtitle` (layar B, mis. solusi) |
| Latar | `bokeh-circles`, `geometric-patterns`, `gradient-shift`, `grid-pulse`, `liquid-wave`, `matrix-rain`, `noise-grain`, `particle-explosion`, `starfield` | `title`, `subtitle` |
| Efek | `spotlight-reveal`, `letterbox-reveal`, `film-burn`, `camera-shake`, `vignette-pulse` | `title`, `subtitle` (+ `images` kalau ada gambar) |
| Gambar | `ken-burns`, `parallax-pan`, `zoom-pulse`, `image-zoom-reveal`, `image-comparison-slider`, `picture-in-picture`, `polaroid-frame`, `gallery-grid`, `masonry-gallery`, `image-carousel`, `rotating-carousel`, `photo-stack` | `images` (wajib), `title`, `items` (caption). **Hanya kalau pengguna memberi gambar** |

Kapan memakai `template`:

- Isi materi utama tetap `hook`, `code`, `points`, `outro`. Template untuk variasi: angka/statistik (`stat-counter`, `comparison-chart`), istilah (`card-flip`), pergantian masalah → solusi (template transisi), atau pembuka bagian (`chapter-title`).
- Maksimal 2 scene `template` per video, dan selalu isi `props` sesuai topik.
- `narration` scene template tetap wajib dan harus menjelaskan apa yang tampil.

Contoh:

```json
{
  "type": "template",
  "narration": "Hasilnya, query turun dari seratus satu jadi dua saja.",
  "speech": "Hasilnya, query turun dari seratus satu jadi dua saja.",
  "template": "comparison-chart",
  "props": { "title": "Jumlah *query*", "items": ["Sebelum", "Sesudah"], "values": [101, 2] }
}
```

## Checklist sebelum selesai

- [ ] `id` kebab-case dan folder baru.
- [ ] Semua scene punya `type` dan `narration`; tidak ada field di luar tabel skema.
- [ ] Baris kode ≤ 38 karakter, ≤ 12 baris; `highlightLines` di dalam jumlah baris.
- [ ] `*kata*` hanya di `hook.text`, `points.title`, `points.items`.
- [ ] Total kata sesuai durasi (±2 kata/detik).
- [ ] `speech` hanya di scene yang butuh, kalimatnya sama dengan `narration`.
- [ ] `npm run validate <id>` tanpa `X`.

## Masalah umum

| Gejala | Penyebab / solusi |
|---|---|
| `validate` menulis `X scenes.N.type` | Tipe scene salah ketik atau tidak ada. Pakai salah satu dari 5 tipe |
| `X highlightLines [a,b] di luar n baris` | Nomor baris melebihi jumlah baris `code` |
| `! baris kode terpanjang > 38` | Pecah baris atau pendekkan nama variabel |
| `npm run tts` menolak menimpa `voice.mp3` | Itu rekaman pengguna. Tanya dulu sebelum memakai `-- --force` |
| Semua provider TTS gagal | Cek internet; minta pengguna mengisi key Azure/Google di `.env` |
| Whisper menulis istilah dengan ejaan aneh | Normal. Caption diambil dari `narration`, jadi tetap benar di layar |
| Durasi di Studio tidak berubah | Pilih *Reload composition* di Studio |

## Contoh lengkap

Lihat `public/videos/n-plus-one/video.json` (PHP/Laravel) dan
`public/videos/nullish-coalescing/video.json` (JavaScript). Potongan singkat:

```json
{
  "$schema": "../../../video.schema.json",
  "title": "Jangan pakai || untuk nilai default di JavaScript",
  "voice": "voice.mp3",
  "scenes": [
    {
      "type": "hook",
      "narration": "Masih pakai operator OR untuk nilai default di JavaScript? Hati-hati, angka nol bisa hilang.",
      "text": "*||* bisa menghapus angka 0",
      "subtext": "Bug kecil yang sering lolos review"
    },
    {
      "type": "code",
      "narration": "Solusinya pakai nullish coalescing, yaitu dua tanda tanya. Operator ini hanya mengganti null dan undefined, jadi nol tetap nol.",
      "speech": "Solusinya pakai nalis kolesing, yaitu dua tanda tanya. Operator ini hanya mengganti null dan andefaind, jadi nol tetap nol.",
      "language": "javascript",
      "filename": "player.js",
      "code": "const config = { volume: 0 };\n\nconst volume = config.volume ?? 50;\nconsole.log(volume); // 0",
      "highlightLines": [[3, 3], [4, 4]]
    },
    {
      "type": "outro",
      "narration": "Follow untuk tips JavaScript berikutnya.",
      "cta": "Follow untuk tips JavaScript lainnya"
    }
  ]
}
```
