import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import jwt from 'jsonwebtoken';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();

app.use(cors());

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req }) => {
    const me = await getMe(req);

    return {
      models,
      me,
      secret: process.env.SECRET,
    };
  },
});

server.applyMiddleware({ app, path: '/graphql' });


const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const eraseDatabaseOnSync = true;
const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 8000;

sequelize.sync({
  force: eraseDatabaseOnSync || isProduction
}).then(async () => {
  if (eraseDatabaseOnSync || isProduction) {
    createUsersWithSongs(new Date());
  }

  httpServer.listen({
    port
  }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

const createUsersWithSongs = async date => { 
  await models.User.create(
    {
      username: 'rchowdhury',
      email: 'hello@rahat.com',
      password: 'rchowdhury',
      role: 'ADMIN',
      songs: [
        {
          url: 'I\'m Hackerman',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Song],
    },
  );
    
  await models.User.create(
    {
      username: 'hkhan',
      email: 'hello@khan.com',
      password: 'hkhan123',
      songs: [
        {
          url: 'I love pizza!',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          url: 'Stop eating chocolate!',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Song],
    },
  );
};