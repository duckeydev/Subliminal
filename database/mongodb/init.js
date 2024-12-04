const mongoose = require("mongoose");

mongoose.connect(global.config.database.mongodb.uri);
mongoose.connection.on("connected", () => {
  global.logger("Connected Successfully", "ready");
});

mongoose.connection.on("disconnected", () => {
  global.logger("Disconnected", "warn");
});
