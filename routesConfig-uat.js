const fileUpload = require("express-fileupload");
const axios = require("axios");
const FormData = require("form-data");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();
module.exports = (app) => {
  return [
    {
      prefix: "/upload",
      target: `http://${process.env.UAT_ADDRESS}:51526/`,
      middleware: [cors(), helmet()]
    },
    {
      prefix: "/cds",
      target: `http://${process.env.UAT_ADDRESS}:51524/`,
      middleware: [
        cors(), helmet(),
        app.use(fileUpload()),
        async (req, res, next) => {
          if (req.method === "POST" && req.files && req.files.file) {
            const file = req.files.file;
            const formData = new FormData();
            formData.append("file", file.data, { filename: file.name });
            try {
              const response = await axios.post(
                `http://${process.env.UAT_ADDRESS}:51524${req.originalUrl.slice(
                  4
                )}`,
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
      target: `http://${process.env.UAT_ADDRESS}:51501`,
      middleware: [cors(), helmet()]
    },
    {
      prefix: "/deployment",
      target: `http://${process.env.UAT_ADDRESS}:51511/`,
      middleware: [cors(), helmet()]
    },
    {
      prefix: "/router",
      target: `http://${process.env.UAT_ADDRESS}:51600/`,
      middleware: [cors(), helmet()]
    },
    {
      prefix: "/data",
      target: `http://${process.env.UAT_ADDRESS}:51513/`,
      middleware: [cors(), helmet()]
    },
    {
      prefix: "/excelapp",
      target: `http://${process.env.UAT_ADDRESS}:51512/`,
      middleware: [cors(), helmet()]
    },
    {
      prefix: "/identity",
      target: `http://${process.env.UAT_ADDRESS}:51523/`,
      middleware: [cors(), helmet()]
    },
    {
      prefix: "/notification",
      target: `http://${process.env.UAT_ADDRESS}:51603/`,
      middleware: [cors(), helmet()]
    },
    {
      prefix: "/process",
      target: `http://${process.env.UAT_ADDRESS}:31701/`,
      middleware: [cors(), helmet()]
    },
    {
      prefix: "/reports",
      target: `http://${process.env.UAT_ADDRESS}:51701`,
      middleware: [cors(), helmet()]
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
  ];
};
