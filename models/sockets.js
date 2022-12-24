const BandList = require("./band-list");

class Sockets {
  constructor(io) {
    this.io = io;

    this.bandList = new BandList();

    this.socketsEvents();
  }

  socketsEvents() {
    this.io.on("connection", (socket) => {
      console.log("cliente conectado");

      socket.emit("current-bands", this.bandList.getBands());

      /* This is listening for a voting-band event and then calling the increaseVotes method on the
      bandList object and then emitting the current-bands event. */
      socket.on("voting-band", (id) => {
        this.bandList.increaseVotes(id);
        this.io.emit("current-bands", this.bandList.getBands());
      });

      /* Listening for a delete-band event and then calling the remove method on the bandList object
      and then emitting the current-bands event. */
      socket.on("delete-band", (id) => {
        this.bandList.remove(id);
        this.io.emit("current-bands", this.bandList.getBands());
      });

      /* Listening for a change-band-name event and then logging the id and name of the band. It then
      calls the changeName method on the bandList object and then emits the current-bands event. */
      socket.on("change-band-name", ({ id, name }) => {
        console.log(id, name);
        this.bandList.changeName(id, name);
        this.io.emit("current-bands", this.bandList.getBands());
      });

      socket.on("add-band", ({ name }) => {
        this.bandList.addBand(name);
        this.io.emit("current-bands", this.bandList.getBands());
      });
    });
  }
}

module.exports = Sockets;
