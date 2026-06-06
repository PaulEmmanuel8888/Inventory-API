import express from "express";
const app = express();
const PORT = 3000;
import { getProducts, getProductById } from "./db/index.js";

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
  const id = req.params.id;
  const product = await getProductById(id);
  if (product.length < 1) {
    return res.status(404).json({
      message: "Product Not Found",
    });
  }
  return res.status(200).json(product);
});

app.listen(PORT, () => {
  console.log(`Server running successfully at http://localhost:${PORT}/`);
});
