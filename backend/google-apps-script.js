/**
 * ============================================================
 *  GOOGLE APPS SCRIPT — Sinkronisasi Google Form → HelioNexus
 * ============================================================
 *
 * CARA PASANG:
 * 1. Buka Google Form Anda → klik "Responses" tab
 * 2. Klik ikon Google Sheets (buat/buka spreadsheet)
 * 3. Di spreadsheet, klik menu Extensions → Apps Script
 * 4. Hapus semua kode yang ada, paste seluruh script ini
 * 5. Klik ikon Save (💾)
 * 6. Klik menu Run → onFormSubmit (untuk test pertama kali)
 *    → Izinkan akses saat diminta
 * 7. Tambahkan Trigger otomatis:
 *    - Klik ikon jam (Triggers) di sidebar kiri
 *    - + Add Trigger
 *    - Function: onFormSubmit
 *    - Event source: From spreadsheet
 *    - Event type: On form submit
 *    - Save
 *
 * ============================================================
 *  SESUAIKAN KOLOM DENGAN GOOGLE FORM ANDA:
 * ============================================================
 * Cek nama kolom di baris pertama spreadsheet Anda.
 * Ubah nilai di bagian CONFIG sesuai dengan nama kolom form.
 */

// ── CONFIG ──────────────────────────────────────────────────────
const CONFIG = {
  // URL backend Anda (jika pakai ngrok/hosting, ganti di sini)
  // Contoh ngrok: "https://abc123.ngrok.io/api/testimonials/gform-webhook"
  WEBHOOK_URL: "http://localhost:5000/api/testimonials/gform-webhook",

  // Secret key — harus sama dengan GFORM_WEBHOOK_SECRET di backend .env
  SECRET: "helionexus-gform-secret-2024",

  // ── PEMETAAN KOLOM GOOGLE FORM ──
  // Isi dengan nama kolom PERSIS seperti di spreadsheet (baris pertama/header)
  // Buka spreadsheet → lihat baris 1 → salin nama kolom ke sini
  COLUMNS: {
    nama:      "Nama Lengkap",    // ← Ganti dengan nama kolom "Nama" di form Anda
    jabatan:   "Jabatan / Peran", // ← Ganti dengan nama kolom "Jabatan" di form Anda
    testimoni: "Testimoni",       // ← Ganti dengan nama kolom "Testimoni" di form Anda
    rating:    "Rating",          // ← Ganti dengan nama kolom "Rating" di form Anda
                                  //    (kosongkan jika tidak ada kolom rating: "")
  },

  // Nilai default rating jika kolom rating tidak ada atau kosong
  DEFAULT_RATING: 5,

  // Konversi rating dari teks ke angka (jika form pakai pilihan teks)
  // Contoh: "Sangat Bagus" → 5, "Bagus" → 4, dst.
  RATING_MAP: {
    "1": 1, "2": 2, "3": 3, "4": 4, "5": 5,
    "Sangat Buruk": 1,
    "Buruk": 2,
    "Cukup": 3,
    "Bagus": 4,
    "Sangat Bagus": 5,
    "★": 1, "★★": 2, "★★★": 3, "★★★★": 4, "★★★★★": 5,
  }
};

// ── FUNGSI UTAMA ─────────────────────────────────────────────────
function onFormSubmit(e) {
  try {
    // Ambil data dari respons form
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var lastRow = sheet.getLastRow();
    var rowData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Buat objek dari baris terakhir
    var formData = {};
    headers.forEach(function(header, index) {
      formData[header] = rowData[index] || "";
    });

    Logger.log("Data form baru: " + JSON.stringify(formData));

    // Ekstrak nilai berdasarkan pemetaan kolom
    var nama      = String(formData[CONFIG.COLUMNS.nama] || "").trim();
    var jabatan   = String(formData[CONFIG.COLUMNS.jabatan] || "").trim();
    var testimoni = String(formData[CONFIG.COLUMNS.testimoni] || "").trim();
    var ratingRaw = CONFIG.COLUMNS.rating ? String(formData[CONFIG.COLUMNS.rating] || "").trim() : "";

    // Konversi rating
    var rating = CONFIG.DEFAULT_RATING;
    if (ratingRaw) {
      if (CONFIG.RATING_MAP[ratingRaw] !== undefined) {
        rating = CONFIG.RATING_MAP[ratingRaw];
      } else {
        var parsed = parseInt(ratingRaw);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
          rating = parsed;
        }
      }
    }

    // Validasi minimal
    if (!nama || !jabatan || !testimoni) {
      Logger.log("⚠️ Data tidak lengkap, skip: nama=" + nama + ", jabatan=" + jabatan);
      return;
    }

    // Kirim ke backend
    var payload = JSON.stringify({
      secret:  CONFIG.SECRET,
      name:    nama,
      title:   jabatan,
      content: testimoni,
      rating:  rating
    });

    var options = {
      method:      "post",
      contentType: "application/json",
      payload:     payload,
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();

    Logger.log("Response code: " + responseCode);
    Logger.log("Response body: " + responseText);

    if (responseCode === 200 || responseCode === 201) {
      Logger.log("✅ Testimoni berhasil dikirim ke HelioNexus: " + nama);
    } else {
      Logger.log("❌ Gagal kirim testimoni. Code: " + responseCode + ", Body: " + responseText);
    }

  } catch (err) {
    Logger.log("❌ Error di onFormSubmit: " + err.toString());
  }
}

/**
 * Fungsi test manual — jalankan ini pertama kali untuk cek koneksi
 * Run → testWebhook
 */
function testWebhook() {
  var testPayload = JSON.stringify({
    secret:  CONFIG.SECRET,
    name:    "Test User",
    title:   "Penguji Sistem",
    content: "Ini adalah testimoni percobaan dari Google Apps Script. Sistem berjalan dengan baik!",
    rating:  5
  });

  var options = {
    method:      "post",
    contentType: "application/json",
    payload:     testPayload,
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
    Logger.log("Test response code: " + response.getResponseCode());
    Logger.log("Test response body: " + response.getContentText());
    SpreadsheetApp.getUi().alert("✅ Test berhasil!\n\nCek website HelioNexus untuk melihat testimoni test.");
  } catch (err) {
    SpreadsheetApp.getUi().alert("❌ Gagal koneksi ke backend:\n" + err.toString() + "\n\nPastikan backend berjalan dan URL sudah benar.");
  }
}
