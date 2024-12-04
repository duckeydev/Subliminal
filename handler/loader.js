const path = require("path");
const fs = require("fs");
const logger = require("../utilities/logger");
const utilitiesPath = path.resolve(__dirname, "../utilities");

fs.readdirSync(utilitiesPath).forEach((file) => {
  const fileNameWithoutExt = path.basename(file, path.extname(file));
  const filePath = path.join(utilitiesPath, file);

  if (fs.lstatSync(filePath).isFile()) {
    global[fileNameWithoutExt] = require(filePath);
    logger("Loaded util : " + fileNameWithoutExt, "ready");
  }
});

global.config = require("../config");
require('./db_loader')