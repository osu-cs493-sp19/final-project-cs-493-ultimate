const { createPool } = require('mysql');

const mysqlPool = createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST || "192.168.99.100",
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE || "tarpaulin",
  user: process.env.MYSQL_USER || "tarpaulin-user",
  password: process.env.MYSQL_PASSWORD || "hunter2"
});

module.exports = mysqlPool;
