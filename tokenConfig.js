require("dotenv").config();
var config = {
  dev: {
    keyCloackServer: {
      keycloakHost: process.env.KEY_CLOAK_HOST,
      keycloakPort: "",
      refresh_url: process.env.REFRESH_API_URL,
    },
  },
  colo:{
    keyCloackServer: {
      keycloakHost: process.env.KEY_CLOAK_HOST,
      keycloakPort: "",
      refresh_url: process.env.REFRESH_API_URL,
    },
  }
};
module.exports = config;
