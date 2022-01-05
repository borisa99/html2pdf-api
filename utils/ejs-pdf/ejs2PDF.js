const fs = require("fs");
const pdf = require("html-pdf");
const ejs = require("ejs");
const { emailClient } = require("../../shared/email");

const graphQlClient = require("../../shared/hasuraClient");
const { GET_INVOICE_ITEMS } = require("../../graphql/invoice/invoice.queries");
const { GET_CLIENT } = require("../../graphql/client/client.queries");

const invoiceCalculate = async (requestData) => {
  // Get invoice items
  const { invoice_items } = await graphQlClient.request(GET_INVOICE_ITEMS, {
    invoice_id: requestData.id,
  });

  // Get client
  const { clients_by_pk } = await graphQlClient.request(GET_CLIENT, {
    id: requestData.client_id,
  });

  // Transform requestData to pdfData
  // Calculate total for each item
  const items = invoice_items.map((item, index) => {
    return {
      index: index + 1,
      name: item.notes,
      description: item.notes,
      quantity: item.qty,
      price: item.cost,
      total: parseFloat(item.cost * item.qty).toFixed(2),
    };
  });
  // Calculate subtotal
  const subtotal = parseFloat(
    items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0)
  ).toFixed(2);

  // Calculate discount based on percentage value
  const discount = parseFloat((subtotal * requestData.discount) / 100).toFixed(
    2
  );

  // Calculate total with discount
  const total = parseFloat(subtotal - discount).toFixed(2);

  const pdfData = {
    name: clients_by_pk.company,
    address: clients_by_pk.address,
    email: clients_by_pk.invoice_email,
    date_of_invoice: requestData.date_of_invoice,
    due_date: requestData.due_date,
    invoice_number: requestData.invoice_number,
    discount_in_percent: requestData.discount,
    items,
    subtotal,
    discount,
    total,
  };
  return pdfData;
};

// Generate html invoice
const ejs2PDF = async (fileName, requestData) => {
  const pdfData = await invoiceCalculate(requestData);
  // Read ejs file
  fs.readFile(__dirname + "/invoice.ejs", "utf8", async (err, data) => {
    if (err) {
      console.log(err);
      return false;
    }
    // Render ejs file
    const ejs_string = data;
    const template = ejs.compile(ejs_string);
    const html = template(pdfData);
    // Generate pdf
    await generatePdf(fileName, pdfData.email, html);
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
