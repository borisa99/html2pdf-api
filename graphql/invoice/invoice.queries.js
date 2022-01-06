const { gql } = require("graphql-request");

const GET_INVOICE_ITEMS = gql`
  query InvoiceItems($invoice_id: Int!) {
    invoice_items(where: { invoice_id: { _eq: $invoice_id } }) {
      id
      cost
      invoice_id
      notes
      product_key
      qty
      tax_name1
      tax_rate1
    }
  }
`;
module.exports = {
  GET_INVOICE_ITEMS,
};
