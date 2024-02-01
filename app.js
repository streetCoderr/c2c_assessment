import dotenv from "dotenv";

import express from "express";
import farmerRouter from "./routes/farmer.route.js";
import errorHandler from "./middleware/error_handler.js";
import farmerDB from "./data-access/farmer.data_access.js";
dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.get("/", (req, res) => {
  res.send("They are about to test us, but..... Okay, let's see our solution for crop2cash assessment. Stop playing!!!");
});

app.use("/api/v1/farmer", farmerRouter);
app.use(errorHandler);
app.listen(PORT, async () => {
  try {
    await farmerDB.setUp();
    console.log(`server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.log(error)
  }
})
