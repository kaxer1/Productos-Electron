var Pool = require('pg-pool');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'FastFood',
    password: 'fulltime'
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.log("Error durante la conexión", err)
    } else {
      console.log("Conexion exitosa FastFood")
    }
});
module.exports = {
  pool
}