const { _, log, Evented, Pipe } = require('basd')
const { Level } = require('level') // https://github.com/Level/abstract-leveldown
const { EntryStream, KeyStream, ValueStream } = require('level-read-stream')
const Nested = require('@basd/nested')
const Storage = require('@plaindb/storage')

/**
 * LevelDB class extends Storage and provides various database operations 
 * like connect, disconnect, get, put, etc.
 * It wraps around the Level library and provides a unified interface.
 */
class LevelDB extends Nested.mixin(Storage) {
  /**
   * Get default database name.
   * @returns {string} Default database name.
   */
  static get DB_NAME() { return '.db' }
  static get DB_PREFIX() { return '' }

  /**
   * Creates a new LevelDB instance.
   * @param {Object} [opts={}] - Options for the LevelDB instance.
   * @param {...*} args - Additional arguments.
   */
  constructor(opts = {}, ...args) {
    if (opts instanceof LevelDB) return opts
    super(opts, ...args)
    if (_.isBool(opts)) opts = { reset: opts }
    opts = this._setOpts(opts, {
      dbName: this.constructor.DB_NAME,
      dbPrefix: this.constructor.DB_PREFIX,
    })
    // singleton
    if (!opts.client) {
      if (this.constructor.instance) return this.constructor.instance
      this.constructor.instance = this
    }
    // get db
    let db = opts.client
    if (!db) {
      if (_.isBrowser) db = new Level(opts.dbName, opts)
      else db = new Level(_.mkdir(this._getDbPath(opts)), opts)
      db.setMaxListeners(20) // because they open each sublevel w an event
    }
    this.client = db
    _.objProp(this, 'opts', _.omit(opts, ['dbName', 'dbPrefix']), { writable: true })
    _.objProp(this, '_ready', this.root.connect())
  }

  /**
   * Checks if the database is ready.
   * @async
   */
  async isReady() {
    await this._ready
  }

  /**
   * Establishes the database connection.
   * @private
   * @async
   */
  async _connect() {
    const opts = this.opts
    const reset = !!opts.reset && !opts.client
    this.opts = _.omit(opts, ['reset'])
    return new Promise(async (resolve, reject) => {
      const finish = () => {
        if (reset) return this.clear().then(resolve).catch(reject)
        return resolve()
      }
      if (this.root.client.status === 'open') return finish()
      else if (this.root.client.status === 'opening') {
        return this.root.client.open({ passive: false }, err => {
          if (err) return reject(err)
          finish()
        })
      }
      reject(new Error(`database could not open -- status is ${this.root.client.status}`))
    })
  }

  /**
   * Closes the database connection.
   * @private
   * @async
   */
  async _disconnect() {
    await this.isReady()
    await this.root.client.close()
  }

  /**
   * Gets the native database connection.
   * @async
   * @returns {Object} The native database connection.
   */
  async getNativeConnection() {
    return this.client
  }

  /**
   * Updates the options for the LevelDB instance.
   * @param {Object} opts - New options to set.
   */
  setOpts(opts) {
    _.assign(this.opts, this._setOpts(opts, this.opts))
  }

  /**
   * Initializes options with defaults.
   * @private
   * @param {Object} opts - Options to initialize.
   * @param {Object} [defaults={}] - Default options.
   * @returns {Object} Initialized options.
   */
  _setOpts(opts, defaults = {}) {
    opts = _.defaults(opts, {
      separator: '!',
      keyEncoding: 'utf8',
      valueEncoding: 'msgpack',
      ...defaults
    })
    if (opts.keyEncoding === 'lexint') {
      opts.keyEncoding = {
        type: 'lexicographic-integer/hex',
        encode: data => _.lexint.pack(data, 'hex'),
        decode: _.lexint.unpack,
        buffer: false
      }
    }
    if (opts.valueEncoding === 'msgpack') {
      opts.valueEncoding = {
        type: 'binary',
        encode: _.msgpack.encode,
        decode: _.msgpack.decode,
        buffer: true
      }
    }
    return opts
  }

  /**
   * Retrieves the database path based on the options provided.
   * @private
   * @param {Object} [opts={}] - Options to consider for retrieving the database path.
   * @returns {string} The database path.
   */
  _getDbPath(opts = {}) {
    // return _.path.resolve('.db/level') // @tmp
    const name = opts.name === this.constructor.DB_NAME ? '.db' : opts.dbName
    const path = opts.dbPrefix === '' ? name : `${opts.dbPrefix}/${name}`
    return _.path.resolve(path)
  }

  /**
   * Transforms the given key before inserting or retrieving from the database.
   * @private
   * @param {string} key - The original key.
   * @returns {string} The transformed key.
   */
  _keyTransform(key) {
    return key
  }

  /**
   * Transforms the given value before inserting into the database.
   * @private
   * @param {*} value - The original value.
   * @param {string} key - The key associated with the value.
   * @returns {*} The transformed value.
   */
  _putValue(value, key) {
    return value
  }

  /**
   * Transforms the retrieved value before returning it to the caller.
   * @private
   * @param {*} value - The original value retrieved from the database.
   * @param {string} key - The key associated with the value.
   * @returns {*} The transformed value.
   */
  _getValue(value, key) {
    return value
  }

  /**
   * Transforms the key before deleting it from the database.
   * @private
   * @param {string} key - The original key.
   * @returns {string} The transformed key.
   */
  _delKey(key) {
    return key
  }

  /**
   * Checks if the given key is a child key.
   * @private
   * @param {string} key - The key to check.
   * @returns {boolean} True if it's a child key, otherwise false.
   */
  _isChildKey(key) {
    return _.isString(key) && key.startsWith(this.opts.separator)
  }

  /**
   * Adds a listener function to the end of the listeners array for the specified event.
   * @param {string} event - The event name to listen to.
   * @param {Function} handler - The listener function.
   */
  on(event, handler) {
    this.client.on(event, handler)
  }

  /**
   * Adds a one-time listener function for the event.
   * @param {string} event - The event name to listen to.
   * @param {Function} handler - The listener function.
   */
  once(event, handler) {
    this.client.once(event, handler)
  }

  /**
   * Emits an event and the associated payload.
   * @param {string} event - The event name to emit.
   * @param {*} payload - The data to emit.
   */
  emit(event, payload) {
    this.client.emit(event, payload)
  }

  /**
   * Clears all key-value pairs in the database.
   * @async
   * @returns {Promise<LevelDB>} A promise that resolves to the LevelDB instance after clearing the database.
   */
  async clear() {
    return new Promise(resolve => {
      this.once('clear', () => resolve(this))
      this.client.clear()
    })
  }

  /**
   * Creates a read stream for the database.
   * @param {Object} [opts={}] - Options for the read stream.
   * @returns {Stream} The read stream.
   */
  createReadStream(opts = {}) {
    const stream = new EntryStream(this.client, opts)
    if (opts.all) return stream
    return stream.pipe(Pipe(({ key, value }, pipe) => {
      if (!this._isChildKey(key)) pipe.push({ key, value })
    }))
  }

  /**
   * Creates a key stream for the database.
   * @param {Object} [opts={}] - Options for the key stream.
   * @returns {Stream} The key stream.
   */
  createKeyStream(opts = {}) {
    const stream = new KeyStream(this.client, opts)
    if (opts.all) return stream
    return stream.pipe(Pipe((key, pipe) => {
      if (!this._isChildKey(key)) pipe.push(key)
    }))
  }

  /**
   * Creates a value stream for the database.
   * @param {Object} [opts={}] - Options for the value stream.
   * @returns {Stream} The value stream.
   */
  createValueStream(opts = {}) {
    if (opts.all) return new ValueStream(this.client, opts)
    const stream = new EntryStream(this.client, opts)
    return stream.pipe(Pipe(({ key, value }, pipe) => {
      if (!this._isChildKey(key)) pipe.push(value)
    }))
  }

  /**
   * Checks if a given key exists in the database.
   * @async
   * @param {string} key - The key to check.
   * @returns {Promise<boolean>} True if exists, false otherwise.
   */
  exists(key) {
    return new Promise((resolve, reject) => {
      this.createKeyStream({ gte: key, lte: key })
        .on('data', () => resolve(true))
        .on('error', reject)
        .on('end', () => resolve(false))
    })
  }

  /**
   * Iterates over key-value pairs in the database.
   * @async
   * @param {Object} [opts={}] - Options for the iterator.
   * @yields {string} Key-value pair.
   */
  async *iterator(opts = {}) {
    const transform = ([key, value]) => {
      const transformed = _.invoke(this.opts, 'keyEncoding.decode', key)
      if (!_.isNil(transformed)) key = transformed
      return [key, value]
    }
    if (opts.all) {
      for await (const item of this.client.iterator(opts))
        yield transform(item)
    } else {
      for await (const item of this.client.iterator(opts)) {
        if (!this._isChildKey(item[0]))
          yield transform(item)
      }
    }
  }

  /**
   * Inserts a new key-value pair into the database.
   * @async
   * @param {string} key - Key to insert.
   * @param {string|Object} value - Value to insert.
   * @param {Object} [opts] - Additional options for the insert operation.
   */
  put(key, value, opts) {
    key = this._keyTransform(key)
    opts = this._setOpts(this.opts, opts)
    return this.root.isReady()
      .then(() => _.respond(this._putValue(value, key)))
      .then(value => this.client.put(key, value, opts))
  }

  /**
   * Inserts a new key-value pair into the database.
   * @async
   * @param {string} key - Key to insert.
   * @param {string|Object} value - Value to insert.
   * @param {Object} [opts] - Additional options for the insert operation.
   */
  get(key, opts) {
    key = this._keyTransform(key)
    opts = this._setOpts(this.opts, opts)
    return this.isReady()
      .then(() => this.client.get(key, opts))
      .then(value => this._getValue(value, key))
      .catch(err => {
        if (err.notFound) return null
        throw err
      })
  }

  /**
   * Deletes a key-value pair from the database.
   * @async
   * @param {string} key - The key to delete.
   * @param {Object} [opts] - Additional options for the delete operation.
   */
  del(key, opts) {
    key = this._keyTransform(key)
    opts = this._setOpts(this.opts, opts)
    return this.isReady()
      .then(() => this.client.del(key, opts))
      // .then(() => _.respond(this._delKey(key))) // ?
      // .then(key => this.client.del(key, opts))
  }

  /**
   * Lists all key-value pairs in the database.
   * @async
   * @param {boolean} [all=true] - Whether to list all entries or not.
   */
  async listAll(all = true) {
    await this.isReady()
    for await (const [key, value] of this.iterator({ all }))
      _.print({ key, value })
  }

  /**
   * Creates a sub-database.
   * @param {string} path - The path for the sub-database.
   * @param {Object} [opts={}] - Additional options for the sub-database.
   * @returns {Object} The sub-database.
   */
  sub(path, opts = {}) {
    opts = this._setOpts(opts)
    return super.sub(path, (node, part) => ({
      ...opts,
      client: node.client.sublevel(part, opts)
    }))
  }

  /**
   * Executes a batch of database operations.
   * @async
   * @param {Array<Object>} [ops] - The operations to execute.
   * @returns {Promise<Array>} Array of results of the operations.
   */
  batch(ops) {
    if (!ops) return this.client.batch()
    const ROOT_KEY = '_root'
    const PATH_KEY = 'path'
    const SEPARATOR = '!'
    return this.isReady().then(() => {
      const dbs = { [ROOT_KEY]: [] }
      for (const op of ops) {
        const path = !_.isEmpty(op[PATH_KEY]) ? op[PATH_KEY] : [ROOT_KEY]
        const key = path.join(SEPARATOR)
        if (!dbs[key])
          dbs[key] = []
        dbs[key].push(_.omit(op, [PATH_KEY]))
      }
      const arr = []
      for (const [key, dbOps] of _.entries(dbs)) {
        const db = key === ROOT_KEY ? this.root : this.root.sub(key.split(SEPARATOR))
        arr.push(db.client.batch(dbOps))
      }
      return Promise.all(arr)
    })
  }

  /**
   * Collects data from a stream.
   * @param {string|boolean|Object} type - The type of stream to collect from.
   * @param {Object} [opts] - Additional options for collecting.
   * @returns {Promise<Array|Buffer>} Collected data.
   */
  collect(type, opts) {
    if (_.isBoolean(type)) {
      [type, opts] = [opts, { all: type }]
    } else if (_.isObj(type)) {
      [type, opts] = [opts, type]
    }
    opts = _.defaults(opts, this.opts)
    type = type ? type : opts.type ? opts.type : 'read'
    const stream = this[`create${_.ucf(type)}Stream`](opts)
    return Pipe.collect(stream, opts.format || 'array', opts.bytes)
  }
}

module.exports = LevelDB
