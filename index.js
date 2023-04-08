const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// App de Express
const app = express();


const server = require("http").createServer(app);
module.exports.io = require("socket.io")(server);
require("./sockets/socket");

const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.use(cors());
server.listen(process.env.PORT, (err) => {
  if (err) throw new Error(err);

  console.log("Servidor corriendo en puerto", process.env.PORT);
});
