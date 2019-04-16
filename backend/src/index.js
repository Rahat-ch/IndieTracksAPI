import cors from 'cors'
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

const app = express();
app.use(cors());

const schema = `
    type Query{
        me: User
    }

    type User {
        username: String!
    }
`
const resolvers = {
    Query: {
        me: () => {
            return{
                username: 'Rahat Chowdhury'
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
});

server.applyMiddleware({ app, path: '/graphql'});

app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql')
})