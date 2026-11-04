# Prompt untuk membuat video.json

Dua cara memakai proyek ini dengan AI:

- **A. Agent di dalam repo** (Claude Code, Copilot, Cursor, dll.): agent bisa langsung menulis file
  dan menjalankan perintah. Pakai prompt pendek di bagian A.
- **B. Chatbot di luar repo** (ChatGPT, Claude.ai, Gemini, dll.): chatbot hanya membuat isi
  `video.json`, lalu kamu menyalinnya sendiri. Pakai prompt lengkap di bagian B.

Isi bagian dalam `{kurung kurawal}`, sisanya biarkan apa adanya.

---

## A. Agent di dalam repo

```text
Pakai skill di remotion-shorts-skill/SKILL.md dan patuhi batasnya.
Buat video Shorts tentang: {topik}
Penonton: {pemula / menengah}. Bahasa kode: {mis. PHP}. Durasi: {30-45} detik.
Setelah video.json jadi: jalankan npm run validate, lalu npm run tts, lalu validate lagi.
Jangan render dulu, saya cek di Studio.
```

Revisi:

```text
Pakai skill di remotion-shorts-skill/SKILL.md.
Revisi public/videos/{id}/video.json: {apa yang diubah, mis. "scene 2 terlalu panjang, ringkas jadi 20 kata"}.
Lalu jalankan npm run validate {id} dan npm run tts {id}.
```

Supaya Claude Code mengenali skill ini otomatis, salin foldernya ke `.claude/skills/remotion-shorts/`.

---

## B. Chatbot di luar repo

Salin seluruh blok di bawah ke chatbot, isi bagian `{...}`. Hasilnya simpan sebagai
`public/videos/<id>/video.json`, lalu jalankan `npm run validate <id>` dan `npm run tts <id>`.

````text
Kamu penulis naskah video Shorts edukasi coding (1080x1920, 30-60 detik) untuk proyek
remotion-shorts-id. Tugasmu HANYA menulis satu file JSON. Ikuti aturan di bawah dengan ketat:
jangan menambah tipe scene, field, atau properti lain, dan jangan memakai nama template di luar
daftar. Kalau permintaanku butuh fitur yang tidak ada di aturan ini, jangan dikarang: tulis
"TIDAK DIDUKUNG: <alasan>" lalu buat versi terdekat yang memakai fitur yang ada.

PERMINTAAN
- Topik: {topik, mis. "bedanya git merge dan git rebase"}
- Penonton: {pemula / menengah}
- Bahasa kode: {mis. bash}
- Durasi: {30-45} detik
- id video: {kebab-case, mis. git-merge-vs-rebase}

FORMAT FILE
{
  "$schema": "../../../video.schema.json",
  "title": "<judul>",
  "voice": "voice.mp3",
  "scenes": [ <4-6 scene> ]
}

TIPE SCENE (hanya 5 ini; field di luar daftar DILARANG)
Semua scene: "type", "narration" (wajib), "speech" (opsional).
1. hook:   "text" (<= 36 karakter, *kata* = warna aksen), "subtext" (opsional, tanpa *)
2. code:   "language", "filename" (opsional), "code", "highlightLines" (opsional)
3. points: "title" (opsional, boleh *kata*), "items" (1-6 butir, ideal 3, <= 40 karakter, boleh *kata*)
4. outro:  "cta" (<= 40 karakter, tanpa *). Jangan isi "handle".
5. template: "template" + "props" (field HANYA title, subtitle, text, items, values, value, unit).
   Maksimal 2 per video, hanya salah satu dari:
   - stat-counter: value, unit, title (label), subtitle
   - comparison-chart: title, items (2 label), values (2 angka), unit
   - chart-animation: title, items (label), values, unit
   - circular-progress: value (0-100), title, subtitle
   - card-flip: title (istilah), text (artinya)
   - chapter-title: value (nomor bagian), title, subtitle
   - clock-wipe: items (1 teks masalah), title + subtitle (solusinya)

ATURAN SCENE code
- "language" salah satu: javascript, typescript, tsx, jsx, php, python, go, rust, kotlin, swift,
  dart, sql, bash, json, yaml, docker, css, html, xml, markdown, graphql, c, cpp.
- "code" adalah string JSON: baris dipisah \n, tanda kutip ganda di-escape \".
- Setiap baris <= 38 karakter, maksimal 12 baris, indentasi spasi (bukan tab).
- "highlightLines": rentang [awal, akhir] 1-based inklusif, maksimal 3 rentang, urut sesuai
  penjelasan di narration, tidak boleh melebihi jumlah baris.

ATURAN NASKAH
- "narration" = kalimat yang benar-benar diucapkan di scene itu; jadi caption di layar.
- Bahasa Indonesia santai, kalimat pendek, pakai "kamu". Istilah teknis pakai ejaan asli.
- Panjang: +-2 kata per detik. Hook 8-15 kata, code 15-30, points 20-30, outro 5-10.
- Alur: hook (masalah) -> code (contoh salah) -> code (solusi) -> points (ringkasan) -> outro (follow).
- Hindari simbol di narration (||, ??, =>, ->, N+1). Kalau simbol perlu tampil di caption,
  tambahkan "speech" berisi kalimat yang SAMA tapi dengan ejaan yang mudah diucapkan suara
  Indonesia. Contoh: N+1 -> "N plus one", foreach -> "for each", falsy -> "fol si",
  undefined -> "andefaind", nullish coalescing -> "nalis kolesing".
- Isi "speech" hanya di scene yang butuh. Jangan menambah atau membuang kalimat.

PERIKSA SEBELUM MENJAWAB
- Hanya 5 tipe scene di atas, tidak ada field lain.
- Semua baris kode <= 38 karakter dan highlightLines valid.
- *kata* hanya di hook.text, points.title, points.items.
- Total kata sesuai durasi.
- JSON valid (tanpa komentar, tanpa koma di akhir).

JAWABAN
Tulis hanya satu blok ```json berisi file lengkap, lalu satu baris:
"Simpan sebagai public/videos/<id>/video.json".
````

---

## Contoh isian

| Topik | Bahasa | Durasi |
|---|---|---|
| Bedanya `git merge` dan `git rebase` | bash | 40 detik |
| Kenapa `useEffect` jalan dua kali di React 18 | tsx | 45 detik |
| Index database: kapan dipakai, kapan tidak | sql | 45 detik |
| `async`/`await` vs `.then()` | javascript | 35 detik |
| Validasi request di Laravel pakai Form Request | php | 45 detik |
| List comprehension di Python | python | 30 detik |

## Setelah dapat JSON

```bash
npm run validate <id>      # perbaiki semua baris X
npm run tts <id>           # voice.mp3 + captions.json
npm run dev                # cek di Studio (ubah videoId di panel Props)
npm run render <id>        # out/<id>.mp4
```

Kalau `validate` menunjukkan error, kirim pesan error-nya kembali ke chatbot dengan prompt:

```text
npm run validate menghasilkan error ini:
{tempel error}
Perbaiki video.json tanpa mengubah aturan sebelumnya. Jawab hanya dengan blok json lengkap.
```
