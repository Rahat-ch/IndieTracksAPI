import cors from 'cors'
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

const app = express();
app.use(cors());

const schema = `
    type Query{
        me: User
        user(id: ID!): User
        users: [User!]
    }

    type User {
        id: ID!
        username: String!
    }
`

let users = {
    1: {
      id: '1',
      username: 'Rahat Chowdhury',
    },
    2: {
      id: '2',
      username: 'Hasiba Khan',
    },
  };

const me = users[1];

const resolvers = {
    Query: {
      user: (parent, { id }) => {
        return users[id];
      },
      users: () => {
        return Object.values(users);
      },
      me: () => {
        return me;
      },
    },
  };

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
});

server.applyMiddleware({ app, path: '/graphql'});

app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql')
})