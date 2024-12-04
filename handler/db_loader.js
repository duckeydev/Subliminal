if (global.config.database.useADatabase) {
  switch (true) {
    case global.config.database.mongodb.enabled: {
      require("../database/mongodb/init.js");
      break;
    }
    case global.config.database.redis.enabled: {
      require("../database/redis/init.js");
      break;
    }
    case global.config.database.quickdb.enabled: {
      require("../database/quickdb/init.js");
      break;
    }
  }
}
