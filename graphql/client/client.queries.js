const { gql } = require("graphql-request");

const GET_CLIENT = gql`
  query Client($id: Int!) {
    clients_by_pk(id: $id) {
      address
      balance
      city
      company
      company_number
      contact_method
      country {
        name
      }
      invoice_email
    }
  }
`;

module.exports = {
  GET_CLIENT,
};
