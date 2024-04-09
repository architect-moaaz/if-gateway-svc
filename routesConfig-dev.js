const fileUpload = require("express-fileupload");
const axios = require("axios");
const FormData = require("form-data");
const helmet = require("helmet");
const cors = require("cors");
var FormulaParser = require('hot-formula-parser').Parser;
var parser = new FormulaParser();
const { createProxyMiddleware } = require("http-proxy-middleware");

require("dotenv").config();
module.exports = (app) => {
  return [
    {
      prefix: "/upload",
      target: `http://${process.env.UPLOAD_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/cds",
      target: `http://${process.env.CDS_ADDRESS}/`,
      middleware: [
        cors(),
        helmet(),
        app.use(fileUpload()),
        async (req, res, next) => {
          if (req.method === "POST" && req.files && req.files.file) {
            const file = req.files.file;
            const formData = new FormData();
            formData.append("file", file.data, { filename: file.name });
            try {
              const response = await axios.post(
                `http://${process.env.CDS_ADDRESS}${req.originalUrl.slice(4)}`,
                formData,
                {
                  headers: {
                    ...formData.getHeaders(),
                    ...req.headers,
                  },
                }
              );
              res.status(response.status).send(response.data);
            } catch (error) {
              next(error);
            }
          } else {
            next();
          }
        },
      ],
    },
    {
      prefix: "/modeler",
      target: `http://${process.env.MODELER_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/deployment",
      target: `http://${process.env.DEPLOY_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/router",
      target: `http://${process.env.ROUTER_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/data",
      target: `http://${process.env.ODATA_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/excelapp",
      target: `http://${process.env.GENESIS_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/identity",
      target: `http://${process.env.IDENTITY_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/notification",
      target: `http://${process.env.NOTIFICATION_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/process",
      target: `http://${process.env.PROCESS_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/reports",
      target: `http://${process.env.REPORT_ADDRESS}`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/bulkUpload",
      target: `http://${process.env.BULK_UPLOAD_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/vault",
      target: `http://${process.env.VAULT_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/universal-connector",
      target: `http://${process.env.UNIVERSAL_CONNECTOR_ADDRESS}`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/exceltoapp",
      target: `http://${process.env.EXCEL_ADDRESS}`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/parseFormula",
      target: `http://${process.env.FORMULA_PARSER_ADDRESS}/parseFormula`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/bot",
      target: `http://ns3172713.ip-151-106-32.eu:43000`,
      middleware: [cors(), helmet()],
    },
    {
      prefix: "/chat",
      target: `http://${process.env.CHAT_ADDRESS}/`,
      middleware: [cors(), helmet(),
        app.use(createProxyMiddleware({
          target: `http://${process.env.CHAT_ADDRESS}/`,
          changeOrigin: true,
        })),],
    },
    {
      prefix: "/upgrade",
      target: `http://${process.env.UPGRADE_ADDRESS}/`,
      middleware: [cors(), helmet()],
    },
  ];
};
