import { Digestible } from '../../ts/linkedDataSignature/suites/digestible'
import {
  didDocumentJSON,
  didDocumentJSONv0,
  normalizedDidDocument,
} from '../data/didDocument.data'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { expect } from 'chai'
import { emailVerifiableCredential } from '../data/credential/signedCredential.data'
import { testPublicIdentityKey } from '../data/keys.data'

describe('Digestible', () => {
  it('should create Digest from DID Document JSON', async () => {
    const didDoc = new Digestible(didDocumentJSON)
    const digest = await didDoc.digest()
    expect(digest.toString('hex')).to.eq(
      '373e53dc5e50e853d3b101a320afe030a2df87511d582a5684830a5ab4d3947b',
    )
  })

  it('should verify Json DidDocument', async () => {
    const didDoc = new Digestible(didDocumentJSON)
    const isCorrect = await SoftwareKeyProvider.verifyDigestable(
      testPublicIdentityKey,
      didDoc,
    )
    expect(isCorrect).to.be.true
  })

  it('should verify Json Signed Credential', async () => {
    let credential = Object.assign({}, emailVerifiableCredential)
    credential.proof.signatureValue =
      'cd6897c4e5e9990ae290e67488adaecbc8264a5afcaa1f167e3f270aae627d0f165f5a1102eb49df7699d7f2d697d12c3f891f3ed5e6ba97a87704b3854eb57c'
    const signedCredential = new Digestible(credential)
    const isCorrect = await SoftwareKeyProvider.verifyDigestable(
      testPublicIdentityKey,
      signedCredential,
    )
    expect(isCorrect).to.be.true
  })

  it('should validate DID Document v0 correctly', async () => {
    const didDoc = new Digestible(didDocumentJSONv0)
    const isCorrect = await SoftwareKeyProvider.verifyDigestable(
      testPublicIdentityKey,
      didDoc,
    )
    expect(isCorrect).to.be.true
  })

  it('should implements normalize correctly', async () => {
    const digestible = new Digestible(didDocumentJSON)
    const norm = await digestible.normalize()
    expect(norm).to.deep.eq(normalizedDidDocument)
  })
})
