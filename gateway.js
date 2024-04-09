const gateway = require("fast-gateway");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const timeout = require("connect-timeout");

app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

const authenticate = require("./Authentication");
var routes;
var env = process.env.NODE_ENV || "dev";
if (env.trim() == "dev") {
  routes = require("./routesConfig-dev")(app);
} else if (env.trim() == "colo") {
  routes = require("./routesConfig-colo")(app);
} else {
  routes = require("./routesConfig-uat")(app);
}

console.log(`Routing requests to ${env} env.`);

const server = gateway({
  middlewares: [
    cors(), helmet(),
    async (req, res, next) => {
      console.log("Entering Gateway Validation");
      await authenticate(req, res, next);
      req.cacheDisabled = true;
    },
    timeout("120s"),
  ],
  routes,
});

console.log(`Gateway server is running on port 31703`);
server.start(31703);
