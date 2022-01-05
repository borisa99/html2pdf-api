module.exports = (app) => {
  app.use("/api/invoice", require("./invoice/invoice.router"));
};
