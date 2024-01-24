require("dotenv").config();

const express = require("express");
const farmerRouter = require("./routes/farmer.route");
const errorHandler = require("./middleware/error_handler");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.get("/", (req, res) => {
  res.send("They are about to test us, but..... Okay, let's see our solution for crop2cash assessment. Stop playing!!!");
});

app.use("/api/v1/farmer", farmerRouter);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
})