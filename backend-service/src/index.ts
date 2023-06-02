import express from "express";
import cors from "cors";

import { complete } from "./anthropic";

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

/**
 * API proxy endpoint to handle requests to the Anthropic API
 */
app.post("/api/v1/complete", complete, (req, res, next) => {
  console.log("Request received");
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  } else {
    next();
  }
});

/**
 * Start the server on the specified port
 */
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
