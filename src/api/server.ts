import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { Context } from './context';
import { schema } from '../graphql/schema';
import { rabbitWrapper } from '../lib/rabbitWrapper';

import { prisma } from "../lib/prismaClient";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { SchemaLink } from "@apollo/client/link/schema";
import { ArticlePublishedListener } from '../events/listeners/articlePublishedListener';
import { AMQPPubSub } from 'graphql-amqp-subscriptions';

const PORT = process.env.PORT || 4000

const app = express()
const httpServer = createServer(app)

async function start() {
  if (!process.env.RABBIT_USER) {
    throw new Error('RABBIT_USER must be defined');
  }
  if (!process.env.RABBIT_PASS) {
    throw new Error('RABBIT_PASS must be defined');
  }
  if (!process.env.RABBIT_HOST) {
    throw new Error('RABBIT_HOST must be defined');
  }

  await rabbitWrapper.connect(
    process.env.RABBIT_USER,
    process.env.RABBIT_PASS,
    process.env.RABBIT_HOST
  );
  const pubsub = new AMQPPubSub({
    connection: rabbitWrapper.client
  });


  const context: Context = {
    prisma: prisma,
    pubsub: pubsub,
  }

  /** Create WS Server */
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  /** hand-in created schema and have the WS Server start listening */
  const serverCleanup = useServer({ schema, context }, wsServer)

  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use('/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, { context: async () => context })
  );

  const mainServer = httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
  })

  let listenerArticlePublished: ArticlePublishedListener | null = null;
  try {
    const { schema } = require('../graphql/schema');
    const apolloClient = new ApolloClient({
      ssrMode: true,
      link: new SchemaLink({
        schema,
        context: async () => ({ prisma })
      }),
      cache: new InMemoryCache()
    });

    // Start listener on rabbit to consume
    listenerArticlePublished = new ArticlePublishedListener(rabbitWrapper.client, apolloClient);
    listenerArticlePublished.listen();


  } catch (error) {
    console.error("Rabbit connect status:", error);
  }

  let closed: boolean[] = [false, false, false];
  process.on('SIGINT', async function () {
    try {
      !closed[0] && mainServer.close(async (err) => {
        console.log('Closing  http listener', err);
        closed[0] = true;
      })
      await server.stop();
      listenerArticlePublished && !closed[1] && await listenerArticlePublished.close();
      closed[1] = true;
      await rabbitWrapper.disconnect();
    } catch (err) {
      console.log('Process exit', err);
    }
  })

};

start().then(() => {
  console.log("Started");
});
