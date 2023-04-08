const { io } = require("../index");
const Band = require("../models/band");
const Bands = require("../models/bands");

const bands = new Bands();
bands.addBand(new Band("Queen"));
bands.addBand(new Band("Bon Jovi"));
bands.addBand(new Band("Heroes del Silencio"));
bands.addBand(new Band("Metallica"));

// Mensajes de Sockets
io.on("connection", (client) => {
  console.log("Cliente conectado");

  client.emit("active-bands", bands.getBands());

  client.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  client.on("mensaje", (payload) => {
    console.log("Mensaje", payload);

    io.emit("mensaje", { admin: "Nuevo mensaje" });
  });

  //emitir nuevo mensaje
  client.on("emitir-mensaje", (payload) => {
    //Emite a todos los clientes conectados
    // io.emit("nuevo-mensaje", payload);
    //Emite a todos los clientes conectados menos al que lo emitió
    console.log("emitir-mensaje", payload);
    client.broadcast.emit("nuevo-mensaje", payload);
  });

  //vote-band
  client.on("vote-band", (payload) => {
    bands.voteBand(payload.id);
    //Una vez que se actualiza la lista de bandas se emite el evento active-bands para que se actualice en el front con la nueva lista de bandas
    io.emit("active-bands", bands.getBands());
  });

  //add-band
  client.on("add-band", (payload) => {
    const newBand = new Band(payload.name);
    bands.addBand(newBand);
    //Una vez que se actualiza la lista de bandas se emite el evento active-bands para que se actualice en el front con la nueva lista de bandas
    io.emit("active-bands", bands.getBands());
  });

  //delete-band
  client.on("delete-band", (payload) => {
    console.log("delete-band", payload);
    bands.deleteBand(payload.id);
    //Una vez que se actualiza la lista de bandas se emite el evento active-bands para que se actualice en el front con la nueva lista de bandas
    io.emit("active-bands", bands.getBands());
  });
});
