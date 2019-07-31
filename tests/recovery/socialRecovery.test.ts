import { SocialRecovery } from '../../ts/recovery/socialRecovery'
import { expect } from 'chai'
import { testDID32, testSecret32, testShares } from '../data/recovery.data'

describe('Social Recovery', () => {
  it('should create and combine', function() {
    const shards = 255
    const threshold = 50
    const horcruxes = SocialRecovery.createShards(
      testDID32,
      testSecret32,
      shards,
      threshold,
    )

    const { did, secret } = SocialRecovery.combineShard(
      horcruxes.slice(0, threshold),
    )
    expect(secret).to.equal(testSecret32)
    expect(did).to.equal(testDID32)
  })

  it('should create shares correctly', () => {
    const horcruxes = SocialRecovery.createShards(testDID32, testSecret32, 5, 3)
    console.log(horcruxes)
    expect(horcruxes.length).to.equal(5)
  })

  it('should combine shares correctly', () => {
    const { did, secret } = SocialRecovery.combineShard(testShares.slice(0, 3))
    expect(secret).to.equal(testSecret32)
    expect(did).to.equal(testDID32)
  })

  it('should fail if not enough shares are presented', () => {
    expect(() =>
      SocialRecovery.combineShard([testShares[0], testShares[1]]),
    ).to.throw()
  })

  it('should validate a shard', () => {
    const result = SocialRecovery.validateShard(testShares[0])
    expect(result).to.be.true
  })
})
