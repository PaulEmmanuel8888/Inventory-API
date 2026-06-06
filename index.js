import express from "express";
const app = express();
const PORT = 3000;
import { getProducts, getProductById, createProduct } from "./db/index.js";

app.use(express.json());

//Get Routes
app.get("/products", async (req, res) => {
  const allProducts = await getProducts();
  console.log(allProducts);
  if (allProducts.length < 1) {
    return res.status(200).json({
      message: "No Products Yet...",
    });
  }
  res.status(200).json(allProducts);
});
app.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  const product = await getProductById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  return res.status(200).json({
    product,
  });
});

//Post Routes
app.post("/products", async (req, res) => {
  let { name, price, quantity, category } = req.body;

  if (!name || price === undefined || quantity === undefined || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (quantity === "" || quantity === null || quantity === undefined) {
    return res.status(400).json({ message: "Quantity is required" });
  }

  if (isNaN(quantity)) {
    return res.status(400).json({ message: "Quantity must be a number" });
  }

  quantity = Number(quantity);

  if (!Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  if (typeof name !== "string" || typeof category !== "string") {
    return res.status(400).json({ message: "Invalid text fields" });
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "Invalid price" });
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  const product = await createProduct(name, price, quantity, category);

  return res.status(201).json({
    message: "Product created successfully",
    product,
  });
});

//

app.listen(PORT, () => {
  console.log(`Server running successfully at http://localhost:${PORT}/`);
});
