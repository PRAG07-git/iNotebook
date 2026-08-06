//for run = npm i -D nodemon
//nodemon .\index.js

const connectToMongo = require("./db");
const express = require("express");
const app = express();
var cors = require("cors");

connectToMongo(); // Don't forget to call it
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(5000, () => {
  console.log("iNoteBook backend started at http://localhost:3000");
});
