// tests/Post.test.ts
import { createTestContext } from './__helpers';
import { NexusGenFieldTypes } from '../../generated/nexus-typegen';

const ctx = createTestContext({ portRange: { from: 6001, to: 8000 } });


it('ensures that a draft can be created and published', async () => {
  // Create a new draft
  const draftResult: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`            # 1
    mutation {
      createDraft(title: "Nexus", body: "...") {  
        id
        title
        body
        published
      }
    }
  `);

  // Publish the previously created draft
  const publishResult = await ctx.client.request(`
    mutation publishDraft($draftId: Int!) {
      publish(draftId: $draftId) {
        title
        body
        published
      }
    }
  `,
    { draftId: draftResult.createDraft.id }
  );
  // Snapshot the published draft and expect `published` to be true
  expect(publishResult).toMatchInlineSnapshot(`
{
  "publish": {
    "body": "...",
    "published": true,
    "title": "Nexus",
  },
}
`);

  const persistedData = await ctx.prisma.post.findMany();
  expect(persistedData).toMatchInlineSnapshot(`
[
  {
    "body": "...",
    "id": 1,
    "published": true,
    "title": "Nexus",
  },
]
`);

});

it('ensures error is thrown when trying to publish non existing draft id', async () => {

  const action = async () => {
    await ctx.client.request(`
  mutation publishDraft($draftId: Int!) {
    publish(draftId: $draftId) {
      title
      body
      published
    }
  }
`,
      { draftId: 9999 }
    );
  };

  await expect(action()).rejects.toMatchInlineSnapshot(`[Error: Could not find draft with id 9999: {"response":{"errors":[{"message":"Could not find draft with id 9999","locations":[{"line":3,"column":5}],"path":["publish"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null,"status":200,"headers":{}},"request":{"query":"\\n  mutation publishDraft($draftId: Int!) {\\n    publish(draftId: $draftId) {\\n      title\\n      body\\n      published\\n    }\\n  }\\n","variables":{"draftId":9999}}}]`);

});

it('list all drafts', async () => {
  // Create a new draft

  await ctx.client.request(`
    mutation {
      createDraft(title: "Nexus", body: "...") {   
        title
        body
        published
      }
    }
  `);

  const draftsResult: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`            # 1
    query Drafts {
      drafts {
        body
        published
        title
      }
    }
  `);

  // Snapshot of drafts query
  expect(draftsResult).toMatchInlineSnapshot(`
{
  "drafts": [
    {
      "body": "...",
      "published": false,
      "title": "Nexus",
    },
  ],
}
`);
});

it('list all published', async () => {
  // Create a new draft

  await Promise.all([...Array(4).keys()].map( async () => {

    const draftResult: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`
      mutation {
        createDraft(title: "Nexus", body: "...") {       
          id
          title
          body
          published
        }
      }
    `);

    await ctx.client.request(`
      mutation publishDraft($draftId: Int!) {
        publish(draftId: $draftId) {
          title
          body
          published
        }
      }
     `,
      { draftId: draftResult.createDraft.id }
    );
  }));


  const publishedResult: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`     
    query Posts {
      posts {
        id
        body
        published
        title
      }
    }
  `);

  // Snapshot of published query
  expect(publishedResult).toMatchInlineSnapshot(`
{
  "posts": [
    {
      "body": "...",
      "id": 1,
      "published": true,
      "title": "Nexus",
    },
    {
      "body": "...",
      "id": 2,
      "published": true,
      "title": "Nexus",
    },
    {
      "body": "...",
      "id": 3,
      "published": true,
      "title": "Nexus",
    },
    {
      "body": "...",
      "id": 4,
      "published": true,
      "title": "Nexus",
    },
  ],
}
`);

  
});
