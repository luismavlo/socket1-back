const express = require("express");
const http = require("http");
const { Server: SocketServer } = require("socket.io");
const path = require("path");
const cors = require("cors");

const Sockets = require("./sockets");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.server = http.createServer(this.app);

    this.io = new SocketServer(this.server, {
      cors: {
        origin: "*",
      },
    });
  }

  middlewares() {
    this.app.use(express.static(path.resolve(__dirname, "../public")));

    this.app.use(cors());
  }

  configureSockets() {
    new Sockets(this.io);
  }

  execute() {
    this.middlewares();

    this.configureSockets();

    this.server.listen(this.port, () => {
      console.log("Server running on port :D: ", this.port);
    });
  }
}

module.exports = Server;
