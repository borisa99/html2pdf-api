require("dotenv").config();
const express = require("express");
const app = express();
const useRouter = require("./api/index");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/uploads"));
useRouter(app);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}`)
);
