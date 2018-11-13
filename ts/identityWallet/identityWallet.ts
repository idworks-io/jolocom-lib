import { BaseMetadata } from 'cred-types-jolocom-core'
import { Credential } from '../credentials/credential/credential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { IIdentityWalletCreateArgs } from './types'
import { Identity } from '../identity/identity'
import { JSONWebToken, JWTEncodable } from '../interactionTokens/JSONWebToken'
import { InteractionType } from '../interactionTokens/types'
import { CredentialOffer } from '../interactionTokens/credentialOffer'
import { ICredentialRequestAttrs, ICredentialOfferAttrs } from '../interactionTokens/interactionTokens.types'
import { Authentication, IAuthenticationAttrs } from '../interactionTokens/authentication'
import { ICredentialResponseAttrs } from '../interactionTokens/interactionTokens.types'
import { CredentialRequest } from '../interactionTokens/credentialRequest'
import { CredentialResponse } from '../interactionTokens/credentialResponse'
import { IVaultedKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { IKeyMetadata, ISignedCredCreationArgs } from '../credentials/signedCredential/types'
import { keyIdToDid, getIssuerPublicKey, handleValidationStatus } from '../utils/helper'
import { generateRandomID } from '../utils/crypto'
import { JolocomRegistry, createJolocomRegistry } from '../registries/jolocomRegistry'

/*
 * Developer facing class with initialized instance of the key provider as member.
 * Encapsulates functionality related to creating and signing credentials and
 * interaction tokens
 */

export class IdentityWallet {
  private _identity: Identity
  private _publicKeyMetadata: IKeyMetadata
  private _vaultedKeyProvider: IVaultedKeyProvider

  get did(): string {
    return this.identity.did
  }

  set did(did: string) {
    this.identity.did = did
  }

  get identity() {
    return this._identity
  }

  set identity(identity: Identity) {
    this._identity = identity
  }

  get didDocument() {
    return this.identity.didDocument
  }

  get publicKeyMetadata(): IKeyMetadata {
    return this._publicKeyMetadata
  }

  set publicKeyMetadata(metadata: IKeyMetadata) {
    this._publicKeyMetadata = metadata
  }

  private get vaultedKeyProvider() {
    return this._vaultedKeyProvider
  }

  private set vaultedKeyProvider(keyProvider: IVaultedKeyProvider) {
    this._vaultedKeyProvider = keyProvider
  }

  /*
   * @constructor
   * @param identity - Instance of identity class, contains did document and public profile
   * @param publicKeyMetadata - Public key id and derivation path
   * @param vaultedKeyProvider - Vaulted key store for generating signatures
   * @returns {Object} - Instance of class
   */

  constructor({ identity, publicKeyMetadata, vaultedKeyProvider }: IIdentityWalletCreateArgs) {
    if (!identity || !publicKeyMetadata || !vaultedKeyProvider) {
      throw new Error('Missing argunments! Expected identity, publicKeyMetadata, and vaulterKeyProvider')
    }

    this.identity = identity
    this.publicKeyMetadata = publicKeyMetadata
    this.vaultedKeyProvider = vaultedKeyProvider
  }

  /*
   * @description - Creates and signs a verifiable credential
   * @param params - Credential creation attributes, including claim, context, subject
   * @param pass - Password to decrypt the vaulted seed
   * @returns {Object} -  Instance of SignedCredential class
   */

  private createSignedCred = async <T extends BaseMetadata>(params: ISignedCredCreationArgs<T>, pass: string) => {
    const { derivationPath } = this.publicKeyMetadata

    const vCred = await SignedCredential.create(
      {
        subject: params.subject || this.did,
        ...params
      },
      {
        keyId: this.publicKeyMetadata.keyId,
        issuerDid: this.did
      }
    )

    const signature = await this.vaultedKeyProvider.signDigestable({ derivationPath, encryptionPass: pass }, vCred)
    vCred.signature = signature.toString('hex')
    return vCred
  }

  /*
   * @description - Creates and signs an authentication request / response
   * @param authArgs - Authentication  creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - optional received authentication JSONWebToken Class
   * @returns {Object} -  Instance of Authentication class
   */

  private createAuth = async (
    authArgs: IAuthenticationAttrs,
    pass: string,
    receivedJWT?: JSONWebToken<JWTEncodable>
  ) => {
    const authenticationReq = Authentication.fromJSON(authArgs)
    const jwt = JSONWebToken.fromJWTEncodable(authenticationReq)
    jwt.interactionType = InteractionType.Authentication
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass, receivedJWT)
  }

  /*
   * @description - Creates and signs a credential offer request / response
   * @param credOffer - Credential offer creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - optional received credential offer JSONWebToken Class
   * @returns {Object} -  Instance of CredentialOffer class
   */

  private createCredOffer = async (
    credOffer: ICredentialOfferAttrs,
    pass: string,
    receivedJWT?: JSONWebToken<JWTEncodable>
  ) => {
    const offer = CredentialOffer.fromJSON(credOffer)
    const jwt = JSONWebToken.fromJWTEncodable(offer)
    jwt.interactionType = InteractionType.CredentialOffer
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass, receivedJWT)
  }

  /*
   * @description - Creates and signs a crededential request
   * @param credReq - Credential request creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @returns {Object} -  Instance of CredentialRequest class
   */

  private createCredReq = async (credReq: ICredentialRequestAttrs, pass: string) => {
    const credentialRequest = CredentialRequest.fromJSON(credReq)
    const jwt = JSONWebToken.fromJWTEncodable(credentialRequest)
    jwt.interactionType = InteractionType.CredentialRequest
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)
  }

  /*
   * @description - Creates and signs a credential response
   * @param credResp - Credential response creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - received credential request JSONWebToken Class
   * @returns {Object} -  Instance of credential response class
   */

  private createCredResp = async (
    credResp: ICredentialResponseAttrs,
    pass: string,
    receivedJWT: JSONWebToken<JWTEncodable>
  ) => {
    const credentialResponse = CredentialResponse.fromJSON(credResp)
    const jwt = JSONWebToken.fromJWTEncodable(credentialResponse)
    jwt.interactionType = InteractionType.CredentialResponse
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass, receivedJWT)
  }

  /*
   * @description - Initializes the JWT Class with required fields (exp, iat, iss, typ) and adds a signature
   * @param jwt - JSONWebToken Class
   * @param derivationPath - Derivation Path for identity keys
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - optional received JSONWebToken Class
   * @returns {Object} -  Instance of JWT class which is initialized and has a signature
   */

  private async initializeAndSign<T extends JWTEncodable>(
    jwt: JSONWebToken<T>,
    derivationPath: string,
    pass: string,
    receivedJWT?: JSONWebToken<T>
  ) {
    jwt.setIssueAndExpiryTime()
    jwt.issuer = this.publicKeyMetadata.keyId
    
    receivedJWT ? (jwt.audience = keyIdToDid(receivedJWT.issuer)) : null
    receivedJWT ? (jwt.nonce = receivedJWT.nonce) : (jwt.nonce = generateRandomID(8))

    const signature = await this.vaultedKeyProvider.signDigestable({ derivationPath, encryptionPass: pass }, jwt)
    jwt.signature = signature.toString('hex')

    return jwt
  }

  public async validateJWT<T extends JWTEncodable>(receivedJWT: JSONWebToken<T>, sendJWT?: JSONWebToken<T>, customRegistry?: JolocomRegistry): Promise<void> {
    const registry = customRegistry || createJolocomRegistry()
    const remoteIdentity = await registry.resolve(keyIdToDid(receivedJWT.issuer))
    const pubKey  = getIssuerPublicKey(receivedJWT.issuer, remoteIdentity.didDocument)
 
    handleValidationStatus(await this.vaultedKeyProvider.verifyDigestable(pubKey, receivedJWT), 'sig')
    sendJWT && handleValidationStatus(receivedJWT.audience === this.identity.did, 'aud')
    sendJWT && handleValidationStatus(sendJWT.nonce === receivedJWT.nonce, 'nonce')
  }

  /* Gathering creation methods in an easier to use public interface */

  public create = {
    credential: Credential.create,
    signedCredential: this.createSignedCred,
    interactionTokens: {
      request: {
        auth: this.createAuth,
        offer: this.createCredOffer,
        share: this.createCredReq
      },
      response: {
        auth: this.createAuth,
        offer: this.createCredOffer,
        share: this.createCredResp
      }
    }
  }
}
