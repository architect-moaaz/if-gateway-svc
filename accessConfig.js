//add : before any path param, The following is an example with :botID as path param
///universal-connector/db-connection/by-connection-name/:connectionName

const featureApis = {
  "/reports/reportBuilder/updateReportAccessUsersAndGroups": "REPORTS_PUBLISH",
  "/reports/reportBuilder/createReportOrFetchData": "REPORTS_CREATE",
  "/reports/reportBuilder/softDeleteReport": "REPORTS_DELETE",
  "/universal-connector/connector/oneclick": "CONNECTOR_CREATE",
  CONNECTOR_EDIT: "CONNECTOR_EDIT",
  "/universal-connector/db-connection/by-connection-name/:connectionName": "CONNECTOR_DELETE",
  "/modeler/createRepository": "APPDESIGNER_CREATE",
  "/modeler/datamodeller/createFile": "APPDESIGNER_CREATEASSET",
  "/modeler/formmodeller/createFile": "APPDESIGNER_CREATEASSET",
  "/modeler/bpmnmodeller/createFile": "APPDESIGNER_CREATEASSET",
  "/modeler/dmnmodeller/createFile": "APPDESIGNER_CREATEASSET",
  automatedFlow: "APPDESIGNER_CREATE_EXCEL",
  "/modeler/modellerService/cloneApplication": "APPDESIGNER_CREATE_TEMPLATE",
  "/modeler/deleteFile": "APPDESIGNER_DELETEASSET",
  "/deployment/deployment/build/start": "APPDESIGNER_PUBLISH",
  "/modeler/deleteMiniApp": "APPDESIGNER_DELETE",
  "/chatbot/api/v2/admin/workspace/bots": "CHATBOT_EDIT",
  "/chatbot/api/v1/bots/:botID/mod/nlu/train/en": "CHATBOT_PUBLISH"
};

module.exports = featureApis;
