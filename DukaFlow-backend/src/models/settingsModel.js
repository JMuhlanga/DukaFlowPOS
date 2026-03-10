const db = require('../config/db');

const DEFAULT_SETTINGS = Object.freeze({
  id: 1,
  store_name: 'QuickPOS Coffee Shop',
  store_address: '123 Main Street, City',
  phone_number: '(555) 123-4567',
  print_receipt_automatically: 1,
  sound_notifications: 1,
  low_stock_alerts: 1,
  dark_mode: 0,
  tax_rate: '8.00',
  currency: 'USD',
});

exports.getSettings = async () => {
  try {
    const query = 'SELECT * FROM app_settings WHERE id = 1 LIMIT 1';
    const [rows] = await db.execute(query);
    return rows?.[0] ?? DEFAULT_SETTINGS;
  } catch (error) {
    throw new Error('Failed to get settings');
  }
};

exports.upsertSettings = async (payload) => {
  try {
    const merged = { ...DEFAULT_SETTINGS, ...payload, id: 1 };
    const query = `
      INSERT INTO app_settings (
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        store_name = VALUES(store_name),
        store_address = VALUES(store_address),
        phone_number = VALUES(phone_number),
        print_receipt_automatically = VALUES(print_receipt_automatically),
        sound_notifications = VALUES(sound_notifications),
        low_stock_alerts = VALUES(low_stock_alerts),
        dark_mode = VALUES(dark_mode),
        tax_rate = VALUES(tax_rate),
        currency = VALUES(currency)
    `;

    await db.execute(query, [
      1,
      merged.store_name,
      merged.store_address,
      merged.phone_number,
      merged.print_receipt_automatically ? 1 : 0,
      merged.sound_notifications ? 1 : 0,
      merged.low_stock_alerts ? 1 : 0,
      merged.dark_mode ? 1 : 0,
      merged.tax_rate,
      merged.currency,
    ]);

    const fresh = await exports.getSettings();
    return fresh;
  } catch (error) {
    throw new Error('Failed to update settings');
  }
};

exports.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
