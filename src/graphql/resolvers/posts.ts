import { Post } from "@prisma/client";
import { FieldResolver } from "nexus";

export const getDraftsResolver: FieldResolver<
  "Query",
  "drafts"
> = async (_, __, { prisma }) => {
  return prisma.post.findMany({ where: { published: false } });
};

export const getPostsResolver: FieldResolver<
  "Query",
  "posts"
> = async (_, __, { prisma }) => {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { id: 'asc' }
  });
};


export const createDraftResolver: FieldResolver<
  "Mutation", "createDraft"
> = (_, { title, body }, { prisma }) => {
  const draft = {
    title,
    body,
    published: false,
  }
  return prisma.post.create({ data: draft });
};

export const publishResolver: FieldResolver<
  "Mutation", "publish"
> = async (_, { draftId }, { prisma }) => {

  const draftToPublish = await prisma.post.findFirst({
    where: {
      id: draftId
    }
  });
  if (!draftToPublish) {
    return Promise.reject(new Error(`Could not find draft with id ${draftId}`));
  }

  return prisma.post.update({
    where: { id: draftId },
    data: {
      published: true
    }
  });
};
