const mysql = require('mysql2/promise');
require('dotenv').config();

const dbUrl = new URL(process.env.JAWSDB_URL);

const config = {
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substr(1),
  port: dbUrl.port
};

async function checkDatabaseLimits() {
  try {
    const connection = await mysql.createConnection(config);
    
    console.log('\n=== Database Size ===');
    const [dbSize] = await connection.query(`
      SELECT 
        table_schema AS 'Database',
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
      FROM information_schema.tables
      WHERE table_schema = ?
      GROUP BY table_schema;
    `, [config.database]);
    console.table(dbSize);

    console.log('\n=== Table Sizes and Rows ===');
    const [tableSizes] = await connection.query(`
      SELECT 
        table_name AS 'Table',
        table_rows AS 'Rows',
        ROUND(data_length / 1024 / 1024, 2) AS 'Data Size (MB)',
        ROUND(index_length / 1024 / 1024, 2) AS 'Index Size (MB)',
        ROUND((data_length + index_length) / 1024 / 1024, 2) AS 'Total Size (MB)'
      FROM information_schema.tables
      WHERE table_schema = ?
      ORDER BY (data_length + index_length) DESC;
    `, [config.database]);
    console.table(tableSizes);

    console.log('\n=== Connection Limits ===');
    const [maxConnections] = await connection.query('SHOW VARIABLES LIKE "max_connections"');
    const [currentConnections] = await connection.query('SHOW STATUS LIKE "Threads_connected"');
    console.log('Max Connections:', maxConnections[0].Value);
    console.log('Current Connections:', currentConnections[0].Value);

    await connection.end();
  } catch (error) {
    console.error('Error checking database limits:', error);
  }
}

checkDatabaseLimits();