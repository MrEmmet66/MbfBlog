const sqlite3 = require('../core//node_modules/sqlite3').verbose();
const db = new sqlite3.Database("users.db");

module.exports = db;