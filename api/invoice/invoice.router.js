const express = require("express");
const router = express.Router();
const { ejs2PDF } = require("../../utils/ejs-pdf/ejs2PDF");

router.post("/", async (req, res) => {
  try {
    const fileName = "invoice-" + JSON.stringify(Date.now()) + ".pdf";
    await ejs2PDF(fileName, req.body.event.data.new);
    res.send(fileName);
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
