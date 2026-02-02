const { initDatabase } = require('../db/database');

console.log('Initializing database...');
initDatabase();
console.log('Database initialized successfully.');
