# Katalog template

81 template di `src/templates/`, semuanya berukuran 1080×1920 dan dirender di atas latar NotebookPaper. Konten diletakkan di area aman, karena 560 px terbawah dipakai caption.

Cara pakai di `video.json`:

```json
{
  "type": "template",
  "narration": "Setelah pakai cache, waktu muat turun drastis.",
  "template": "stat-counter",
  "props": { "value": 180, "unit": "ms", "title": "Waktu muat *setelah* cache" }
}
```

Field `props` yang tersedia (semua opsional; field yang tidak diisi memakai contoh bawaan template):

| Field | Tipe | Isi |
| --- | --- | --- |
| `title` | teks | Judul utama. `*kata*` diberi warna aksen |
| `subtitle` | teks | Subjudul, keterangan, tagline, nama penulis, waktu |
| `text` | teks | Kalimat panjang: kutipan, isi notifikasi, teks yang diketik |
| `items` | daftar teks (1–8) | Butir daftar, label chart, langkah, caption gambar, teks layar A di transisi |
| `values` | daftar angka (1–8) | Data chart, urut sesuai `items` |
| `value` | angka | Angka tunggal: counter, persen, hitung mundur, nomor bab |
| `unit` | teks | Akhiran angka: `"%"`, `"ms"`, `"x"` |
| `images` | daftar path (1–8) | Relatif ke folder video (`"img/before.png"`) atau URL. Kosong = placeholder gradien |
| `accent` | warna CSS | Warna aksen, default dari `src/theme.ts` |

Field yang tidak dipakai oleh suatu template akan diabaikan. Galeri untuk mencoba template: `npm run dev`, buka folder **Templates**, pilih `tpl-<nama>`, lalu ubah `props` di panel kanan.

## Teks dan judul

| Template | Props | Fungsi |
| --- | --- | --- |
| `animated-text` | title, subtitle | Huruf jatuh berputar satu per satu |
| `bounce-text` | title, subtitle | Kartu gradien membesar, judul meluncur masuk |
| `bubble-pop-text` | title (pendek), subtitle | Tiap huruf jadi gelembung yang meletup berurutan |
| `floating-bubble-text` | title, subtitle | Kartu melayang dengan bingkai gradien berputar |
| `glitch-text` | title, subtitle | Judul dengan efek glitch cyan/magenta |
| `popping-text` | title (kata seru), subtitle | Huruf besar meletup dengan warna bergantian |
| `pulsing-text` | title (pendek), subtitle | Huruf berdenyut dengan glow aksen |
| `slide-text` | title, subtitle | Judul masuk dari kanan, subjudul dari kiri |
| `text-highlight` | title, subtitle | Stabilo menyapu `*kata*` (tanpa `*`: semua kata) |
| `title-split` | title (atas, outline), subtitle (bawah), text | Dua baris bertemu di tengah lalu menyala |
| `typewriter-subtitle` | text, title (label) | Teks diketik sampai ±60% scene dengan kursor |
| `cinematic-title-intro` | title, subtitle | Judul sinematik, garis bawah memanjang, zoom pelan |
| `chapter-title` | value (nomor bab), title, subtitle (label, default "Bagian") | Pembuka bab/bagian |
| `quote-card` | text (kutipan), subtitle (penulis) | Kartu kutipan |
| `lower-third` | title (nama), subtitle (jabatan) | Papan nama di bawah area aman |
| `credits-roll` | title, items (`"Peran: Nama"` atau teks) | Gulungan kredit sepanjang scene |
| `subscribe-reminder` | title (ajakan), subtitle (handle), text | Pil follow/subscribe dengan lonceng |
| `end-card` | title, subtitle (tombol), items (tautan/akun), text | Kartu penutup |
| `notification-pop` | title (aplikasi), text (pesan), subtitle (waktu), items (notifikasi tambahan) | Notifikasi muncul berurutan |
| `countdown-intro` | value (angka awal 1–10, default 3), title, subtitle | Hitung mundur lalu judul meletup |

## Data dan daftar

| Template | Props | Fungsi |
| --- | --- | --- |
| `stat-counter` | value, unit, title (label), subtitle | Angka besar menghitung naik |
| `countdown-timer` | value (detik), title, subtitle (kata penutup) | Hitung mundur dibagi rata sepanjang scene |
| `circular-progress` | value (0–100), unit, title, subtitle | Cincin progres |
| `area-chart` | title, subtitle, items (label X), values, unit | Grafik area |
| `line-chart` | title, subtitle, items (label X), values, unit | Garis tren |
| `chart-animation` | title, subtitle, items, values, unit | Diagram batang |
| `comparison-chart` | title, items[0..1], values[0..1], unit | Dua batang sebelum vs sesudah |
| `donut-chart` | title, subtitle (label tengah), items, values, value, unit | Donat bersegmen + legenda |
| `pie-chart` | title, items, values (dinormalisasi ke 100%) | Pie + legenda persen |
| `progress-bars` | title, items, values (persen), unit | Bar horizontal terisi bergiliran |
| `progress-steps` | title, items (langkah) | Timeline, langkah aktif maju sepanjang scene |
| `animated-list` | title, items | Daftar muncul sepanjang scene |
| `card-flip` | title (depan), text atau subtitle (belakang) | Kartu berbalik, mis. istilah → arti |
| `split-screen` | title, items[0..1], images[0..1] | Dua panel atas/bawah dengan badge VS |
| `sound-wave` | title, subtitle | Gelombang suara dekoratif |

## Logo dan brand

Semua `logo-*`: `title` = nama brand (default "Senimankode"), `subtitle` = tagline, `images[0]` = logo (opsional, menggantikan inisial).

| Template | Fungsi |
| --- | --- |
| `logo-blur-reveal` | Dari blur ke tajam |
| `logo-bounce-drop` | Jatuh dan memantul |
| `logo-fade-reveal` | Fade sambil membesar |
| `logo-glitch-reveal` | Glitch RGB lalu bersih |
| `logo-scale-rotate` | Membesar sambil berputar 360° |
| `logo-spin-reveal` | Berputar 3D menghadap layar |
| `logo-split-reveal` | Dua panel terbelah membuka logo |
| `logo-stroke-draw` | Garis heksagon tergambar lalu terisi |
| `logo-typewriter` | Nama brand diketik |

## Gambar

| Template | Props | Fungsi |
| --- | --- | --- |
| `ken-burns` | images[0], title | Foto layar penuh zoom dan bergeser pelan |
| `parallax-pan` | images[0], title, subtitle | Foto bergeser, judul bergerak paralaks |
| `zoom-pulse` | images[0], title, value (detik per denyut, default 2) | Foto berdenyut zoom |
| `image-zoom-reveal` | images[0], title, subtitle | Gambar dari blur ke tajam, lalu judul |
| `image-comparison-slider` | images[0] (sebelum), images[1] (sesudah), items[0..1] (label), title | Slider sebelum/sesudah |
| `picture-in-picture` | images[0] (utama), images[1] (jendela), title, subtitle | Panel utama + jendela kecil |
| `polaroid-frame` | images[0], title (atau items[0]) | Polaroid jatuh dan berayun |
| `gallery-grid` | images, items (caption), title | Grid muncul bergiliran |
| `masonry-gallery` | images, items, title | Galeri bata 2 kolom |
| `image-carousel` | images, items, title | Kartu bergeser satu per satu sepanjang scene |
| `rotating-carousel` | items (label kartu), images, title | Korsel 3D berputar |
| `photo-stack` | images, items, title | Foto jatuh bertumpuk |

## Efek layar

Tanpa `images`, efek diterapkan ke kartu `title`/`subtitle`. Dengan `images[0]`, efek diterapkan ke foto layar penuh.

| Template | Props | Fungsi |
| --- | --- | --- |
| `spotlight-reveal` | images[0], title, subtitle | Lingkaran sorot membuka konten |
| `letterbox-reveal` | images[0], title, subtitle | Bilah sinematik atas-bawah |
| `film-burn` | images[0], title, subtitle | Kebocoran cahaya film |
| `camera-shake` | images[0], title, subtitle, value (amplitudo px, default 24) | Guncangan kamera yang mereda |
| `vignette-pulse` | images[0], title, subtitle | Vinyet tepi berdenyut |

## Latar animasi

Efek layar penuh semi-transparan di belakang `title` + `subtitle`.

| Template | Fungsi |
| --- | --- |
| `bokeh-circles` | Bulatan bokeh melayang |
| `geometric-patterns` | Bingkai geometris berputar pelan |
| `gradient-shift` | Gradien yang bergeser |
| `grid-pulse` | Grid titik berdenyut dari tengah |
| `liquid-wave` | Gelombang di bawah layar |
| `matrix-rain` | Hujan karakter kode |
| `noise-grain` | Grain film dan flicker |
| `particle-explosion` | Ledakan partikel di awal scene |
| `starfield` | Bintang melesat (warp) |

## Transisi

Layar A (`items[0]`) tampil ±30% scene (maks. 2 detik), lalu transisi ±0,8 detik ke layar B (`title` + `subtitle`). Cocok untuk pergantian "masalah → solusi" atau "sebelum → sesudah".

| Template | Efek |
| --- | --- |
| `clock-wipe` | Sapuan jarum jam |
| `blinds-transition` | Bilah tirai |
| `cross-dissolve` | Crossfade |
| `fade-through-black` | Memudar lewat hitam |
| `iris-transition` | Lingkaran iris membuka |
| `morph-transition` | A mengecil membulat, B masuk |
| `pixel-transition` | Blok piksel |
| `push-transition` | B mendorong A ke atas |
| `slide-wipe` | Sapuan kiri ke kanan |
| `whip-pan` | Sentakan horizontal dengan blur |
| `zoom-through` | Kamera menembus A |
