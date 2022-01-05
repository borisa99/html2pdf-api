const express = require("express");
const router = express.Router();
const { ejs2PDF } = require("../../utils/ejs-pdf/ejs2PDF");

const graphQlClient = require("../../shared/hasuraClient");
const { GET_INVOICE_ITEMS } = require("../../graphql/invoice/invoice.queries");
const { GET_CLIENT } = require("../../graphql/client/client.queries");

router.post("/", async (req, res) => {
  try {
    const { invoice_items } = await graphQlClient.request(GET_INVOICE_ITEMS, {
      invoice_id: req.body.invoice_id,
    });
    console.log("invoice_items: ", invoice_items);

    const { clients_by_pk } = await graphQlClient.request(GET_CLIENT, {
      id: req.body.client_id,
    });
    console.log("clients_by_pk: ", clients_by_pk);

    const fileName = "invoice-" + JSON.stringify(Date.now()) + ".pdf";
    await ejs2PDF(fileName, req.body);
    res.send(fileName);
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
