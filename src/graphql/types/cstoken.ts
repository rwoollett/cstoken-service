import {
  booleanArg,
  inputObjectType,
  list,
  nonNull,
  objectType,
  stringArg,
} from 'nexus';
import { extendType } from 'nexus'
import {
  getClientsResolver,
  createClientResolver,
  createRequestCSResolver,
  createAcquireCSResolver,
  subcribeRequestCSResolver,
  getRequestCSResolver
} from '../resolvers/cstoken';
//import { withFilter } from "graphql-subscriptions";
//import { CommentCreatedEvent } from '../../events';

/**
 * RequestParent
 */
export const RequestParent = objectType({
  name: 'RequestParent',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('clientIp')
  },
  description: "Clients to request and acquire the single token for CS"
});

/**
 * Client
 */
export const Client = objectType({
  name: 'Client',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('ip')
    t.nonNull.string('name')
    t.nonNull.boolean('connected')
    t.nonNull.field('requestParent', {
      type: RequestParent,
      description: "The client ip associated request parent record(always the same two record using ip)"
    })
  },
  description: "Clients to request and acquire the single token for CS"
});


/**
 * RequestCS
 */
export const RequestCS = objectType({
  name: 'RequestCS',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('requestedAt')
    t.nonNull.boolean('relayed')
    t.nonNull.string('sourceIp')
    t.nonNull.string('parentIp')
  },
  description: "A request for CS from a client source ip to its currently known parent ip in the distributed tree"
});

/**
 * AcquireCS
 */
export const AcquireCS = objectType({
  name: 'AcquireCS',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('ip')
    t.nonNull.string('sourceIp')
    t.nonNull.string('acquiredAt')
  },
  description: "A client ip takes ownership of CS token from the sourceIp"
});

export const RangePort = inputObjectType({
  name: 'RangePort',
  definition(t) {
    t.nonNull.int('from')
    t.nonNull.int('to')
  },
  description: "Port range for list of clients. Ie. all from 5010 to 5020 (from and to)"
});


export const CSTokenQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getClients', {
      type: nonNull(list('Client')),
      args: {
        range: nonNull(RangePort)
      },
      resolve: getClientsResolver
    });
    t.field('getRequestCS', {
      type: nonNull(list('RequestCS')),
      args: {
        ip: nonNull(stringArg())
      },
      resolve: getRequestCSResolver
    });
  },
});

export const CSTokenMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createClient', {
      type: 'Client',
      args: {
        ip: nonNull(stringArg()),
        name: nonNull(stringArg()),
        connected: nonNull(booleanArg())
      },
      resolve: createClientResolver
    });
    t.nonNull.field('createRequestCS', {
      type: 'RequestCS',
      args: {
        sourceIp: nonNull(stringArg()),
        parentIp: nonNull(stringArg()),
        relayed: nonNull(booleanArg())
      },
      resolve: createRequestCSResolver
    });
    t.nonNull.field('createAcquireCS', {
      type: 'AcquireCS',
      args: {
        ip: nonNull(stringArg()),
        sourceIp: nonNull(stringArg())
      },
      resolve: createAcquireCSResolver
    });
  },
})

export const Subscription = extendType({
  type: "Subscription",
  definition(t) {
    t.field('requestCS', {
      type: 'RequestCS',
      subscribe(_root, _args, ctx) {
        
        return ctx.pubsub.asyncIterator('requestCS')
      },
      resolve: subcribeRequestCSResolver
    });
    // t.field('commentAdded', {
    //   type: 'blogComment',
    //   args: {
    //     articleSlug: nonNull(stringArg())
    //   },
    //   subscribe: withFilter(
    //     (_root, _args, ctx) => ctx.pubsub.asyncIterator('commentAdded'),
    //     (msg: CommentCreatedEvent, variables) => {
    //       return (
    //         msg.data.articleSlug === variables.articleSlug
    //       );
    //     }),
    //   resolve: newCommentResolver
    // })

  },
});


