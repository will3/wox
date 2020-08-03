const express = require("express");
const path = require("path");
const app = express();

app.use(express.static("./dist"));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

const port = process.env.PORT || 8080;
console.log(`:${port}`);
app.listen(port);
