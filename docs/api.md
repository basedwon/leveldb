<a name="LevelDB"></a>

## LevelDB
LevelDB class extends Storage and provides various database operations 
like connect, disconnect, get, put, etc.
It wraps around the Level library and provides a unified interface.

**Kind**: global class  

* [LevelDB](#LevelDB)
    * [new LevelDB([opts], ...args)](#new_LevelDB_new)
    * _instance_
        * [.isReady()](#LevelDB+isReady)
        * [.getNativeConnection()](#LevelDB+getNativeConnection) ⇒ <code>Object</code>
        * [.setOpts(opts)](#LevelDB+setOpts)
        * [.on(event, handler)](#LevelDB+on)
        * [.once(event, handler)](#LevelDB+once)
        * [.emit(event, payload)](#LevelDB+emit)
        * [.clear()](#LevelDB+clear) ⇒ [<code>Promise.&lt;LevelDB&gt;</code>](#LevelDB)
        * [.createReadStream([opts])](#LevelDB+createReadStream) ⇒ <code>Stream</code>
        * [.createKeyStream([opts])](#LevelDB+createKeyStream) ⇒ <code>Stream</code>
        * [.createValueStream([opts])](#LevelDB+createValueStream) ⇒ <code>Stream</code>
        * [.exists(key)](#LevelDB+exists) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.iterator([opts])](#LevelDB+iterator)
        * [.put(key, value, [opts])](#LevelDB+put)
        * [.get(key, value, [opts])](#LevelDB+get)
        * [.del(key, [opts])](#LevelDB+del)
        * [.listAll([all])](#LevelDB+listAll)
        * [.sub(path, [opts])](#LevelDB+sub) ⇒ <code>Object</code>
        * [.batch([ops])](#LevelDB+batch) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.collect(type, [opts])](#LevelDB+collect) ⇒ <code>Promise.&lt;(Array\|Buffer)&gt;</code>
    * _static_
        * [.DB_NAME](#LevelDB.DB_NAME) ⇒ <code>string</code>

<a name="new_LevelDB_new"></a>

### new LevelDB([opts], ...args)
Creates a new LevelDB instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> | <code>{}</code> | Options for the LevelDB instance. |
| ...args | <code>\*</code> |  | Additional arguments. |

<a name="LevelDB+isReady"></a>

### levelDB.isReady()
Checks if the database is ready.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  
<a name="LevelDB+getNativeConnection"></a>

### levelDB.getNativeConnection() ⇒ <code>Object</code>
Gets the native database connection.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  
**Returns**: <code>Object</code> - The native database connection.  
<a name="LevelDB+setOpts"></a>

### levelDB.setOpts(opts)
Updates the options for the LevelDB instance.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | New options to set. |

<a name="LevelDB+on"></a>

### levelDB.on(event, handler)
Adds a listener function to the end of the listeners array for the specified event.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name to listen to. |
| handler | <code>function</code> | The listener function. |

<a name="LevelDB+once"></a>

### levelDB.once(event, handler)
Adds a one-time listener function for the event.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name to listen to. |
| handler | <code>function</code> | The listener function. |

<a name="LevelDB+emit"></a>

### levelDB.emit(event, payload)
Emits an event and the associated payload.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name to emit. |
| payload | <code>\*</code> | The data to emit. |

<a name="LevelDB+clear"></a>

### levelDB.clear() ⇒ [<code>Promise.&lt;LevelDB&gt;</code>](#LevelDB)
Clears all key-value pairs in the database.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  
**Returns**: [<code>Promise.&lt;LevelDB&gt;</code>](#LevelDB) - A promise that resolves to the LevelDB instance after clearing the database.  
<a name="LevelDB+createReadStream"></a>

### levelDB.createReadStream([opts]) ⇒ <code>Stream</code>
Creates a read stream for the database.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  
**Returns**: <code>Stream</code> - The read stream.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> | <code>{}</code> | Options for the read stream. |

<a name="LevelDB+createKeyStream"></a>

### levelDB.createKeyStream([opts]) ⇒ <code>Stream</code>
Creates a key stream for the database.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  
**Returns**: <code>Stream</code> - The key stream.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> | <code>{}</code> | Options for the key stream. |

<a name="LevelDB+createValueStream"></a>

### levelDB.createValueStream([opts]) ⇒ <code>Stream</code>
Creates a value stream for the database.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  
**Returns**: <code>Stream</code> - The value stream.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> | <code>{}</code> | Options for the value stream. |

<a name="LevelDB+exists"></a>

### levelDB.exists(key) ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks if a given key exists in the database.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - True if exists, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to check. |

<a name="LevelDB+iterator"></a>

### levelDB.iterator([opts])
Iterates over key-value pairs in the database.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> | <code>{}</code> | Options for the iterator. |

<a name="LevelDB+put"></a>

### levelDB.put(key, value, [opts])
Inserts a new key-value pair into the database.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key to insert. |
| value | <code>string</code> \| <code>Object</code> | Value to insert. |
| [opts] | <code>Object</code> | Additional options for the insert operation. |

<a name="LevelDB+get"></a>

### levelDB.get(key, value, [opts])
Inserts a new key-value pair into the database.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key to insert. |
| value | <code>string</code> \| <code>Object</code> | Value to insert. |
| [opts] | <code>Object</code> | Additional options for the insert operation. |

<a name="LevelDB+del"></a>

### levelDB.del(key, [opts])
Deletes a key-value pair from the database.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to delete. |
| [opts] | <code>Object</code> | Additional options for the delete operation. |

<a name="LevelDB+listAll"></a>

### levelDB.listAll([all])
Lists all key-value pairs in the database.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [all] | <code>boolean</code> | <code>true</code> | Whether to list all entries or not. |

<a name="LevelDB+sub"></a>

### levelDB.sub(path, [opts]) ⇒ <code>Object</code>
Creates a sub-database.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  
**Returns**: <code>Object</code> - The sub-database.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>string</code> |  | The path for the sub-database. |
| [opts] | <code>Object</code> | <code>{}</code> | Additional options for the sub-database. |

<a name="LevelDB+batch"></a>

### levelDB.batch([ops]) ⇒ <code>Promise.&lt;Array&gt;</code>
Executes a batch of database operations.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Array of results of the operations.  

| Param | Type | Description |
| --- | --- | --- |
| [ops] | <code>Array.&lt;Object&gt;</code> | The operations to execute. |

<a name="LevelDB+collect"></a>

### levelDB.collect(type, [opts]) ⇒ <code>Promise.&lt;(Array\|Buffer)&gt;</code>
Collects data from a stream.

**Kind**: instance method of [<code>LevelDB</code>](#LevelDB)  
**Returns**: <code>Promise.&lt;(Array\|Buffer)&gt;</code> - Collected data.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> \| <code>boolean</code> \| <code>Object</code> | The type of stream to collect from. |
| [opts] | <code>Object</code> | Additional options for collecting. |

<a name="LevelDB.DB_NAME"></a>

### LevelDB.DB\_NAME ⇒ <code>string</code>
Get default database name.

**Kind**: static property of [<code>LevelDB</code>](#LevelDB)  
**Returns**: <code>string</code> - Default database name.  
