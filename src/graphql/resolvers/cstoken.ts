import { eq } from "lodash";
import { FieldResolver } from "nexus";
import {
  AcquireCSCreatedEvent,
  ClientCSConnectedEvent,
  RequestCSCreatedEvent,
  Subjects
} from "../../events";

export const getClientsResolver: FieldResolver<
  "Query",
  "getClients"
> = async (_, { range }, { prisma, pubsub }) => {
  const clients = await prisma.client.findMany({
    select: {
      id: true,
      ip: true,
      name: true,
      connected: true,
      RequestParent: true,
    },
    where: {
      ip: {
        lte: range.to.toString(),
        gte: range.from.toString()
      }
    }
  });

  return [...clients].map((client) => (
    {
      ...client, requestParent: {
        id: client.RequestParent.id,
        clientIp: client.RequestParent.clientIp
      }
    }
  ));
};

export const createClientResolver: FieldResolver<
  "Mutation", "createClient"
> = async (_, { ip, name, connected }, { prisma, pubsub }) => {

  const isParentRecord = await prisma.requestParent.findFirst({
    where: { clientIp: ip }
  });
  if (isParentRecord === null) {
    await prisma.requestParent.create({
      data: { clientIp: ip }
    });
  }
  const parentRecord = await prisma.requestParent.findFirstOrThrow({
    where: { clientIp: ip }
  });

  const newClient = await prisma.client.create({
    data: {
      ip,
      name,
      connected,
      parentIp: ip
    }
  });

  return {
    id: newClient.id,
    ip,
    name,
    connected,
    requestParent: {
      id: parentRecord.id,
      clientIp: parentRecord.clientIp
    }
  }
};

export const connectClientCSResolver: FieldResolver<
  "Mutation", "connectClientCS"
> = async (_, { sourceIp }, { pubsub }) => {

  const connectedAt = new Date().toISOString();

  pubsub && pubsub.publish(Subjects.ClientCSConnected,
    {
      subject: Subjects.ClientCSConnected,
      data: { sourceIp, connectedAt }
    } as ClientCSConnectedEvent);

  return { sourceIp, connectedAt }
};

export const createRequestCSResolver: FieldResolver<
  "Mutation", "createRequestCS"
> = async (_, { sourceIp, parentIp, relayed }, { pubsub }) => {
  const requestedAt = new Date().toISOString();

  pubsub && pubsub.publish(Subjects.RequestCSCreated,
    {
      subject: Subjects.RequestCSCreated,
      data: { sourceIp, parentIp, requestedAt, relayed }
    } as RequestCSCreatedEvent);

  return { sourceIp, parentIp, requestedAt, relayed }
};


export const createAcquireCSResolver: FieldResolver<
  "Mutation", "createAcquireCS"
> = async (_, { ip, sourceIp }, { pubsub }) => {
  const acquiredAt = new Date().toISOString();

  pubsub && pubsub.publish(Subjects.AcquireCSCreated,
    {
      subject: Subjects.AcquireCSCreated,
      data: { ip, sourceIp, acquiredAt }
    } as AcquireCSCreatedEvent);

  return { ip, sourceIp, acquiredAt }
};

export const subcribeConnectedCSResolver = (payload: ClientCSConnectedEvent) => {
  const { sourceIp, connectedAt } = payload.data;
  return { sourceIp, connectedAt };
};

export const subcribeRequestCSResolver = (payload: RequestCSCreatedEvent) => {
  const { data: requestCS } = payload;
  return {
    sourceIp: requestCS.sourceIp,
    parentIp: requestCS.parentIp,
    requestedAt: requestCS.requestedAt,
    relayed: requestCS.relayed
  };
};

export const subcribeAcquireCSResolver = (payload: AcquireCSCreatedEvent) => {
  const { data: acquireCS } = payload;
  return {
    ip: acquireCS.ip,
    sourceIp: acquireCS.sourceIp,
    acquiredAt: acquireCS.acquiredAt
  };
};

