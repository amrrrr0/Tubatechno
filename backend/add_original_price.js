const pool = require('./db/database');

async function addOriginalPrice() {
  try {
    console.log("Adding original_price column to pricing_packages...");
    
    // Check if column exists first
    const [columns] = await pool.query(`SHOW COLUMNS FROM pricing_packages LIKE 'original_price'`);
    if (columns.length === 0) {
      await pool.query(`ALTER TABLE pricing_packages ADD COLUMN original_price VARCHAR(100) DEFAULT '' AFTER price;`);
      console.log("Column 'original_price' added successfully.");
    } else {
      console.log("Column 'original_price' already exists.");
    }
  } catch (error) {
    console.error("Error updating schema:", error);
  } finally {
    process.exit();
  }
}

addOriginalPrice();
