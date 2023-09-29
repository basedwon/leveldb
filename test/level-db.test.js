const LevelDB = require('../lib/level-db')

describe('LevelDB', () => {
  let dbInstance

  before(async () => {
    dbInstance = new LevelDB(true)
    await dbInstance.isReady()
  })

  after(async () => {
    await dbInstance.clear()
  })

  describe('isReady()', () => {
    it('should be ready after initialization', async () => {
      try {
        await dbInstance.isReady()
        expect(true).to.be.true
      } catch (error) {
        expect.fail('isReady promise was not fulfilled')
      }
    })
  })

  describe('put()', () => {
    it('should put data into the DB', async () => {
      await dbInstance.put('key', 'value')
      const value = await dbInstance.get('key')
      expect(value).to.equal('value')
    })
  })

  describe('get()', () => {
    it('should get data from the DB', async () => {
      await dbInstance.put('key', 'value')
      const value = await dbInstance.get('key')
      expect(value).to.equal('value')
    })
  })

  describe('del()', () => {
    it('should delete data from the DB', async () => {
      await dbInstance.put('key', 'value')
      await dbInstance.del('key')
      const value = await dbInstance.get('key')
      expect(value).to.be.null
    })
  })

  describe('exists()', () => {
    it('should return true for an existing key', async () => {
      await dbInstance.put('key', 'value')
      const exists = await dbInstance.exists('key')
      expect(exists).to.be.true
    })

    it('should return false for a non-existing key', async () => {
      const exists = await dbInstance.exists('nonExistingKey')
      expect(exists).to.be.false
    })
  })

  describe('clear()', () => {
    it('should clear the DB', async () => {
      await dbInstance.put('key', 'value')
      await dbInstance.clear()
      const value = await dbInstance.get('key')
      expect(value).to.be.null
    })
  })

  describe('batch()', () => {
    it('should batch multiple operations', async () => {
      await dbInstance.batch([
        { type: 'put', key: 'key1', value: 'value1' },
        { type: 'put', key: 'key2', value: 'value2' }
      ])

      const value1 = await dbInstance.get('key1')
      const value2 = await dbInstance.get('key2')

      expect(value1).to.equal('value1')
      expect(value2).to.equal('value2')
    })
  })

  describe('sub()', () => {
    it('should create a sublevel', () => {
      const subDb = dbInstance.sub('sub')
      expect(subDb).to.be.instanceOf(LevelDB)
    })
  })

  describe('collect()', () => {
    it('should collect data from a read stream', async () => {
      await dbInstance.put('key', 'value')
      const collected = await dbInstance.collect('read')
      expect(collected).to.deep.equal([{ key: 'key', value: 'value' }])
    })
  })

  describe('createReadStream()', () => {
    it('should create a readable stream', () => {
      const stream = dbInstance.createReadStream()
      expect(stream).to.exist
    })
  })

  describe('createKeyStream()', () => {
    it('should create a key stream', () => {
      const stream = dbInstance.createKeyStream()
      expect(stream).to.exist
    })
  })

  describe('createValueStream()', () => {
    it('should create a value stream', () => {
      const stream = dbInstance.createValueStream()
      expect(stream).to.exist
    })
  })

  describe('iterator()', () => {
    it('should iterate over keys', async () => {
      await dbInstance.put('key1', 'value1')
      await dbInstance.put('key2', 'value2')

      const results = []
      for await (const [key, value] of dbInstance.iterator()) {
        results.push({ key, value })
      }

      expect(results).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' }
      ])
    })
  })

  describe('listAll()', () => {
    it('should list all key-value pairs', async () => {
      // In your actual test, you might need to mock `_.print`
      await dbInstance.put('key1', 'value1')
      await dbInstance.put('key2', 'value2')
      
      // Test that listAll() lists all key-value pairs (mock or spy `_.print` to verify)
      // ...
    })
  })
})
