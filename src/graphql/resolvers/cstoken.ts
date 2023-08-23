import { FieldResolver } from "nexus";

export const getClientsResolver: FieldResolver<
  "Query",
  "getClients"
> = async (_, { }, { prisma, pubsub }) => {
  const clients = await prisma.client.findMany({
    select: {
      id: true,
      ip: true,
      name: true,
      connected: true,
      RequestParent: true,
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

export const createRequestCSResolver: FieldResolver<
  "Mutation", "createRequestCS"
> = async (_, { sourceIp, parentIp, relayed }, { prisma, pubsub }) => {
  const newRequestCS = await prisma.requestCS.create({
    data: {
      sourceIp,
      parentIp,
      relayed
    }
  });

  // pubsub && pubsub.publish('commentAdded',
  //   {
  //     subject: Subjects.CommentCreated,
  //     data: {
  //       ...newComment,
  //       publishedAt: newComment.publishedAt.toISOString()
  //     }
  //   } as CommentCreatedEvent);

  return {
    id: newRequestCS.id,
    requestedAt: newRequestCS.requestedAt.toISOString(),
    relayed,
    sourceIp: newRequestCS.sourceIp,
    parentIp: newRequestCS.parentIp
  }
};

export const createAcquireCSResolver: FieldResolver<
  "Mutation", "createAcquireCS"
> = async (_, { ip, sourceIp }, { prisma, pubsub }) => {
  const newAcquireCS = await prisma.acquireCS.create({
    data: {
      ip,
      sourceIp,
    }
  });

  // pubsub && pubsub.publish('commentAdded',
  //   {
  //     subject: Subjects.CommentCreated,
  //     data: {
  //       ...newComment,
  //       publishedAt: newComment.publishedAt.toISOString()
  //     }
  //   } as CommentCreatedEvent);

  return {
    id: newAcquireCS.id,
    ip: newAcquireCS.ip,
    sourceIp: newAcquireCS.sourceIp,
    acquiredAt: newAcquireCS.acquiredAt.toISOString()
  }
};

// export const newCommentResolver = (payload: CommentCreatedEvent) => {
//   const { data: comment } = payload;
//   return {
//     id: comment.id,
//     message: comment.message,
//     publishedAt: comment.publishedAt,
//     article: {
//       slug: comment.articleSlug
//     }
//   };
// };
