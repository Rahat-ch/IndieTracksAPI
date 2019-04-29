import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    songs(cursor: String, limit: Int): SongConnection!
    song(id: ID!): Song!
  }
  extend type Mutation {
    createSong(url: String!): Song!
    deleteSong(id: ID!): Boolean!
  }
  type SongConnection {
    edges: [Song!]!
    pageInfo: PageInfo!
  }
  type PageInfo {
    hasNextPage: Boolean!
    endCursor: Date!
  }
  type Song {
    id: ID!
    url: String!
    createdAt: Date!
    user: User!
  }
`;