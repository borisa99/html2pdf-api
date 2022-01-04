const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf");
const options = require("./pdfConfig");

const create = async () => {
  try {
    const html = fs
      .readFileSync(path.resolve(__dirname, "test.html"), "utf8")
      .toString("utf8");
    const pdfFile = await pdf.create(html, options);
    pdfFile.toFile("./uploads/test.pdf", function (err, buffer) {
      if (err) {
        console.log(err);
      } else {
        console.log("PDF created");
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  create,
};
