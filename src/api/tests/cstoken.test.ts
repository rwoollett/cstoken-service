import { createTestContext } from './__helpers';

const ctx = createTestContext({ portRange: { from: 4000, to: 6000 } });

import { NexusGenFieldTypes } from '../../generated/nexus-typegen';

it('returns list of clients', async () => {
  // Create two client

  await ctx.prisma.requestParent.create({
    data: {
      clientIp: "5510",
    }
  });
  await ctx.prisma.requestParent.create({
    data: {
      clientIp: "5520",
    }
  });
  await ctx.prisma.client.create({
    data: {
      ip: "5520",
      name: "Lemon",
      connected: false,
      parentIp: "5520"
    }
  });
  await ctx.prisma.client.create({
    data: {
      ip: "5510",
      name: "Pear",
      connected: false,
      parentIp: "5510"
    }
  });

  const getClients: NexusGenFieldTypes["Query"] = await ctx.client.request(`
  query GetClients($range: RangePort!) {
    getClients(range: $range) {
      ip
      name
      requestParent {
        clientIp
      }
    }
  }  `, {
    range: {
      from: 5510,
      to: 5520
    }
  });

  expect(getClients.getClients).toMatchInlineSnapshot(`
[
  {
    "ip": "5510",
    "name": "Pear",
    "requestParent": {
      "clientIp": "5510",
    },
  },
  {
    "ip": "5520",
    "name": "Lemon",
    "requestParent": {
      "clientIp": "5520",
    },
  },
]
`);

});

it('ensures that a token request is created for a client', async () => {

  await ctx.prisma.requestParent.create({
    data: {
      clientIp: "5510",
    }
  });
  await ctx.prisma.requestParent.create({
    data: {
      clientIp: "5520",
    }
  });
  await ctx.prisma.client.create({
    data: {
      ip: "5520",
      name: "Lemon",
      connected: false,
      parentIp: "5520"
    }
  });

  // Create a new client token request record for enter CS
  const createRequestCS: NexusGenFieldTypes["Mutation"] = await ctx.client.request(`
    mutation {
      createRequestCS(sourceIp: "5520", parentIp: "5510", relayed: false) {  
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
      createRequestCS(sourceIp: "5520", parentIp: "5510", relayed: true) {  
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
  expect(createRequestCS.createRequestCS.parentIp).toMatchInlineSnapshot(`"5510"`);
  expect(createRequestCS.createRequestCS.sourceIp).toMatchInlineSnapshot(`"5520"`);

  const persistedData = await ctx.prisma.requestCS.findMany();
  expect(persistedData.length).toMatchInlineSnapshot(`2`);
});
