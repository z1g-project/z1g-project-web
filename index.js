const express = require("express");
const app = express();

app.use(express.static(__dirname + "/static"), (_, res, next) => {
  res.status(404)
  res.sendFile(__dirname + "/404.html")
  res.status(403)
  res.sendFile(__dirname + "/403.html")
  res.status(401)
  res.sendFile(__dirname + "/401.html")
});

app.listen(8080);