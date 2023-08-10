import {
  booleanArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from 'nexus';
import { extendType } from 'nexus'
import {
  createClientResolver,
  createRequestCSResolver,
  createAcquireCSResolver
} from '../resolvers/cstoken';
//import { withFilter } from "graphql-subscriptions";
//import { CommentCreatedEvent } from '../../events';

/**
 * RequestParent
 */
export const requestParent = objectType({
  name: 'requestParent',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('clientIp')
  },
  description: "Clients to request and acquire the single token for CS"
});

/**
 * Client
 */
export const client = objectType({
  name: 'client',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('ip')
    t.nonNull.string('name')
    t.nonNull.boolean('connected')
    t.nonNull.field('requestParent', {
      type: requestParent,
      description: "The client ip associated request parent record(always the same two record using ip)"
    })
  },
  description: "Clients to request and acquire the single token for CS"
});


/**
 * RequestCS
 */
export const requestCS = objectType({
  name: 'requestCS',
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
export const acquireCS = objectType({
  name: 'acquireCS',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('ip')
    t.nonNull.string('sourceIp')
    t.nonNull.string('acquiredAt')
  },
  description: "A client ip takes ownership of CS token from the sourceIp"
});

export const CSTokenMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createClient', {
      type: 'client',
      args: {
        ip: nonNull(stringArg()),
        name: nonNull(stringArg()),
        connected: nonNull(booleanArg())
      },
      resolve: createClientResolver
    });
    t.nonNull.field('createRequestCS', {
      type: 'requestCS',
      args: {
        sourceIp: nonNull(stringArg()),
        parentIp: nonNull(stringArg()),
        relayed: nonNull(booleanArg())
      },
      resolve: createRequestCSResolver
    });
    t.nonNull.field('createAcquireCS', {
      type: 'acquireCS',
      args: {
        ip: nonNull(stringArg()),
        sourceIp: nonNull(stringArg())
      },
      resolve: createAcquireCSResolver
    });
  },
})

// export const Subscription = extendType({
//   type: "Subscription",
//   definition(t) {
//     t.field('newComment', {
//       type: 'blogComment',
//       subscribe(_root, _args, ctx) {
//         return ctx.pubsub.asyncIterator('newComment')
//       },
//       resolve: newCommentResolver
//     });
//     t.field('commentAdded', {
//       type: 'blogComment',
//       args: {
//         articleSlug: nonNull(stringArg())
//       },
//       subscribe: withFilter(
//         (_root, _args, ctx) => ctx.pubsub.asyncIterator('commentAdded'),
//         (msg: CommentCreatedEvent, variables) => {
//           return (
//             msg.data.articleSlug === variables.articleSlug
//           );
//         }),
//       resolve: newCommentResolver
//     })

//   },
// });


