const { GraphQLClient } = require("graphql-request");

const client = new GraphQLClient(process.env.HASURA_ENDPOINT, {
  headers: {
    "Content-Type": "application/json",
    "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET,
  },
});

module.exports = client;
