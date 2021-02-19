const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const ratelimit = require("./utils/ratelimit");
const app = express();
const config = require("../config");
const session = require("express-session");
const mongoose = require("mongoose");

app.set("trust proxy", 1);

app.use(express.static(__dirname + "/../dist/"));
app.use(ratelimit(90000, 120));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(config.session.secret));
app.use(session(config.session));
require("./utils/passport")(app);

app.use(require("./middlewares/addUser"));
app.use("/api", require("./routes/base"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/files", require("./routes/files"));
app.use("/api/users", require("./routes/users"));
app.use(require("./routes/"));

app.get("*", (_, res) => {
  res.sendFile("index.html", { root: __dirname + "/../dist/" });
});

const main = async () => {
  await mongoose
    .connect(config.mongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoIndex: true,
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((e) => {
      console.log("Couldn't connect to database!");
      console.error(e);
      process.exit(1);
    });
  app.listen(8080, () => {
    console.log("Listening on 8080");
  });
};

main();
