import {
  intArg,
  list,
  nonNull,
  objectType,
  stringArg
} from 'nexus';
import { extendType } from 'nexus'
import {
  createDraftResolver,
  getDraftsResolver,
  getPostsResolver,
  publishResolver
} from '../resolvers/posts';

export const Post = objectType({
  name: 'Post',            // <- Name of your type
  definition(t) {
    t.int('id')            // <- Field named `id` of type `Int`
    t.string('title')      // <- Field named `title` of type `String`
    t.string('body')       // <- Field named `body` of type `String`
    t.boolean('published') // <- Field named `published` of type `Boolean`
  },
});

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('drafts', {
      type: nonNull(list('Post')),
      resolve: getDraftsResolver
    });
    t.list.field('posts', {
      type: 'Post',
      resolve: getPostsResolver
    })
  }
})

export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createDraft', {
      type: 'Post',
      args: {
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve: createDraftResolver
    });
    t.nonNull.field('publish', {
      type: 'Post',
      args: {
        draftId: nonNull(intArg()),
      },
      resolve: publishResolver
    });
  },
})