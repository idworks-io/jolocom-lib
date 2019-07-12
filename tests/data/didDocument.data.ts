import { defaultContextIdentity } from '../../ts/utils/contexts'

export const mockDid =
  'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777'
export const mockIpfsHash = 'QmZCEmfiKZhRPB88cEqmcHzQu6siSmVpieG6HTQse4e4Js'
export const mockKeyId = `${mockDid}#keys-1`
export const mockKeyId2 = `${mockDid}#keys-2`
export const mockPublicKeyHex =
  '03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551'

/* JSON form to ensure toJSON and fromJSON work as intended */

export const didDocumentJSONv0 = {
  authentication: [
    {
      publicKey: mockKeyId,
      type: 'Secp256k1SignatureAuthentication2018',
    },
  ],
  publicKey: [
    {
      id: mockKeyId,
      type: 'Secp256k1VerificationKey2018',
      owner: mockDid,
      publicKeyHex: mockPublicKeyHex,
    },
  ],
  service: [
    {
      id: `${mockDid};jolocomPubProfile`,
      type: 'JolocomPublicProfile',
      serviceEndpoint: `ipfs://${mockIpfsHash}`,
      description: 'Verifiable Credential describing entity profile',
    },
  ],
  created: '1970-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    creator: mockKeyId,
    nonce: '1842fb5f567dd532',
    signatureValue:
      '297a9806c9178be6e733e5b77cb8473f9d02c0f7dca88dc84b40bf78f4085ba57c07aeba2e5c33ce7fea9a4e7fd0c71625c2dc26c2a57ee91797cc2655ee3054',
    created: '1970-01-01T00:00:00.000Z',
  },
  '@context': [
    {
      id: '@id',
      type: '@type',
      dc: 'http://purl.org/dc/terms/',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      schema: 'http://schema.org/',
      sec: 'https://w3id.org/security#',
      didv: 'https://w3id.org/did#',
      xsd: 'http://www.w3.org/2001/XMLSchema#',

      AuthenticationSuite: 'sec:AuthenticationSuite',
      CryptographicKey: 'sec:Key',
      LinkedDataSignature2016: 'sec:LinkedDataSignature2016',

      authentication: 'sec:authenticationMethod',
      created: { '@id': 'dc:created', '@type': 'xsd:dateTime' },
      creator: { '@id': 'dc:creator', '@type': '@id' },
      digestAlgorithm: 'sec:digestAlgorithm',
      digestValue: 'sec:digestValue',
      domain: 'sec:domain',
      entity: 'sec:entity',
      expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
      name: 'schema:name',
      nonce: 'sec:nonce',
      normalizationAlgorithm: 'sec:normalizationAlgorithm',
      owner: { '@id': 'sec:owner', '@type': '@id' },
      privateKey: { '@id': 'sec:privateKey', '@type': '@id' },
      proof: 'sec:proof',
      proofAlgorithm: 'sec:proofAlgorithm',
      proofType: 'sec:proofType',
      proofValue: 'sec:proofValue',
      publicKey: {
        '@id': 'sec:publicKey',
        '@type': '@id',
        '@container': '@set',
      },
      publicKeyHex: 'sec:publicKeyHex',
      requiredProof: 'sec:requiredProof',
      revoked: { '@id': 'sec:revoked', '@type': 'xsd:dateTime' },
      signature: 'sec:signature',
      signatureAlgorithm: 'sec:signatureAlgorithm',
      signatureValue: 'sec:signatureValue',
    },
  ],
  id: mockDid,
}

export const didDocumentJSON = {
  specVersion: 0.13,
  authentication: [
    mockKeyId,
    {
      id: mockKeyId2,
      type: 'Secp256k1VerificationKey2018',
      controller: mockDid,
      publicKeyHex: mockPublicKeyHex,
    },
  ],
  publicKey: [
    {
      id: mockKeyId,
      type: 'Secp256k1VerificationKey2018',
      controller: mockDid,
      publicKeyHex: mockPublicKeyHex,
    },
  ],
  service: [
    {
      id: `${mockDid}#jolocomPubProfile`,
      type: 'JolocomPublicProfile',
      serviceEndpoint: 'ipfs://QmZCEmfiKZhRPB88cEqmcHzQu6siSmVpieG6HTQse4e4Js',
      description: 'Verifiable Credential describing entity profile',
    },
  ],
  created: '1970-01-01T00:00:00.000Z',
  updated: '1970-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    creator: mockKeyId,
    nonce: '1842fb5f567dd532',
    signatureValue:
      '3e4bca6a08643c4a67c02abd109accd19f2f9ad1c93cd9f39d3f23edc122de7a72d1de44420b456c20b1875ed254417efdf8dd16fb8ded818d830dac475ec55a',
    created: '1970-01-01T00:00:00.000Z',
  },
  '@context': defaultContextIdentity,
  id: mockDid,
}

export const normalizedDidDocument =
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#jolocomPubProfile> <http://schema.org/description> "Verifiable Credential describing entity profile" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#jolocomPubProfile> <https://w3id.org/security#dfn-service-endpoints> "ipfs://QmZCEmfiKZhRPB88cEqmcHzQu6siSmVpieG6HTQse4e4Js" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> <https://w3id.org/security#controller> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> <https://w3id.org/security#publicKeyHex> "03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-2> <https://w3id.org/security#controller> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-2> <https://w3id.org/security#publicKeyHex> "03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <http://purl.org/dc/terms/created> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <http://schema.org/version> "1.3E-1"^^<http://www.w3.org/2001/XMLSchema#double> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/did#updated> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#authenticationMethod> "did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#authenticationMethod> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-2> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#publicKey> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#service-endpoints> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#jolocomPubProfile> .\n'
