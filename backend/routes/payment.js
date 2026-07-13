const express = require("express");
const router = express.Router();
const midtransClient = require("midtrans-client");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// ── POST /api/payment/create — buat transaksi Midtrans Snap (Admin Only) ──
router.post("/create", requireAuth, async (req, res) => {
  try {
    const { order_id, customer_name, email, phone, package_name, amount } = req.body;

    if (!order_id || !customer_name || !email || !amount) {
      return res.status(400).json({ success: false, message: "Data tidak lengkap." });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const isMockMode = !serverKey || serverKey.includes("GANTI_DENGAN_KEY") || serverKey === "";

    if (isMockMode) {
      const mockRedirectUrl = `http://localhost:3000/payment/simulate/${order_id}`;
      // Simpan link pembayaran simulasi ke database
      await db.query(
        "UPDATE orders SET payment_link = ? WHERE order_id = ?",
        [mockRedirectUrl, order_id]
      );
      return res.json({
        success: true,
        snap_token: "MOCK_SNAP_TOKEN",
        redirect_url: mockRedirectUrl,
        order_id,
        is_mock: true
      });
    }

    if (!order_id || !customer_name || !email || !amount) {
      return res.status(400).json({ success: false, message: "Data tidak lengkap." });
    }

    const parameter = {
      transaction_details: {
        order_id,
        gross_amount: parseInt(amount),
      },
      customer_details: {
        first_name: customer_name,
        email,
        phone: phone || "",
      },
      item_details: [
        {
          id: order_id,
          price: parseInt(amount),
          quantity: 1,
          name: package_name || "Layanan HelioNexus",
        },
      ],
      callbacks: {
        finish: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/success`,
        error: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/error`,
        pending: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/pending`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // Simpan link pembayaran ke database
    await db.query(
      "UPDATE orders SET payment_link = ? WHERE order_id = ?",
      [transaction.redirect_url, order_id]
    );

    res.json({
      success: true,
      snap_token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id,
    });
  } catch (err) {
    console.error("Midtrans error:", err);
    res.status(500).json({ success: false, message: "Gagal membuat transaksi pembayaran.", detail: err.message });
  }
});


// ── POST /api/payment/notification — webhook dari Midtrans ───────
router.post("/notification", async (req, res) => {
  try {
    const notification = req.body;

    // Verifikasi notifikasi dari Midtrans
    const statusResponse = await snap.transaction.notification(notification);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let newStatus = "pending";

    if (transactionStatus === "capture") {
      newStatus = fraudStatus === "accept" ? "paid" : "cancelled";
    } else if (transactionStatus === "settlement") {
      newStatus = "paid";
    } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
      newStatus = transactionStatus === "expire" ? "expired" : transactionStatus;
    } else if (transactionStatus === "pending") {
      newStatus = "pending";
    }

    await db.query(
      "UPDATE orders SET status = ?, payment_method = ?, midtrans_order_id = ?, paid_at = ? WHERE order_id = ?",
      [
        newStatus,
        statusResponse.payment_type || null,
        statusResponse.transaction_id || null,
        newStatus === "paid" ? new Date() : null,
        orderId,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ success: false });
  }
});

// ── GET /api/payment/client-key — ambil client key untuk frontend ─
router.get("/client-key", (req, res) => {
  res.json({
    success: true,
    client_key: process.env.MIDTRANS_CLIENT_KEY,
    is_production: process.env.MIDTRANS_IS_PRODUCTION === "true",
  });
});

// ── GET /api/payment/simulate-info/:order_id — ambil info untuk simulator ──
router.get("/simulate-info/:order_id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders WHERE order_id = ?", [req.params.order_id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Pemesanan tidak ditemukan." });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal memuat data simulasi." });
  }
});

// ── POST /api/payment/simulate — kirim hasil simulasi bayar ──
router.post("/simulate", async (req, res) => {
  try {
    const { order_id, status, payment_method } = req.body;
    if (!order_id || !status) {
      return res.status(400).json({ success: false, message: "Data tidak lengkap." });
    }

    const newStatus = status === "success" ? "paid" : "cancelled";
    const finalPaymentMethod = payment_method || (newStatus === "paid" ? "SIMULATOR_BANK" : null);

    await db.query(
      "UPDATE orders SET status = ?, payment_method = ?, paid_at = ? WHERE order_id = ?",
      [newStatus, finalPaymentMethod, newStatus === "paid" ? new Date() : null, order_id]
    );

    res.json({ success: true, message: `Status berhasil disimulasikan sebagai ${newStatus} (${finalPaymentMethod}).` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal memproses status simulasi." });
  }
});

// ── GET /api/payment/sync/:order_id — sinkronisasi status langsung dari Midtrans API ──
router.get("/sync/:order_id", async (req, res) => {
  try {
    const orderId = req.params.order_id;
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const isMockMode = !serverKey || serverKey.includes("GANTI_DENGAN_KEY") || serverKey === "";

    if (isMockMode) {
      const [rows] = await db.query("SELECT status FROM orders WHERE order_id = ?", [orderId]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Order tidak ditemukan." });
      }
      return res.json({ success: true, status: rows[0].status, message: "Sinkronisasi mock sukses." });
    }

    try {
      const statusResponse = await snap.transaction.status(orderId);
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      let newStatus = "pending";
      if (transactionStatus === "capture") {
        newStatus = fraudStatus === "accept" ? "paid" : "cancelled";
      } else if (transactionStatus === "settlement") {
        newStatus = "paid";
      } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
        newStatus = transactionStatus === "expire" ? "expired" : transactionStatus;
      } else if (transactionStatus === "pending") {
        newStatus = "pending";
      }

      await db.query(
        "UPDATE orders SET status = ?, payment_method = ?, midtrans_order_id = ?, paid_at = ? WHERE order_id = ?",
        [
          newStatus,
          statusResponse.payment_type || null,
          statusResponse.transaction_id || null,
          newStatus === "paid" ? new Date() : null,
          orderId,
        ]
      );

      res.json({ success: true, status: newStatus, message: "Sinkronisasi Midtrans sukses." });
    } catch (midtransErr) {
      const { transaction_status, status_code } = req.query;
      
      // If Midtrans API throws 404 (Transaction doesn't exist) BUT redirect query params indicate success/settlement:
      if (
        (midtransErr.message && midtransErr.message.includes("404")) &&
        (transaction_status === "settlement" || transaction_status === "capture" || status_code === "200" || status_code === "201")
      ) {
        console.log(`[Sync Fallback] Midtrans API 404 but client params show success. Updating order ${orderId} to paid.`);
        
        await db.query(
          "UPDATE orders SET status = 'paid', payment_method = 'midtrans_redirect_fallback', paid_at = ? WHERE order_id = ?",
          [new Date(), orderId]
        );
        
        return res.json({ success: true, status: "paid", message: "Sinkronisasi fallback berhasil." });
      }
      
      // If it's a 404 error from Midtrans, handle it gracefully and suggest manual fallback:
      if (midtransErr.message && midtransErr.message.includes("404")) {
        return res.status(200).json({
          success: false,
          status: "pending",
          message: "Transaksi tidak ditemukan di Midtrans Sandbox. Silakan ubah status menjadi Lunas secara manual menggunakan menu drop-down di tabel jika Anda sudah menyelesaikan pembayaran."
        });
      }
      
      throw midtransErr; // Rethrow if it's a genuine error or not successful
    }
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ success: false, message: "Gagal mensinkronisasikan status pembayaran.", detail: err.message });
  }
});

module.exports = router;
