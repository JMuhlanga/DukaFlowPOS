const db = require('../config/db');

exports.getDashboardStats = async () => {
  // Assumes `sales.created_at` exists (typical MySQL TIMESTAMP/DATETIME DEFAULT CURRENT_TIMESTAMP).
  // If your column is named differently, update these queries accordingly.
  const [[salesToday]] = await db.execute(
    `
    SELECT
      COALESCE(SUM(total_amount), 0) AS today_income,
      COUNT(*) AS today_transactions
    FROM sales
    WHERE DATE(created_at) = CURDATE()
    `
  );

  const [[itemsToday]] = await db.execute(
    `
    SELECT
      COALESCE(SUM(si.quantity), 0) AS today_items_sold
    FROM sale_items si
    JOIN sales s ON s.id = si.sale_id
    WHERE DATE(s.created_at) = CURDATE()
    `
  );

  const [[lowStock]] = await db.execute(
    `
    SELECT
      COUNT(*) AS low_stock_items
    FROM products
    WHERE stock_quantity <= min_stock_level
    `
  );

  return {
    today_income: Number(salesToday?.today_income ?? 0),
    today_transactions: Number(salesToday?.today_transactions ?? 0),
    today_items_sold: Number(itemsToday?.today_items_sold ?? 0),
    low_stock_items: Number(lowStock?.low_stock_items ?? 0),
  };
};

