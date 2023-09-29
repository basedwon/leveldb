# LevelDB

[![npm](https://img.shields.io/npm/v/@plaindb/leveldb?style=flat&logo=npm)](https://www.npmjs.com/package/@plaindb/leveldb)
[![pipeline](https://gitlab.com/frenware/framework/plaindb/leveldb/badges/master/pipeline.svg)](https://gitlab.com/frenware/framework/plaindb/leveldb/-/pipelines)
[![license](https://img.shields.io/npm/l/@plaindb/leveldb)](https://gitlab.com/frenware/framework/plaindb/leveldb/-/blob/master/LICENSE)
[![downloads](https://img.shields.io/npm/dw/@plaindb/leveldb)](https://www.npmjs.com/package/@plaindb/leveldb) 

[![Gitlab](https://img.shields.io/badge/Gitlab%20-%20?logo=gitlab&color=%23383a40)](https://gitlab.com/frenware/framework/plaindb/leveldb)
[![Github](https://img.shields.io/badge/Github%20-%20?logo=github&color=%23383a40)](https://github.com/basedwon/leveldb)
[![Twitter](https://img.shields.io/badge/@basdwon%20-%20?logo=twitter&color=%23383a40)](https://twitter.com/basdwon)
[![Discord](https://img.shields.io/badge/Basedwon%20-%20?logo=discord&color=%23383a40)](https://discordapp.com/users/basedwon)

Provides a convenient wrapper around LevelDB for both server-side and client-side JavaScript. Extending basic LevelDB functionality, integrating seamlessly with emitted events and enabling a more straightforward and modular approach for database operations.

## Features

- Singleton pattern for database instances
- Easy-to-use asynchronous APIs
- Stream support for read and write operations
- Sub-levels for better data organization
- Custom encoding/decoding options
- Event emission and handling
- Batch operations

## Installation

Install the package with:

```bash
npm install @plaindb/leveldb
```

## Usage

First, import the `LevelDB` library.

```js
import LevelDB from '@plaindb/leveldb'
```
or
```js
const LevelDB = require('@plaindb/leveldb')
```

### Initialization

You can initialize a LevelDB instance as follows:

```js
const db = new LevelDB({
  dbName: 'myDatabase',
  dbPrefix: 'prefix',
  reset: true,
  separator: '!',
  keyEncoding: 'utf8',
  valueEncoding: 'msgpack'
})
```

### Constructor Options

When instantiating a `LevelDB` object, you can pass an options object as follows:

- **`dbName`**: (string) The name of the LevelDB database. Default is `'.db'`.
- **`dbPrefix`**: (string) A prefix to be used before the dbName. Default is `''` (empty string).
- **`client`**: (object) Custom Level client. If not provided, a new Level client will be created.
- **`reset`**: (boolean) If `true`, clears the database on instantiation. Default is `false`.
- **`separator`**: (string) The separator used for key names. Default is `'!'`.
- **`keyEncoding`**: (string | object) Encoding for keys. Default is `'utf8'`.
- **`valueEncoding`**: (string | object) Encoding for values. Default is `'msgpack'`.

### Putting Data

To insert data into the LevelDB database:

```js
await db.put('key', 'value')
```

### Getting Data

To retrieve data from the database:

```js
const value = await db.get('key')
```

### Deleting Data

To delete data:

```js
await db.del('key')
```

### Stream Operations

For large datasets, you can use streaming:

```js
const readStream = db.createReadStream()
readStream.on('data', data => {
  console.log(data)
})
```

### Sub-levels

You can create sub-levels for better data organization:

```js
const subDB = db.sub('subPath')
```

### Batch Operations

For performing multiple operations atomically:

```js
await db.batch([
  { type: 'put', key: 'key1', value: 'value1' },
  { type: 'del', key: 'key2' }
])
```

### Event Handling

You can also attach event listeners:

```js
db.on('put', (key, value) => {
  // Do something
})
```

## Documentation

- [API Reference](/docs/api.md)

## Tests

In order to run the test suite, simply clone the repository and install its dependencies:

```bash
git clone https://gitlab.com/frenware/framework/plaindb/leveldb.git
cd leveldb
npm install
```

To run the tests:

```bash
npm test
```

## Contributing

Thank you! Please see our [contributing guidelines](/docs/contributing.md) for details.

## License

LevelDB is [MIT licensed](https://gitlab.com/frenware/framework/plaindb/leveldb/-/blob/master/LICENSE).
