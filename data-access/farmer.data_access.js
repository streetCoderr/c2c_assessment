
const Pool = require('pg').Pool;
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
});



const insert = async ({ first_name, last_name, phone_number, age, address, crops }) => {
  try {
    const res = await pool.query('INSERT INTO farmer (first_name, last_name, phone_number, age, address, crops) \
    VALUES ($1, $2, $3, $4, $5, $6)', [first_name, last_name, phone_number, age, address, crops]);
    return res
  } catch (err) {
    throw err;
  }
}

const get = async ({ fields, filters, parameters}) => {
  try {
    let query = `SELECT ${fields} FROM farmer ${filters}`;
    const res = await pool.query(query, parameters);
    return res.rows
  } catch (err) {
    throw err
  }
}

export {
  insert,
  get
}