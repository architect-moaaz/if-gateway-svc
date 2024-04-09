const axios = require("axios");
const UnAuthorized = require("./error");
//const db = require("./db");
const accessConfig = require("./accessConfig.js");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var env = process.env.NODE_ENV || "dev";
if (env.trim() == "colo") {
  var config = require("./tokenConfig")["colo"];
} else {
  var config = require("./tokenConfig")["dev"];
}

const {
  keyCloackServer: { keycloakHost, keycloakPort, refresh_url },
} = config;
async function tokenAuthentication(req, res, next) {
  const globalWorkspace = req.headers.workspace
    ? req.headers.workspace
    : req.query.workspace;
  const globalToken = req.headers.authorization
    ? req.headers.authorization
    : req.query.Authorization;
  if (!globalWorkspace) {
    return next(new UnAuthorized("workspace name is missing in the request"));
  }
  if (globalToken) {
    await assignRealm(globalWorkspace, req, res, next);
    //await getAccessToken(req, res, next);
    var url = `http://${keycloakHost}${keycloakPort}/realms/${req.headers.realm}/protocol/openid-connect/userinfo`;
    const options = {
      method: "GET",
      url: url,
      headers: {
        Authorization: globalToken.includes("Bearer")
          ? globalToken
          : `Bearer ${globalToken}`,
      },
    };
    console.log("url hit: " + url);
    await axios(options)
      .then(async function (response) {
        if (response.status === 200) {
          console.log("Success returned");
          await attachUserAndGroup(globalWorkspace, req, response.data);
          /* let roleMatched = await attachUserAndGroupAndCheckRole(
            globalWorkspace,
            req,
            response.data,
            req.headers.realm,
            globalToken
          );
          if (!roleMatched) {
            return next(
              new UnAuthorized("Unauthorized access: Role mismatch.")
            );
          }*/
          await addApiAuthenticationTokenIfPresent(req);
          next();
        } else {
          return next(new UnAuthorized(await getErrorMessage(response.data)));
        }
      })
      .catch(async function (error) {
        if (error.response) {
          console.log(error.response);
          return next(
            new UnAuthorized(await getErrorMessage(error.response.data))
          );
        } else {
          return next(
            new UnAuthorized(
              "Something went wrong while authenticating the token"
            )
          );
        }
      });
  } else {
    return next(new UnAuthorized("bearer token missing"));
  }
}

async function addApiAuthenticationTokenIfPresent(req) {
  const targetApiHeaders = req.rawHeaders;
  const headersObject = {};
  for (let i = 0; i < targetApiHeaders.length; i += 2) {
    const headerName = targetApiHeaders[i];
    const headerValue = targetApiHeaders[i + 1];
    headersObject[headerName] = headerValue;
  }
  for (const header in headersObject) {
    const headerKey = header.split("-");
    let checkSplit = headerKey[headerKey.length - 1];
    if (checkSplit.trim() === "externalapi") {
      let valueString = "";
      for (let key in headerKey) {
        if (headerKey[key] !== "externalapi") {
          if (valueString.length > 0) {
            valueString += `-${headerKey[key]}`;
          } else {
            valueString += `${headerKey[key]}`;
          }
        }
      }
      req.headers[valueString] = headersObject[header];
    }
  }
}

async function getErrorMessage(errorObj) {
  return errorObj.error_description == undefined
    ? errorObj.error
    : errorObj.error_description;
}

async function getAccessToken(globalToken, globalWorkspace, req, res, next) {
  const cleanedToken = await removeBearerPrefix(globalToken);
  const options = {
    method: "POST",
    url: refresh_url,
    headers: {
      workspace: globalWorkspace,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      refresh_token: cleanedToken,
    }),
  };

  try {
    const response = await axios(options);
    if (response.status === 200) {
      globalToken = `Bearer ${response.data.access_info.access_token}`;
      return globalToken;
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function removeBearerPrefix(token) {
  const parts = token.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  }
  return token;
}

async function attachUserAndGroup(workspace, req, data) {
  let groupsFromToken = data["groups"];
  let userName =
    data["username"] === undefined
      ? data["preferred_username"]
      : data["username"];
  req.headers.user = userName;
  req.headers.group = groupsFromToken ? groupsFromToken : [];
  req.headers.workspace = workspace;
}

async function attachUserAndGroupAndCheckRole(
  workspace,
  req,
  data,
  realm,
  globalToken
) {
  let roles = await getUserRoles(data.sub, realm, globalToken);
  let accessEnabled = await verifyUserRole(roles.data.realmMappings, req);
  let groupsFromToken = data["groups"];
  let userName =
    data["username"] === undefined
      ? data["preferred_username"]
      : data["username"];
  req.headers.user = userName;
  req.headers.group = groupsFromToken ? groupsFromToken : [];
  req.headers.workspace = workspace;
  return accessEnabled;
}

async function verifyUserRole(realmMappings, req) {
  const workspace = req.headers.realm;
  let roles = realmMappings.map((mapping) => mapping.name);
  const pipeline = [
    {
      $match: {
        role: { $in: roles },
        workspace: workspace,
      },
    },
  ];
  const cursor = db.collection("menu_assigned").aggregate(pipeline);
  const assignedMappings = await cursor.toArray();
  let enabledMapping;
  const apiPath = req.path;
  for (const key in accessConfig) {
    const regex = new RegExp(key.replace(/:\w+/g, "\\w+"));
    if (regex.test(apiPath)) {
      enabledMapping = accessConfig[key];
      break;
    }
  }
  if (!enabledMapping) {
    return true;
  }
  const isMappingEnabled = assignedMappings.some((mapping) =>
    mapping.menus_enabled.includes(enabledMapping)
  );
  if (isMappingEnabled) {
    return true;
  }
  return false;
}

async function getUserRoles(id, realm, globalToken) {
  var roleAPI = {
    method: "GET",
    url: `http://${keycloakHost}/admin/realms/${realm}/users/${id}/role-mappings`,
    headers: {
      authorization: JSON.parse(JSON.stringify(globalToken)),
      "Content-Type": "application/json",
      redirect: "follow",
    },
  };

  var roles = await axios(roleAPI);
  return roles;
}

async function assignRealm(globalWorkspace, req, res, next) {
  var workspace = globalWorkspace;
  workspace = workspace.toLowerCase();
  const realm = process.env[workspace];
  req.headers["realm"] = realm ? realm : globalWorkspace;
  if (!workspace) {
    console.log(
      `The corresponding realm is not added in client mappings, For the workspce: ${workspace}`
    );
  }
}

module.exports = tokenAuthentication;
