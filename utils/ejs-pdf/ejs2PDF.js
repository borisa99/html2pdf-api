const fs = require("fs");
const pdf = require("html-pdf");
const ejs = require("ejs");
const { emailClient } = require("../../shared/email");

// Generate html invoice
const ejs2PDF = (fileName, ejsData) => {
  // Read ejs file
  fs.readFile(__dirname + "/invoice.ejs", "utf8", async (err, data) => {
    if (err) {
      console.log(err);
      return false;
    }
    // Render ejs file
    const ejs_string = data;
    const template = ejs.compile(ejs_string);
    const html = template(ejsData);
    // Generate pdf
    await generatePdf(fileName, html);
  });
};

const generatePdf = (fileName, html) => {
  // Generate pdf and save it in uploads folder
  pdf
    .create(html, {
      format: "A4",
      border: {
        top: "5mm",
      },
    })
    .toFile(`./uploads/${fileName}`, async (err, res) => {
      if (err) return console.log(err);
      //Send email
      await emailClient.send({
        template: "invoice",
        message: {
          to: "a@mail.b",
          headers: {},
          attachments: [
            {
              filename: fileName,
              path: res.filename,
              contentType: "application/pdf",
            },
          ],
        },
        locals: {},
      });
    });
};

module.exports = {
  ejs2PDF,
};
