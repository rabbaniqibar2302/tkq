/* =========================================================
   TKQ Sanggar Al Quran — main.js
   ========================================================= */

// ---- Pengaturan (ubah di sini) ----
const WA_NUMBER = '6287887235492';        // nomor admin pendaftaran, format 62xxx
const TAHUN_AJARAN = '2027/2028';
const TANGGAL_ACUAN_USIA = '2027-07-01';  // usia anak dihitung per tanggal ini

document.querySelectorAll('[data-tahun-ajaran]').forEach((el) => { el.textContent = TAHUN_AJARAN; });
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Header: shadow saat scroll + menu mobile ----
const header = document.querySelector('.header');
const nav = document.getElementById('nav');
const navToggle = document.querySelector('.nav-toggle');

const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const setNav = (open) => {
  nav.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
};
navToggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

// ---- Tandai menu sesuai section yang sedang dilihat ----
const navLinks = [...nav.querySelectorAll('a:not(.btn)')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => spy.observe(s));

// ---- Animasi muncul saat discroll ----
const reveal = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    reveal.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  reveal.observe(el);
});

// ---- Filter kegiatan ----
const filters = document.querySelectorAll('.filter');
const activities = document.querySelectorAll('.activity');
filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    filters.forEach((b) => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
    activities.forEach((card) => {
      card.classList.toggle('is-hidden', cat !== 'semua' && card.dataset.cat !== cat);
    });
  });
});

// ---- Lightbox kegiatan ----
const lightbox = document.getElementById('lightbox');
const lbMedia = lightbox.querySelector('.lightbox__media');
activities.forEach((card) => {
  card.addEventListener('click', () => {
    lbMedia.innerHTML = '';
    lbMedia.appendChild(card.querySelector('.photo').cloneNode(true));
    lbMedia.querySelector('img')?.removeAttribute('loading');
    lightbox.querySelector('.activity__tag').textContent = card.querySelector('.activity__tag').textContent;
    lightbox.querySelector('h3').textContent = card.querySelector('.activity__title').textContent;
    lightbox.querySelector('p').textContent = card.querySelector('.activity__text').textContent;
    lightbox.showModal();
  });
});
lightbox.querySelector('.lightbox__close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });

// ---- Formulir pendaftaran → WhatsApp ----
const form = document.getElementById('form-daftar');
const errorBox = document.getElementById('form-error');
const successBox = document.getElementById('form-success');
const ageHint = document.getElementById('age-hint');
const tglInput = document.getElementById('f-tgl');
tglInput.max = new Date().toISOString().slice(0, 10);

const formatTanggal = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const hitungUsia = (lahirIso) => {
  const lahir = new Date(`${lahirIso}T00:00:00`);
  const acuan = new Date(`${TANGGAL_ACUAN_USIA}T00:00:00`);
  let bulan = (acuan.getFullYear() - lahir.getFullYear()) * 12 + (acuan.getMonth() - lahir.getMonth());
  if (acuan.getDate() < lahir.getDate()) bulan -= 1;
  return { tahun: Math.floor(bulan / 12), bulan: bulan % 12, total: bulan };
};

tglInput.addEventListener('change', () => {
  if (!tglInput.value) { ageHint.hidden = true; return; }
  const usia = hitungUsia(tglInput.value);
  const acuan = formatTanggal(TANGGAL_ACUAN_USIA);
  let saran;
  if (usia.total < 48) saran = 'belum mencapai 4 tahun. Silakan konsultasikan dengan admin, ya.';
  else if (usia.total < 60) saran = '→ disarankan <strong>Kelompok A</strong>.';
  else if (usia.total < 84) saran = '→ disarankan <strong>Kelompok B</strong>.';
  else saran = 'sudah 7 tahun ke atas. Silakan konsultasikan dengan admin, ya.';
  ageHint.innerHTML = `🎂 Usia ananda per ${acuan}: <strong>${usia.tahun} tahun ${usia.bulan} bulan</strong> ${saran}`;
  ageHint.hidden = false;

  const kelompok = usia.total < 60 ? 'Kelompok A' : usia.total < 84 ? 'Kelompok B' : null;
  const pilihan = form.querySelector('input[name="kelompok"]:checked');
  if (kelompok && !pilihan) form.querySelector(`input[name="kelompok"][value="${kelompok}"]`).checked = true;
});

form.addEventListener('input', (e) => {
  e.target.classList.remove('is-invalid');
  e.target.closest('.choices')?.classList.remove('is-invalid');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  successBox.hidden = true;

  const invalid = [];
  form.querySelectorAll('input[type="text"][required], input[type="tel"], input[type="date"], textarea[required]').forEach((el) => {
    const ok = el.value.trim() !== '' && el.checkValidity();
    el.classList.toggle('is-invalid', !ok);
    if (!ok) invalid.push(el);
  });
  ['jk', 'kelompok'].forEach((name) => {
    const group = form.querySelector(`input[name="${name}"]`).closest('.choices');
    const ok = !!form.querySelector(`input[name="${name}"]:checked`);
    group.classList.toggle('is-invalid', !ok);
    if (!ok) invalid.push(group.querySelector('input'));
  });

  if (invalid.length) {
    const waInvalid = document.getElementById('f-wa').classList.contains('is-invalid') && document.getElementById('f-wa').value.trim();
    errorBox.textContent = waInvalid
      ? 'Nomor WhatsApp sepertinya belum benar. Contoh: 081234567890.'
      : 'Mohon lengkapi kolom yang bertanda * ya, Ayah/Bunda. 🙏';
    errorBox.hidden = false;
    invalid[0].focus();
    return;
  }

  const d = Object.fromEntries(new FormData(form));
  const baris = [
    "Assalamu'alaikum, saya ingin mendaftarkan ananda di *TKQ Sanggar Al Quran*.",
    `Tahun Ajaran: ${TAHUN_AJARAN}`,
    '',
    '*Data Calon Murid*',
    `Nama lengkap: ${d.nama.trim()}`,
    d.panggilan.trim() ? `Nama panggilan: ${d.panggilan.trim()}` : null,
    `Jenis kelamin: ${d.jk}`,
    `Tempat, tgl lahir: ${d.tempat.trim()}, ${formatTanggal(d.tgl)}`,
    `Pilihan kelompok: ${d.kelompok}`,
    '',
    '*Data Orang Tua/Wali*',
    `Nama: ${d.ortu.trim()}`,
    `No. WhatsApp: ${d.wa.trim()}`,
    `Alamat: ${d.alamat.trim()}`,
    d.catatan.trim() ? `\nCatatan: ${d.catatan.trim()}` : null,
  ].filter((x) => x !== null);

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(baris.join('\n'))}`;
  document.getElementById('wa-fallback').href = url;
  successBox.hidden = false;
  window.open(url, '_blank', 'noopener');
});
