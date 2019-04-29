import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers'

export const isAuthenticated = (parent, args, { me }) =>
    me ? skip : new ForbiddenError('Not Authenticated as user')

export const isAdmin = combineResolvers(
    isAuthenticated,
    (parent, args, { me: { role } }) =>
        role === 'ADMIN'
        ? skip
        : new ForbiddenError('Not authorized as admin.'),
);

export const isSongOwner = async(
    parent,
    { id },
    { models, me },
) => {
    const song = await models.Song.findByPk(id, { raw: true });

    if(song.userId !== me.id) {
        throw new ForbiddenError('Not authenticated as owner.');
    }
    return skip;
};