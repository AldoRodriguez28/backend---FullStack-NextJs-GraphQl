const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schemas");
const resolvers = require("./db/resolvers");
const connectDB = require("./config/db");
require("dotenv").config({ path: "variables.env" });
const jwt = require("jsonwebtoken");

//conexion ala base de datos
connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        //const usuario = await jwt.verify(token, process.env.SECRETA);
        const usuario = await jwt.verify(token,'secretkey');
        return { usuario };
      } catch (error) {
        console.log('hubo un error:',error);
        throw new Error(error)
      }
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});