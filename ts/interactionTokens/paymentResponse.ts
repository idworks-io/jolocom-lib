import { classToPlain, plainToClass, Expose, Exclude } from 'class-transformer'
import { IJWTEncodable, registerJWTEncodable, InteractionType } from './types';
import { IPaymentResponseAttrs } from './interactionTokens.types'

/**
 * @class
 * Class representing a payment response. Encodable in JWT
 */

@Exclude()
@registerJWTEncodable(InteractionType.PaymentResponse)
export class PaymentResponse implements IJWTEncodable {
  private _txHash: string

  @Expose()
  get txHash(): string {
    return this._txHash
  }

  /**
   * Set the transaction hash
   * @example
   */

  set txHash(txHash: string) {
    this._txHash = txHash
  }

  /**
   * Serializes the {@link PaymentResponse} response as JSON-LD
   */

  public toJSON(): IPaymentResponseAttrs {
    return classToPlain(this) as IPaymentResponseAttrs
  }

  /**
   * Instantiates a {@link PaymentResponse} from it's JSON form
   * @param json - JSON encoded payment request / response
   */

  public static fromJSON(json: IPaymentResponseAttrs) {
    return plainToClass(this, json) as PaymentResponse
  }
}
