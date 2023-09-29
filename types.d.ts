declare class LevelDB {
  static DB_NAME: string
  static DB_PREFIX: string
  static instance: LevelDB

  constructor(opts?: any, ...args: any[])
  
  client: any
  opts: any
  root: any
  _ready: Promise<void>

  isReady(): Promise<void>
  _connect(): Promise<void>
  _disconnect(): Promise<void>
  getNativeConnection(): Promise<any>
  setOpts(opts: any): void
  _setOpts(opts: any, defaults?: any): any
  _getDbPath(opts?: any): string
  _keyTransform(key: any): any
  _putValue(value: any, key: any): any
  _getValue(value: any, key: any): any
  _delKey(key: any): any
  _isChildKey(key: any): boolean
  on(event: string, handler: Function): void
  once(event: string, handler: Function): void
  emit(event: string, payload: any): void
  clear(): Promise<void>
  createReadStream(opts?: any): any
  createKeyStream(opts?: any): any
  createValueStream(opts?: any): any
  exists(key: any): Promise<boolean>
  iterator(opts?: any): AsyncGenerator<[any, any], void, unknown>
  put(key: any, value: any, opts?: any): Promise<void>
  get(key: any, opts?: any): Promise<any>
  del(key: any, opts?: any): Promise<void>
  listAll(all?: boolean): Promise<void>
  sub(path: any, opts?: any): any
  batch(ops: any): Promise<any[]>
  collect(type: any, opts?: any): any
}

export = LevelDB
