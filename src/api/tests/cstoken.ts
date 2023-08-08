import { createTestContext } from './__helpers';

const ctx = createTestContext({ portRange: { from: 4000, to: 6000 } });

import { NexusGenFieldTypes } from '../../generated/nexus-typegen';

it('ensures that a token request is created for a client', async () => {

  // Create the artilce for testing
  // const createArticle: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`
  //   mutation {
  //     createArticle(slug: "what-s-inside-a-black-hole") {
  //       slug
  //       id
  //     }
  //   }
  // `);

  // Create a new client token request record for enter CS
  const createRequestCS: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`
    mutation {
      createRequestToken(sourceIp: "5020", originatorIp: "5020", parentIp: "5010") {  
        id
        message
        publishedAt 
        article {
          slug
        }
      }
    }
  `);

    // Create a new client token message to deferred ip when leave CS
    // Is Root node and has token now (part of acquireCS for a nodeIp)
    // parentIp: is the originator
    const createLeaveToDeferredCS: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`
    mutation {
      createAcquireToken(sourceIp: "5020", parentIp: "5010") {  
        id
        message
        publishedAt 
        article {
          slug
        }
      }
    }
  `);

    // Create a new client token message to deferred ip when leave CS
    // Is Root node and has token now (part of acquireCS for a nodeIp)
    // parentIp: is the originator
    const createRelayRequestToNewParnetSourceCS: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`
    mutation {
      createRequestToken(sourceIp: "5020", parentIp: "5010", originatorIp: "5020") {  
        id
        message
        publishedAt 
        article {
          slug
        }
      }
    }
  `);

  // Should have article in db before saving
  expect(createComment.createComment.article).toMatchInlineSnapshot(`
{
  "slug": "what-s-inside-a-black-hole",
}
`);

  const persistedData = await ctx.prisma.blogComment.findMany();
  expect(persistedData.length).toMatchInlineSnapshot(`1`);
});

it('list all commments for an article', async () => {

  await Promise.all([...Array(4).keys()].map(async () => {
    await ctx.client.request(`
      mutation {
        createComment(message: "Is it made", articleSlug: "what-s-inside-a-black-hole") {  
          id
          message
          publishedAt 
          article {
            slug
          }
        }
      }
    `);

  }));


  const articleCommentsResult: NexusGenFieldTypes["Query"] = await ctx.client.request(`     
      query BlogCommentsByArticle($articleSlug: String!) {
        blogCommentsByArticle(articleSlug: $articleSlug) {
          message
          publishedAt
        }
      }
      `,
    { articleSlug: "what-s-inside-a-black-hole" });

  // Snapshot of published query
  expect(articleCommentsResult.blogCommentsByArticle?.length).toMatchInlineSnapshot(`4`);


});


