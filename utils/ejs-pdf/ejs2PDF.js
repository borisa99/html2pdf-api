const fs = require("fs");
const pdf = require("html-pdf");
const ejs = require("ejs");

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
    .toFile(`./uploads/${fileName}`, function (err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
};

module.exports = {
  ejs2PDF,
};
