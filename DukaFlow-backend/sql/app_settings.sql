-- Create a single-row settings table for the whole POS instance.
-- Run this once against your DB (same one configured in `.env`).

CREATE TABLE IF NOT EXISTS app_settings (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL,
  store_address VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  print_receipt_automatically BOOLEAN NOT NULL DEFAULT TRUE,
  sound_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  low_stock_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  dark_mode BOOLEAN NOT NULL DEFAULT FALSE,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 8.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ensure the singleton row exists (id=1).
INSERT IGNORE INTO app_settings (
  id,
  store_name,
  store_address,
  phone_number,
  print_receipt_automatically,
  sound_notifications,
  low_stock_alerts,
  dark_mode,
  tax_rate,
  currency
) VALUES (
  1,
  'QuickPOS Coffee Shop',
  '123 Main Street, City',
  '(555) 123-4567',
  TRUE,
  TRUE,
  TRUE,
  FALSE,
  8.00,
  'USD'
);
