const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
require('dotenv').config(); 
const resolvers = require('./resolvers');
const mongoose = require('./database/connection');
const jwt = require('jsonwebtoken');


(async () => {
  const app = express();
  const context = ({ req,res }) => {
    const token = req.headers.authorization || '';
    if (token) {
      try {
        const user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        return { user }; 
      } catch (err) {
        console.error('Invalid token', err);
        throw new Error('Unauthorized');
      }
    }
    return {}; // Return empty context if no token
  };
  const server = new ApolloServer({ typeDefs, resolvers,context});
  await server.start();
  server.applyMiddleware({ app });
  app.listen(4000, () =>
    console.log(`Server running at http://localhost:${process.env.PORT}${server.graphqlPath}`)
  );
})();
