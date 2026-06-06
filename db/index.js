import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
pool
  .connect()
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch((err) => console.error("Connection error:", err));

async function getProducts() {
  const result = await pool.query("SELECT * FROM products");
  return result.rows;
}
async function getProductById(id) {
  const result = await pool.query("SELECT * FROM products where id=$1", [id]);
  return result.rows[0];
}
async function createProduct(name, price, quantity, category) {
  const result = await pool.query(
    "INSERT INTO products (name, price, quantity, category) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, price, quantity, category],
  );

  return result.rows[0];
}
async function updateProduct(id, fields) {
  const { name, price, quantity, category } = fields;

  const result = await pool.query(
    `UPDATE products 
     SET 
       name = COALESCE($1, name),
       price = COALESCE($2, price),
       quantity = COALESCE($3, quantity),
       category = COALESCE($4, category)
     WHERE id = $5
     RETURNING *`,
    [name, price, quantity, category, id],
  );

  return result.rows[0];
}
async function deleteProduct(id) {
  const result = await pool.query(
    "DELETE FROM products WHERE id = $1 RETURNING *",
    [id],
  );

  return result.rows[0];
}
export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
