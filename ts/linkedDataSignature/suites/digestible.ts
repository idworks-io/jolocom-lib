import { IDigestible, ILinkedDataSignatureAttrs } from '../types'
import { sha256 } from '../../utils/crypto'
import { canonize } from 'jsonld'
import { EcdsaLinkedDataSignature } from './ecdsaKoblitzSignature2016'
import { keyIdToDid } from '../../utils/helper'
import { ISigner } from '../../registries/types'

interface SignedData {
  proof: ILinkedDataSignatureAttrs
}

export class Digestible implements IDigestible {
  public data: SignedData
  private proof: EcdsaLinkedDataSignature

  public constructor(data: SignedData) {
    this.data = data
    this.proof = EcdsaLinkedDataSignature.fromJSON(data.proof)
  }

  public get signer(): ISigner {
    return {
      did: keyIdToDid(this.proof.creator),
      keyId: this.proof.creator,
    }
  }

  public get signature(): string {
    return this.proof.signature
  }

  public async digest(): Promise<Buffer> {
    const normalized = await this.normalize()

    const docSectionDigest = sha256(Buffer.from(normalized))
    const proofSectionDigest = await this.proof.digest()

    return sha256(Buffer.concat([proofSectionDigest, docSectionDigest]))
  }

  public async normalize(): Promise<string> {
    const json = Object.assign({}, this.data)
    delete json.proof
    return canonize(json)
  }
}
