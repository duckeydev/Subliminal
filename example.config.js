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
      errorPage: true, // Custom error page if true
      healthCheck: false,
      session_secret: "",  // <- fill this in 
      encrypt_key: "",  // <- fill this in 
      url: ""  // <- fill this in 
    },
    apikeys: {
      huggingFace: "" // AI
    },
    database: {
      useADatabase: true,
      mongodb: {
        enabled: true,
        uri: "", // <- fill this in only
      },
  
      redis: {
        enabled: false,
        password: "",
        uri: "",
        port: 17383
      },
  
      quickdb: {
        enabled: false,
        storePath: "", // will be inside database/quickdb no matter what
      },
  
      session: {
        mongodb: {
          enabled: true,
          uri: "",  // <- fill this in only
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
      host: "", // <- fill this in
      port: 465, // <- fill this in
      secure: true, // true for port 465, false for other ports
      auth: {
        user: "", // <- fill this in
        pass: "",  // <- fill this in
      },
    }
  };
  