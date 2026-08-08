const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./somaliarena.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        username TEXT,
        wallet INTEGER DEFAULT 1000,
        bank INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        hp INTEGER DEFAULT 100,
        energy INTEGER DEFAULT 100,
        shield_expiry DATETIME DEFAULT NULL,
        bank_account INTEGER DEFAULT 0,
        last_work INTEGER DEFAULT 0,
        diamonds INTEGER DEFAULT 10
    )`);
});

module.exports = db;
