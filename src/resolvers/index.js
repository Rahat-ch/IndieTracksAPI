import { GraphQLDateTime } from 'graphql-iso-date'

import userResolvers from '../resolvers/user';
import songResolvers from '../resolvers/song';

const customScalarResolver = {
    Date: GraphQLDateTime,
}

export default [
    customScalarResolver,
    userResolvers, 
    songResolvers,
];