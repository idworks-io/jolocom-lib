import * as chai from 'chai'
import * as sinon from 'sinon'
import * as crypto from 'crypto'
import { publicProfileCredJSON } from '../data/identity'
import { DidDocument } from '../../ts/identity/didDocument'
import { testPublicIdentityKey } from '../data/keys'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { didDocumentJSON } from '../data/didDocument'
const expect = chai.expect

describe('Identity', () => {
  const sandbox = sinon.createSandbox()
  let clock
  let referenceDidDocument: DidDocument

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox.stub(crypto, 'randomBytes').returns(Buffer.from('1842fb5f567dd532', 'hex'))
    referenceDidDocument = DidDocument.fromPublicKey(testPublicIdentityKey)
  })

  after(() => {
    sandbox.restore()
    clock.restore()
  })

  it('Should correctly instantiate from did document', () => {
    const didDocFromJSON = DidDocument.fromJSON(didDocumentJSON)
    expect(referenceDidDocument).to.deep.eq(didDocFromJSON)
  })

  it('Should correctly implement toJSON', () => {
    expect(referenceDidDocument.toJSON()).to.deep.eq(didDocumentJSON)
  })

  it('Non trivial getters should work', () => {
    expect(referenceDidDocument.getSigner()).to.deep.eq({
      did: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
      keyId: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1'
    })
  })

  describe('Public Profile', () => {
    const referencePublicProfileDoc = SignedCredential.fromJSON(publicProfileCredJSON)
    beforeEach(() => {

    })

    it('Should correctly set public profile', () => {

    })
    it('Should correctly get public profile')
    it('Should correctly remove public profile')
  })
})
