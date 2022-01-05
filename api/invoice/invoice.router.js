const express = require("express");
const router = express.Router();
const { ejs2PDF } = require("../../utils/ejs-pdf/ejs2PDF");

const graphQlClient = require("../../shared/hasuraClient");
const { GET_INVOICE_ITEMS } = require("../../graphql/invoice/invoice.queries");

router.post("/", async (req, res) => {
  try {
    const { invoice_items } = await graphQlClient.request(GET_INVOICE_ITEMS, {
      invoice_id: req.body.invoice_id,
    });
    console.log("invoice_items: ", invoice_items);
    const fileName = "invoice-" + JSON.stringify(Date.now()) + ".pdf";
    await ejs2PDF(fileName, req.body);
    res.send(fileName);
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
