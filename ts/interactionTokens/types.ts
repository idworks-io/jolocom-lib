import {
  ClassType
} from 'class-transformer/ClassTransformer.d'

export interface IJWTHeader {
  alg: string
  typ: string
}

interface IPayload {
  iss?: string
  iat?: number
  typ: string
  [x: string]: any
}

export interface IJSONWebTokenAttrs {
  header: IJWTHeaderAttrs
  payload: IPayload
  signature: string
}

interface IJWTHeaderAttrs {
  alg: string
  typ: string
}

export interface IJWTEncodable { }

export enum InteractionType {
  CredentialRequest = 'credentialRequest',
  CredentialResponse = 'credentialResponse',
  CredentialsReceive = 'credentialsReceive',
  Authentication = 'authentication',
  CredentialOffer = 'credentialOffer',
  PaymentRequest = 'paymentRequest',
  PaymentResponse = 'paymentResponse',
}

export const InteractionTypeClassMap: {[key in InteractionType]?: ClassType<IJWTEncodable> } = { }

export function registerJWTEncodable(interactionType: InteractionType) {
  return function(constructor: ClassType<IJWTEncodable>) {
    InteractionTypeClassMap[interactionType] = constructor
  }
}
