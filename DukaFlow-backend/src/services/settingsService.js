const settingsModel = require('../models/settingsModel');

const normalizeBool = (v) => (v === true || v === 1 || v === '1' || v === 'true');

exports.getSettings = async () => {
  try {
    return await settingsModel.getSettings();
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateSettings = async (payload) => {
  try {
    const p = payload && typeof payload === 'object' ? payload : {};

    const store_name =
      typeof p.store_name === 'string' ? p.store_name.trim() : undefined;
    const store_address =
      typeof p.store_address === 'string' ? p.store_address.trim() : undefined;
    const phone_number =
      typeof p.phone_number === 'string' ? p.phone_number.trim() : undefined;

    const currency =
      typeof p.currency === 'string' ? p.currency.trim() : undefined;

    const tax_rate =
      p.tax_rate === '' || p.tax_rate == null ? undefined : Number(p.tax_rate);
    if (tax_rate !== undefined && (Number.isNaN(tax_rate) || tax_rate < 0 || tax_rate > 100)) {
      throw new Error('tax_rate must be a number between 0 and 100');
    }

    const update = {
      ...(store_name !== undefined ? { store_name } : {}),
      ...(store_address !== undefined ? { store_address } : {}),
      ...(phone_number !== undefined ? { phone_number } : {}),
      ...(currency !== undefined ? { currency } : {}),
      ...(p.print_receipt_automatically !== undefined
        ? { print_receipt_automatically: normalizeBool(p.print_receipt_automatically) }
        : {}),
      ...(p.sound_notifications !== undefined
        ? { sound_notifications: normalizeBool(p.sound_notifications) }
        : {}),
      ...(p.low_stock_alerts !== undefined
        ? { low_stock_alerts: normalizeBool(p.low_stock_alerts) }
        : {}),
      ...(p.dark_mode !== undefined ? { dark_mode: normalizeBool(p.dark_mode) } : {}),
      ...(tax_rate !== undefined ? { tax_rate: tax_rate.toFixed(2) } : {}),
    };

    return await settingsModel.upsertSettings(update);
  } catch (error) {
    throw new Error(error.message);
  }
};

