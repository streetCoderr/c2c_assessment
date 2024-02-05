import dotenv from "dotenv";
import yaml from "yamljs";
import swaggerUI from "swagger-ui-express";
import express from "express";
import farmerRouter from "./routes/farmer.route.js";
import errorHandler from "./middleware/error_handler.js";
import notFoundHandler from "./middleware/not_found.js";
import farmerDB from "./data-access/farmer.data_access.js";
dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;
const docs = yaml.load("./docs.yaml");


app.use(express.json())
app.get("/", (req, res) => {
  const baseURL = process.env.NODE_ENV === "production" ? 
  "https://crop2cash-assessment.onrender.com" : "http://localhost:3000"
  res.send(`<center><h1>C2C ASSESSMENT's API<h1><p>Kindly head over to our <a href=${baseURL}/api-docs>documentation</a> to access the endpoints</p></center>`);
});

app.use("/api/v1/farmer", farmerRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs))
app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, async () => {
  try {
    await farmerDB.setUp();
    console.log(`server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.log(error)
  }
})