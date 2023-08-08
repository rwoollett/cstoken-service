<h1 align="center">GraphQL backend stack</h1>

<br />
The Backend GraphQL uses Nexus schema and Prisma for the SQL database.

<br />

# 🚀 Available Scripts

In the project directory, you can run:

<br />

## ⚡️ dev

```
npm run dev
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
Open [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql) to view playground.

<br />

```
npm run gqlgen
```

Runs the graphql queries hooks and typedefs code generator.\
Create .graphql files in src/graphql/queries and gqlren creates generated hooks and typedefs.

<br />

## 🧪 test

```
npm run test
```
Launches the test runner.

<br />

## 🦾 build

```
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles NextJS in production mode and optimizes the build for the best performance.

<br />

## 🧶 lint

```
npm run lint
```

<br />

# 🧬 Project structure

This is the structure of the files in the project:

```sh
    │
    ├── src                     # source files
    │   ├── api
    │   │   ├── tests           # Tests for GraphQL resolvers
    │   │   │   ├── __helpers.ts
    │   │   │   ├── blogs.test.ts
    │   │   │   └── posts.test.ts   
    │   │   ├── context.ts      # Nexus schema for local Apollo GraphQL
    │   │   └── server.ts       # Entry point to server
    │   ├── events              # Folder for message events
    │   ├── generated           # Apollo code generation of typedef and hooks from *.graphql files.
    │   ├── graphql             # GraphQL typedefs and reducers
    │   │   ├── queries         # Qraphql queries use with apps Apollo client
    │   │   │   ├── blogcomment.graphql       
    │   │   │   └── post.graphql  
    │   │   ├── resolvers       # Local schema resolvers for qraphql
    │   │   │   ├── blogs.ts    # Blogs   
    │   │   │   └── posts.ts    # Post query resolvers used in Post typedefs
    │   │   ├── types           # store's actions
    │   │   │   ├── blogs.ts    # Blogs
    │   │   │   ├── index.ts    # index for all typedefs (used in schema.ts)
    │   │   │   └── posts.ts    # Post type defs
    │   │   └── schema.ts       # Apollo Server local schema
    │   ├── lib                 # Apollo client/server and Prisma client
    │   │   ├── apolloClient.ts # Apollo client (For external and local graph cache)
    │   │   ├── apolloServer.ts # Apollo server (local)
    │   │   ├── prismaClient.ts # Prisma client
    │   │   └── rabbitWrapper.ts # RabbitMQ 
    │   ├── prisma
    │   │   ├── migrations
    │   │   ├── schema.prisma   # Prisma SQL schema
    │   │   └── seed.ts         # Seed file for tests on dev SQL source
    │   └── codegen.ts      # Grapgh ql queries hooks and types generator codegen runner
    ├── .dockerignore
    ├── .env
    ├── .env.local
    ├── .eslintrc.js
    ├── .gitignore
    ├── jest.config.js          # Jest testing
    ├── package.json
    ├── README.md
    └── tsconfig.json
```
