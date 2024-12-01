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
  subcribeConnectedCSResolver,
  connectClientCSResolver,
  subcribeAcquireCSResolver,
  disconnectClientCSResolver,
  subcribeDisconnectedCSResolver
} from '../resolvers/cstoken';
import {
  ClientCSConnectedEvent,
  ClientCSDisconnectedEvent,
  Subjects
} from "../../events";
import { withFilter } from 'graphql-subscriptions';

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
    t.nonNull.string('connectedAt')
    t.nonNull.string('disconnectedAt')
    t.nonNull.field('requestParent', {
      type: RequestParent,
      description: "The client ip associated request parent record(always the same two record using ip)"
    })
  },
  description: "Clients to request and acquire the single token for CS"
});

/**
 * ConnectedClient
 */
export const ConnectedClient = objectType({
  name: 'ConnectedClient',
  definition(t) {
    t.nonNull.string('sourceIp'),
      t.nonNull.string('connectedAt')
  },
  description: "Connected client to an ip on network CS"
})

/**
 * DisconnectedClient
 */
export const DisconnectedClient = objectType({
  name: 'DisconnectedClient',
  definition(t) {
    t.nonNull.string('sourceIp'),
      t.nonNull.string('disconnectedAt')
  },
  description: "Disconnected client from an ip on network CS"
})

/**
 * RequestCS
 */
export const RequestCS = objectType({
  name: 'RequestCS',
  definition(t) {
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
    t.nonNull.field('connectClientCS', {
      type: 'ConnectedClient',
      args: {
        sourceIp: nonNull(stringArg())
      },
      resolve: connectClientCSResolver
    });
    t.nonNull.field('disconnectClientCS', {
      type: 'DisconnectedClient',
      args: {
        sourceIp: nonNull(stringArg())
      },
      resolve: disconnectClientCSResolver
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
    t.field(Subjects.ClientCSConnected, {
      type: 'ConnectedClient',
      args: {
        sourceIp: nonNull(stringArg())
      },
      subscribe: withFilter(
        (_root, _args, ctx) => ctx.pubsub.asyncIterator(Subjects.ClientCSConnected),
        (clientConnect: ClientCSConnectedEvent, variables) => {
          return (
            clientConnect.data.sourceIp === variables.sourceIp
          );
        }),
      resolve: subcribeConnectedCSResolver
    });
    t.field(Subjects.ClientCSDisconnected, {
      type: 'DisconnectedClient',
      args: {
        sourceIp: nonNull(stringArg())
      },
      subscribe: withFilter(
        (_root, _args, ctx) => ctx.pubsub.asyncIterator(Subjects.ClientCSDisconnected),
        (clientDisconnect: ClientCSDisconnectedEvent, variables) => {
          return (
            clientDisconnect.data.sourceIp === variables.sourceIp
          );
        }),
      resolve: subcribeDisconnectedCSResolver
    });
    t.field(Subjects.RequestCSCreated, {
      type: 'RequestCS',
      subscribe(_root, _args, ctx) {
        return ctx.pubsub.asyncIterator(Subjects.RequestCSCreated)
      },
      resolve: subcribeRequestCSResolver
    });
    t.field(Subjects.AcquireCSCreated, {
      type: 'AcquireCS',
      subscribe(_root, _args, ctx) {
        return ctx.pubsub.asyncIterator(Subjects.AcquireCSCreated)
      },
      resolve: subcribeAcquireCSResolver
    });

  },
});


