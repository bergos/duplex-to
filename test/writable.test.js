const assert = require('assert')
const getStream = require('get-stream')
const isStream = require('isstream')
const { describe, it } = require('mocha')
const duplexToWritable = require('../writable')
const { PassThrough } = require('readable-stream')

describe('writable', () => {
  it('should be a function', () => {
    assert.strictEqual(typeof duplexToWritable, 'function')
  })

  it('should return a stream', () => {
    const result = duplexToWritable(new PassThrough())

    assert(isStream(result))
  })

  it('should wrap only the writable interface', () => {
    const result = duplexToWritable(new PassThrough())

    assert(!isStream.isReadable(result))
    assert(!result.readable) // used by stream.finished
    assert(isStream.isWritable(result))
    assert(result.writable) // used by stream.finished
  })

  it('should keep object mode information', () => {
    const result = duplexToWritable(new PassThrough({ objectMode: true }))

    assert(result._writableState.objectMode)
  })

  it('should forward the content', async () => {
    const output = new PassThrough()
    const input = duplexToWritable(output)

    input.write('a')
    input.write('b')
    input.end('c')

    const result = await getStream(output)

    assert.strictEqual(result, 'abc')
  })
})
