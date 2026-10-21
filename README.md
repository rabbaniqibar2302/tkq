# Website TKQ Sanggar Al Quran

Website statis (HTML + CSS + JS), tanpa build. Buka `index.html` langsung, atau jalankan:

```bash
python3 -m http.server 8765   # lalu buka http://localhost:8765
```

## Mengganti foto

Simpan foto dengan nama di bawah ini. Kalau file belum ada, yang tampil kotak ilustrasi warna-warni.

| Bagian | File |
|---|---|
| Logo | `assets/img/logo.png` (sudah terpasang, dari foto profil IG) |
| Kelas | `assets/img/kelas/kelompok-a.jpg`, `kelompok-b.jpg` |
| Kepala Sekolah | `assets/img/kepsek.jpg` (persegi) |
| Kegiatan | `assets/img/kegiatan/mpls.jpg`, `estafet-hijaiyah.jpg`, `angka-arab.jpg`, `mewarnai.jpg`, `pawai-17an.jpg`, `idul-adha.jpg`, `edutrip.jpg`, `akhirussanah.jpg`, `open-house.jpg` |
| Legalitas | `assets/img/legalitas/sk-izin-operasional.jpg`, `sertifikat-akreditasi.jpg`, `akta-yayasan.jpg` (potret 3:4) |

Kompres foto dulu (lebar ±1200px) supaya web tetap ringan.

## Mengubah isi

- **Teks** (narasi, program, kegiatan, prestasi): langsung di `index.html`.
- **Prestasi**: kartu bertanda `data-contoh="true"` adalah contoh. Ganti isinya dengan prestasi asli, lalu hapus atributnya (pita "CONTOH" ikut hilang).
- **Nomor WhatsApp, tahun ajaran, tanggal acuan usia**: bagian atas `assets/js/main.js`.

## Pendaftaran online

Formulir dikirim lewat WhatsApp ke admin (nomor di `main.js`), jadi data tidak disimpan di server.
