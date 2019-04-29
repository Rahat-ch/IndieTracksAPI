import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated, isSongOwner } from './authorization';

const toCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    songs: async (parent, {
      cursor,
      limit = 100
    }, {
      models
    }) => {
      const cursorOptions = cursor
      ? {
        where: {
          createdAt: {
            [Sequelize.Op.lt]: fromCursorHash(cursor),
          },
        },
      }
      : {};
      
      const songs = await models.Song.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = songs.length > limit;
      const edges = hasNextPage ? songs.slice(0, -1) : songs;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length -1].createdAt.toString(),
          ),
        },
      };
    },
    song: async (parent, {
      id
    }, {
      models
    }) => {
      return await models.Song.findById(id);
    },
  },

  Mutation: {
    createSong: combineResolvers(
      isAuthenticated,
      async (parent, { url }, { models, me }) => {
        return await models.Song.create({
          url,
          userId: me.id,
        });
      },
    ),

    deleteSong: combineResolvers(
      isAuthenticated,
      isSongOwner,
      async (parent, { id }, { models }) => {
        return await models.Song.destroy({ where: { id } });
      },
    ),
  },

  Song: {
    user: async (song, args, { models }) => {
      return await models.User.findByPk(song.userId);
    },
  },
};