import express from "express";
const app = express();
const PORT = 3000;
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./db/index.js";

app.use(express.json());

//Get Routes
app.get("/products", async (req, res) => {
  const { category } = req.query;

  const allowedCategories = [
    "electronics",
    "food",
    "clothing",
    "furniture",
    "books",
  ];

  if (category) {
    if (typeof category !== "string") {
      return res.status(400).json({
        message: "Invalid category format",
      });
    }

    if (!allowedCategories.includes(category.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid category value",
      });
    }

    const products = await getProducts(category);

    return res.status(200).json({
      count: products.length,
      products,
    });
  }

  const allProducts = await getProducts();

  if (allProducts.length < 1) {
    return res.status(200).json({
      message: "No Products Yet...",
    });
  }

  return res.status(200).json(allProducts);
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

//Put Route
app.put("/products/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  const existingProduct = await getProductById(id);

  if (!existingProduct) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const { name, price, quantity, category } = req.body;

  if (
    name === undefined &&
    price === undefined &&
    quantity === undefined &&
    category === undefined
  ) {
    return res.status(400).json({
      message: "At least one field must be provided",
    });
  }

  if (name !== undefined && typeof name !== "string") {
    return res.status(400).json({ message: "Invalid name" });
  }

  if (price !== undefined) {
    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }
  }

  if (quantity !== undefined) {
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }
  }

  if (category !== undefined && typeof category !== "string") {
    return res.status(400).json({ message: "Invalid category" });
  }

  const updatedProduct = await updateProduct(id, {
    name,
    price,
    quantity,
    category,
  });

  return res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

//Delete Route
app.delete("/products/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }

  const existingProduct = await getProductById(id);

  if (!existingProduct) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const deletedProduct = await deleteProduct(id);

  if (!deletedProduct) {
    return res.status(404).json({
      message: "Product already deleted or not found",
    });
  }

  return res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct,
  });
});

app.listen(PORT, () => {
  console.log(`Server running successfully at http://localhost:${PORT}/`);
});
