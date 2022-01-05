const express = require("express");
const app = express();
// const { create } = require("./utils/htmltopdf");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/uploads"));

app.post("/api/html-to-pdf", async (req, res) => {
  try {
    // await create(req.fileName, pdfFileName);
    res.send("DOOBAR");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
