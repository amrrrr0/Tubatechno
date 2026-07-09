const { query } = require('./db/database');

async function migrate() {
  await query("UPDATE pricing_packages SET billing_type = 'monthly' WHERE billing_type = 'subscription'");
  
  // check if annual data already exists
  const existing = await query("SELECT id FROM pricing_packages WHERE billing_type = 'annual'");
  if (existing[0].length === 0) {
    const data = [
        [
          "Starter", "Rp2.990.000", "/tahun", "annual",
          JSON.stringify(["25 User", "1 Admin", "Cloud Hosting", "Backup Harian", "SSL", "Update Sistem", "Support"]),
          0
        ],
        [
          "Business", "Rp7.990.000", "/tahun", "annual",
          JSON.stringify(["150 User", "Multi Admin", "Domain Gratis", "Cloud Hosting", "Backup", "API", "Prioritas Support"]),
          1
        ],
        [
          "Enterprise", "Custom", "", "annual",
          JSON.stringify(["Unlimited User", "Unlimited Cabang", "Dedicated Server", "Custom Fitur", "Integrasi API", "Training", "SLA"]),
          0
        ]
    ];
    await query("INSERT INTO pricing_packages (name, price, period, billing_type, features, is_popular) VALUES ?", [data]);
    console.log("Migration inserted annual data.");
  } else {
    console.log("Annual data already exists.");
  }
  process.exit(0);
}
migrate();
