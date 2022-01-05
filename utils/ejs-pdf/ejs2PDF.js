const fs = require("fs");
const pdf = require("html-pdf");
const ejs = require("ejs");
const { emailClient } = require("../../shared/email");

const invoiceCalculate = (ejsData) => {
  // Transform ejsData to pdfData
  // Calculate total for each item
  const items = ejsData.items.map((item, index) => {
    return {
      index: index + 1,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      total: parseFloat(item.price * item.quantity).toFixed(2),
    };
  });
  // Calculate subtotal
  const subtotal = parseFloat(
    items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0)
  ).toFixed(2);

  // Calculate discount based on percentage value
  const discount = parseFloat(
    (subtotal * ejsData.discount_in_percent) / 100
  ).toFixed(2);

  // Calculate total with discount
  const total = parseFloat(subtotal - discount).toFixed(2);

  const pdfData = {
    ...ejsData,
    items,
    subtotal,
    discount,
    total,
  };
  return pdfData;
};

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
    const html = template(invoiceCalculate(ejsData));
    // Generate pdf
    await generatePdf(fileName, ejsData.email, html);
  });
};

const generatePdf = (fileName, email, html) => {
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
          to: email,
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
