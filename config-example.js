module.exports = {
  port: 8080,
  hostname: "0.0.0.0",
  mongo: "",
  discord: {
    client_secret: "",
    client_id: "",
    callback: "http://localhost:8080/api/auth/discord/callback",
    scope: ["identify", "email"],
    prompt: "none",
  },
  session: {
    secret: "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
    },
  },
  meta: {
    name: "Content Delivery Network",
    title: "CDN",
    baseurl: "http://localhost:8080",
    color: "#ff0000",
  },
  files: {
    storage: __dirname + "/files/",
    temp: __dirname + "/temp/",
    limits: { fileSize: 256 * 1024 * 1024 },
  },
};
