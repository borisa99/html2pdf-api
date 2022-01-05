require("dotenv").config();
const express = require("express");
const app = express();
const { ejs2PDF } = require("./utils/ejs-pdf/ejs2PDF");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/uploads"));

app.post("/api/html-to-pdf", async (req, res) => {
  try {
    const fileName = "invoice-" + JSON.stringify(Date.now()) + ".pdf";
    await ejs2PDF(fileName, req.body);
    res.send(fileName);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}`)
);
