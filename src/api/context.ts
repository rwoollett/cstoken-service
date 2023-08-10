import { PrismaClient } from "../lib/prismaClient";
import { AMQPPubSub } from 'graphql-amqp-subscriptions';

export interface Context {
  prisma: PrismaClient;
  pubsub: AMQPPubSub|null;
}

export interface TestingContext {
  prisma: PrismaClient;
}
