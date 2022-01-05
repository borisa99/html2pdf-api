const fs = require("fs");
const pdf = require("html-pdf");
const ejs = require("ejs");

// Generate html invoice
const ejs2html = (information) => {
  // Read ejs file
  fs.readFile(__dirname + "/invoice.ejs", "utf8", async (err, data) => {
    if (err) {
      console.log(err);
      return false;
    }
    // Render ejs file
    const ejs_string = data;
    const template = ejs.compile(ejs_string);
    const html = template(information);
    // Generate pdf
    await generatePdf(html);
  });
};

const create = async () => {
  await ejs2html({
    name: "Vajofirma",
    address: "Stefana Nemanje 47",
    email: "vajo@mail.com",
    date_of_invoice: "02.02.2020",
    due_date: "02.02.2020",
    invoice_number: "123456789",
    description: "2 krmka",
    from_to: "02.02.2020-02.02.2020",
    unit: "2405",
    qty: "2",
    price: "2405",
    subtotal: "4810",
    total: "4810",
    discount_in_percent: "0",
    discount_value: "0",
    grand_total: "4810",
  });
};

const generatePdf = (html) => {
  // Generate pdf and save it in uploads folder
  pdf
    .create(html, {
      format: "A4",
      border: {
        top: "5mm",
      },
    })
    .toFile("./uploads/invoice.pdf", function (err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
};

module.exports = {
  create,
};
