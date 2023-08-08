import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  require: ["ts-node/register"],
  generates: {
    'src/generated/graphql-local.ts': {
      schema: "src/graphql/schema.ts",
      documents: "src/graphql/queries/**/*.graphql",
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ]
    },
  },
};
export default config;