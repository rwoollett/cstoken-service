import { createTestContext } from './__helpers';

const ctx = createTestContext({ portRange: { from: 4000, to: 6000 } });

import { NexusGenFieldTypes } from '../../generated/nexus-typegen';

it('ensures that a token request is created for a client', async () => {

  await ctx.prisma.requestParent.create({
    data: {
      clientIp: "5010",
    }
  });
  await ctx.prisma.requestParent.create({
    data: {
      clientIp: "5020",
    }
  });
  await ctx.prisma.client.create({
    data: {
      ip: "5020",
      name: "Lemon",
      connected: false,
      parentIp: "5010"
    }
  });

  // Create a new client token request record for enter CS
  const createRequestCS: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`
    mutation {
      createRequestCS(sourceIp: "5020", parentIp: "5010", relayed: false) {  
        id
        relayed
        requestedAt
        sourceIp
        parentIp
      }
    }
  `);

  // Create a new client token message for an originator of CS, when received as Parent node and not
  // owning token. So relay message for originator.
  const createRelayRequestToNewParnetSourceCS: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`
    mutation {
      createRequestCS(sourceIp: "5020", parentIp: "5010", relayed: true) {  
        id
        relayed
        requestedAt
        sourceIp
        parentIp
      }
    }
  `);

  // // Create a new client token message to deferred ip when leave CS
  // // Is Root node and has token now (part of acquireCS for a nodeIp)
  // // parentIp: is the originator
  // const createAcquireCS: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`
  //   mutation {
  //     createAcquireCS(ip: "5010", sourceIp: "5020") {  
  //       id
  //       acquiredAt
  //       ip
  //       sourceIp
  //     }
  //   }
  // `);


  // Should have article in db before saving
  expect(createRequestCS.createRequestCS.parentIp).toMatchInlineSnapshot(`"5010"`);
  expect(createRequestCS.createRequestCS.sourceIp).toMatchInlineSnapshot(`"5020"`);

  const persistedData = await ctx.prisma.requestCS.findMany();
  expect(persistedData.length).toMatchInlineSnapshot(`2`);
});
