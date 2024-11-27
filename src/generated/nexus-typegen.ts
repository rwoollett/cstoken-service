/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../api/context"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  RangePort: { // input type
    from: number; // Int!
    to: number; // Int!
  }
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  AcquireCS: { // root type
    acquiredAt: string; // String!
    id: number; // Int!
    ip: string; // String!
    sourceIp: string; // String!
  }
  Client: { // root type
    connected: boolean; // Boolean!
    id: number; // Int!
    ip: string; // String!
    name: string; // String!
    requestParent: NexusGenRootTypes['RequestParent']; // RequestParent!
  }
  ConnectedClient: { // root type
    connectedAt: string; // String!
    sourceIp: string; // String!
  }
  Mutation: {};
  Query: {};
  RequestCS: { // root type
    id: number; // Int!
    parentIp: string; // String!
    relayed: boolean; // Boolean!
    requestedAt: string; // String!
    sourceIp: string; // String!
  }
  RequestParent: { // root type
    clientIp: string; // String!
    id: number; // Int!
  }
  Subscription: {};
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  AcquireCS: { // field return type
    acquiredAt: string; // String!
    id: number; // Int!
    ip: string; // String!
    sourceIp: string; // String!
  }
  Client: { // field return type
    connected: boolean; // Boolean!
    id: number; // Int!
    ip: string; // String!
    name: string; // String!
    requestParent: NexusGenRootTypes['RequestParent']; // RequestParent!
  }
  ConnectedClient: { // field return type
    connectedAt: string; // String!
    sourceIp: string; // String!
  }
  Mutation: { // field return type
    connectClientCS: NexusGenRootTypes['ConnectedClient']; // ConnectedClient!
    createAcquireCS: NexusGenRootTypes['AcquireCS']; // AcquireCS!
    createClient: NexusGenRootTypes['Client']; // Client!
    createRequestCS: NexusGenRootTypes['RequestCS']; // RequestCS!
  }
  Query: { // field return type
    getClients: Array<NexusGenRootTypes['Client'] | null>; // [Client]!
    getRequestCS: Array<NexusGenRootTypes['RequestCS'] | null>; // [RequestCS]!
  }
  RequestCS: { // field return type
    id: number; // Int!
    parentIp: string; // String!
    relayed: boolean; // Boolean!
    requestedAt: string; // String!
    sourceIp: string; // String!
  }
  RequestParent: { // field return type
    clientIp: string; // String!
    id: number; // Int!
  }
  Subscription: { // field return type
    clientCS_Connected: NexusGenRootTypes['ConnectedClient'] | null; // ConnectedClient
    requestCS_Created: NexusGenRootTypes['RequestCS'] | null; // RequestCS
  }
}

export interface NexusGenFieldTypeNames {
  AcquireCS: { // field return type name
    acquiredAt: 'String'
    id: 'Int'
    ip: 'String'
    sourceIp: 'String'
  }
  Client: { // field return type name
    connected: 'Boolean'
    id: 'Int'
    ip: 'String'
    name: 'String'
    requestParent: 'RequestParent'
  }
  ConnectedClient: { // field return type name
    connectedAt: 'String'
    sourceIp: 'String'
  }
  Mutation: { // field return type name
    connectClientCS: 'ConnectedClient'
    createAcquireCS: 'AcquireCS'
    createClient: 'Client'
    createRequestCS: 'RequestCS'
  }
  Query: { // field return type name
    getClients: 'Client'
    getRequestCS: 'RequestCS'
  }
  RequestCS: { // field return type name
    id: 'Int'
    parentIp: 'String'
    relayed: 'Boolean'
    requestedAt: 'String'
    sourceIp: 'String'
  }
  RequestParent: { // field return type name
    clientIp: 'String'
    id: 'Int'
  }
  Subscription: { // field return type name
    clientCS_Connected: 'ConnectedClient'
    requestCS_Created: 'RequestCS'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    connectClientCS: { // args
      sourceIp: string; // String!
    }
    createAcquireCS: { // args
      ip: string; // String!
      sourceIp: string; // String!
    }
    createClient: { // args
      connected: boolean; // Boolean!
      ip: string; // String!
      name: string; // String!
    }
    createRequestCS: { // args
      parentIp: string; // String!
      relayed: boolean; // Boolean!
      sourceIp: string; // String!
    }
  }
  Query: {
    getClients: { // args
      range: NexusGenInputs['RangePort']; // RangePort!
    }
    getRequestCS: { // args
      ip: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}