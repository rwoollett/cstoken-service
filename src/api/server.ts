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
import { PubSub } from 'graphql-subscriptions'; // inmemory pubsub 
import { prisma } from "../lib/prismaClient";

const PORT = process.env.PORT || 4000

const app = express()
const httpServer = createServer(app)

async function start() {

  const context: Context = {
    prisma: prisma,
    pubsub: new PubSub()
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


  let closed: boolean[] = [false, false, false];
  process.on('SIGINT', async function () {
    try {
      !closed[0] && mainServer.close(async () => {
        console.log('Closing  http listener');
        closed[0] = true;
      })
      await server.stop();
      closed[1] = true;
      //await rabbitWrapper.disconnect();
    } catch (err) {
      console.log('Process exit', err);
    }
  })

};

start().then(() => {
  console.log("Started");
}).catch((e) => {
  console.log(e);
});
