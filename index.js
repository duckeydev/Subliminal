const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const config = require("./config.js");
const packager = require("./package.json");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");

/* Fancy! */
const logger = require("./utilities/logger.js");
const chalk = require("chalk");
const figlet = require("figlet");

/* Stuff */
const tunnelService = require("./utilities/tunnel.js");
var sess = {
  secret: config.web.session_secret,
  resave: false,
  saveUninitialized: true,
};

/* Sysinfo */

const os = require("os");
const Table = require("cli-table3");

// Gather system specs
const systemSpecs = {
  "Operating System": `${os.type()} ${os.release()} (${os.arch()})`,
  CPU: os.cpus()[0].model,
  "CPU Cores": os.cpus().length,
  "Total Memory": `${(os.totalmem() / 1024 ** 3).toFixed(2)} GB`,
  Uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
  Hostname: os.hostname(),
};

const table = new Table({
  head: ["Property", "Value"],
  colWidths: [20, 50],
});

Object.entries(systemSpecs).forEach(([key, value]) => {
  table.push([key, value]);
});

console.log(table.toString());

/* Middleware */
const app = express();
const http = require("http").Server(app);

const io = require("socket.io")(http);

app.set("view engine", require("ejs"));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
if (config.database.useADatabase) {
  switch (true) {
    case config.database.session.mongodb.enabled: {
      const MongoStore = require("connect-mongo");
      sess.store = MongoStore.create({
        mongoUrl: config.database.session.mongodb.uri,
      });
      break;
    }
    case config.database.session.redis.enabled: {
      const RedisStore = require("connect-redis").default;
      const { createClient } = require("redis");

      const redisClient = createClient({
        url: config.database.session.redis.uri,
      });
      redisClient.connect().catch(console.error);

      sess.store = new RedisStore({
        client: redisClient,
        prefix: "myapp:",
      });
      break;
    }
    case config.database.session.sqlite3.enabled: {
      const sqlite = require("better-sqlite3");
      const SqliteStore = require("better-sqlite3-session-store")(session);
      const db = new sqlite("./database/quickdb/sessions.db", {
        verbose: logger,
      });

      sess.store = new SqliteStore({
        client: db,
        expired: {
          clear: true,
          intervalMs: 900000, // 15 minutes
        },
      });
      break;
    }
  }
}

app.use(session(sess));
app.use(require("cors")());
io.on("connection", (socket) => {
  logger("Socket connected");
});

global.io_socket = io;

const foldersToWatch = ["./assets", "./views"];
const ignoredFile = "tailwind.css";

const watchFolders = (folders) => {
  folders.forEach((folder) => {
    fs.watch(folder, (eventType, filename) => {
      if (filename && filename !== ignoredFile) {
        const filePath = path.join(folder, filename);
        logger(`File changed: ${filePath} reloading`);
        io.emit("fileChanged", { eventType, filename, filePath });
      }
    });
    logger(`Watching folder: ${folder}`);
  });
};

watchFolders(foldersToWatch);

require("./handler/loader.js");

app.use("/assets", express.static("assets"));
app.use("/uploads", express.static("uploads"));
app.use("/components", express.static("components"));
app.use("/node_modules", express.static("node_modules"));
app.use("/", require("./routers/client/index.js"));
app.use("/dashboard", require("./routers/client/dashboard.js"));
app.use("/api", require("./routers/api/index.js"));
// app.use("/dashboard", require('./routers/dashboard/index.js'))

app.all("/images/@:slug/:fileName", async (req, res) => {
  const db = require("./database/quickdb/init.js");
  const imageUrl = `/uploads/@${req.params.slug}/${req.params.fileName}`;
  const title = `Image by @${req.params.slug}`;
  const views = (await db.get(req.params.slug + "_" + req.params.fileName + "_views")) || 0;
  const description = `This image has been viewed ${views} times!`;
  
  res.send(`    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        
        <!-- Open Graph Metadata -->
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:url" content="${imageUrl}">
        <meta property="og:type" content="website">
        
        <!-- Twitter Card Metadata -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${imageUrl}">
        
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f4f4f4;
            }
            img {
                max-width: 100%;
                height: auto;
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div>
            <h1>${title}</h1>
            <img src="${imageUrl}" alt="${req.params.fileName}">
        </div>
    </body>
    </html>`);
  ( async () => {

   await db.add(req.params.slug + "_" + req.params.fileName + "_views", 1)
  })()
});

app.all("/i_Love_funny", async (req, res) => {
  res.status(418).send("Im a teapot :3");
});

app.all("/uploads/@*/avatar", async (req, res) => {
  res.sendFile(__dirname + "/assets/image.png");
});

// Catch 404 errors
app.use((req, res, next) => {
  res.status(404).send("Custom 404 Page - Page Not Found");
});

// Error-handling middleware
app.use((err, req, res, next) => {
  res.status(500).render("error/serverErr.ejs", {
    error: err.stack,
  });
  console.error(err);
});

/*
const user = require('./database/mongodb/schema/User.js')
const nu = new user({ name: "admin", password: "admin", slug: "admin", apikey: "0000", token: btoa("admin").toString().replace("=", config.web.encrypt_key), email: "johndoe@ambrosia.gg"
})

nu.save()
*/

http.listen(config.web.port, async () => {
  figlet(packager.name, function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(chalk.magenta(data));
    console.log();
    console.log(packager.name, packager.version);
    console.log("- Local: http://localhost:" + config.web.port);
    if (config.web.serveo_enabled == true) {
      tunnelService(config.web.port, config.web.serveo.subdomain)
        .then((url) => {
          console.log("- Tunnel: " + url);
        })
        .catch((err) => {
          console.log("- Tunnel: error");
          logger("Tunnel errored", "error");
          console.log(err);
        });
    } else {
      console.log(`- Tunnel: ${chalk.red("disabled")} `);
    }
  });
});
