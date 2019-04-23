import { ForbiddenEorror } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers'

export const isAuthenticated = (parent, args, { me }) =>
    me ? skip : new ForbiddenEorror('Not Authenticated as user')

export const isAdmin = combineResolvers(
    isAuthenticated,
    (parent, args, { me: { role } }) =>
        role === 'ADMIN'
        ? skip
        : new ForbiddenEorror('Not authorized as admin.'),
);

export const isMessageOwner = async(
    parent,
    { id },
    { models, me },
) => {
    const message = await models.Message.findByPk(id, { raw: true });

    if(message.userId !== me.id) {
        throw new ForbiddenEorror('Not authenticated as owner.');
    }
    return skip;
};