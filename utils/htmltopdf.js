const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf");
const options = require("./pdfConfig");

const create = async (fileName) => {
  try {
    const html = fs
      .readFileSync(path.resolve(__dirname, "../temp", fileName), "utf8")
      .toString("utf8");
    await pdf
      .create(html, options)
      .toFile(
        path.resolve(__dirname, "../uploads", `${fileName.split(".")[0]}.pdf`),
        (err, res) => {
          if (err) {
            console.log(err);
          }
          fs.unlinkSync(path.resolve(__dirname, "../temp", fileName));
        }
      );
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  create,
};
