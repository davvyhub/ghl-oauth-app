exports.success = (msg) => console.log(`✅ ${msg}`);
exports.warn = (msg) => console.warn(`⚠️ ${msg}`);
exports.error = (msg, err) => console.error(`❌ ${msg}`, err);
