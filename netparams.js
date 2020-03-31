const ref = require('ref')
const Struct = require('ref-struct')
const {Str_t} = require('./str.js')
const {Keypath} = require('./keypath.js')

exports.Netparams = Struct({ 
	symbol : ref.refType(Str_t),
	coinType : 'int',
	nettype : 'int',
	keyPath : Keypath, 
	version : 'uint32',

	HDprivate: 'uint32',
	HDpublic: 'uint32',
	P2KH: 'uint32',
	P2SH: 'uint32',
	keyprefixes: 'uint8',

	ApiVersion: 'uint16',

	N: 'uint32',
	R: 'uint32',
	P: 'uint32'
})