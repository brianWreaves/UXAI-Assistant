import express from "express";
import cors from "cors";

import { complete } from "./anthropic";
import https from "https";
import http from "http";
import fs from "fs";
import { join } from "path";

const httpOptions = {
  key: fs.readFileSync(join(process.env.HOME as string, 'certs', 'key.pem')),
  cert: fs.readFileSync(join(process.env.HOME as string, 'certs', 'cert.pem'))
}

const app = express();

app.use(express.json());
app.use(cors());


const HTTP_PORT = process.env.HTTP_PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 5001;

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
 * Start https and http servers
 */

https.createServer(httpOptions, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS Server running on port ${HTTPS_PORT}}`);
});

http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`HTTP Server running on port ${HTTP_PORT}`);
});
