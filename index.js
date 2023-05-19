const express = require("express");
const app = express();

app.use(express.static(__dirname + "/static"), (_, res, next) => {
  res.status(404)
  res.sendFile(__dirname + "/404.html")
  res.status(403)
  res.sendFile(__dirname + "/403.html")
  res.status(401)
  res.sendFile(__dirname + "/401.html")
  res.status(406)
  res.sendFile(__dirname + "/406.html")
  res.status(500)
  res.sendFile(__dirname + "/500.html")
  res.status(503)
  res.sendFile(__dirname + "/503.html")
  res.status(504)
  res.sendFile(__dirname + "/504.html")
  res.status(400)
  res.sendFile(__dirname + "/400.html")
  res.status(505)
  res.sendFile(__dirname + "/505.html")
  res.status(301)
  res.sendFile(__dirname + "/301.html")
  res.status(408)
  res.sendFile(__dirname + "/408.html")
});

app.listen(8080);