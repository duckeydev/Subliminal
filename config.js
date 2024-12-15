module.exports = {
  web: {
    port: 3000,
    title: "Meow",
    serveo_enabled: false,
    serveo: {
      subdomain: "transitcdn",
    },
    debug: {
      generateDebug: true,
      presetKey: "debugitdawg" // default is debugitdawg (this is only in use when generateDebug is false)
    },
    admin: {
      username: "skibidi",
      password: "b"
    },
    errorPage: true, // Custom error page if true
    healthCheck: true,
    session_secret: "Skibidi",
    encrypt_key: "sdfdsad",
    url: "https://humble-space-happiness-jj4rjp7rvxq6fqrr4-3000.app.github.dev"
  },
  apikeys: {
    huggingFace: "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" // AI
  },
  database: {
    useADatabase: true,
    mongodb: {
      enabled: true,
      uri: "mongodb+srv://duckeydev:duckeydev@cluster0.dzqqtfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
    },

    redis: {
      enabled: false,
      password: "P6jrmHihpup656BUPpWGaORRe7HrvgsH",
      uri: "redis-17383.c321.us-east-1-2.ec2.redns.redis-cloud.com",
      port: 17383
    },

    quickdb: {
      enabled: false,
      storePath: "", // will be inside database/quickdb no matter what
    },

    session: {
      mongodb: {
        enabled: true,
        uri: "mongodb+srv://duckeydev:duckeydev@cluster0.dzqqtfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
      },
      redis: {
        enabled: false,
        uri: "",
        prefix: ":session",
      },
      sqlite3: {
        enabled: false,
      },
    },
  },
  mail: {
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: "noreply@ambrosia.gg",
      pass: "DuckeyDev$69",
    },
  }
};
