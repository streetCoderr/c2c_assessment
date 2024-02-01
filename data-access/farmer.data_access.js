import pg from 'pg';
import { ServerError } from '../utilities/error.js';
const { Pool } = pg;

let pool;
if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DB_PROD_CONN_STRING
  })
} else {
  pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
  });
}

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
    console.log(res.rows)
    return res.rows
  } catch (err) {
    throw err
  }
}

const setUp = async () => {
  try {
    await pool.query("CREATE TABLE IF NOT EXISTS farmer ( \
      id SERIAL PRIMARY KEY, \
      first_name VARCHAR(50), \
      last_name VARCHAR(50), \
      phone_number VARCHAR(11), \
      age INTEGER, \
      address VARCHAR(150), \
      crops text[] \
    )");
  } catch (error) {
    throw error;
  }
}

export default {
  setUp,
  insert,
  get
}