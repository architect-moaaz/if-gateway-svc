require("dotenv").config();
var config = {
  development: {
    database: {
      host: "127.0.0.1",
      port: "27017",
      name: "k1",
      suffix: "",
    },
  },
  production: {
    database: {
      host:
        process.env.PROD_MONGO_USERNAME +
        ":" +
        process.env.PROD_MONGO_PASSWORD +
        "@" +
        process.env.PROD_MONGO_HOST,
      port: process.env.PROD_MONGO_PORT,
      name: process.env.PROD_MONGO_NAME,
      suffix: "?authSource=admin",
    },
  },
  colo: {
    database: {
      host:
        process.env.COLO_MONGO_USERNAME +
        ":" +
        process.env.COLO_MONGO_PASSWORD +
        "@" +
        process.env.COLO_MONGO_HOST,
      port: process.env.COLO_MONGO_PORT,
      name: process.env.COLO_MONGO_NAME,
      suffix: "?authSource=admin&retryWrites=true&w=majority",
    },
  },
  gcp: {
    database: {
      host:
        process.env.GCP_MONGO_USERNAME +
        ":" +
        process.env.GCP_MONGO_PASSWORD +
        "@" +
        process.env.GCP_MONGO_HOST,
      port: process.env.GCP_MONGO_PORT,
      name: process.env.GCP_MONGO_NAME,
      suffix: "?authSource=admin&retryWrites=true&w=majority",
    },
  },
  uat: {
    database: {
      host:
        process.env.UAT_MONGO_USERNAME +
        ":" +
        process.env.UAT_MONGO_PASSWORD +
        "@" +
        process.env.UAT_MONGO_HOST,
      port: process.env.UAT_MONGO_PORT,
      name: process.env.UAT_MONGO_NAME,
      suffix: "?authSource=admin",
    },
  },
};
module.exports = config;
