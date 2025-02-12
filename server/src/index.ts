import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import * as dynamoose from "dynamoose";

// ROUTE IMPORTS

// Configurations
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dynamoose.aws.ddb.local();
}
const app = express();

// Middleware
app.use(express.json());
app.use(helmet()); // Security headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Security headers
app.use(morgan("dev")); // HTTP request logger
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Server
const port = process.env.PORT || 3000;
if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
