const ffi = require('ffi')
const ref = require('ref')
const path = require('path')
const RefArray = require('ref-array')
const Struct = require('ref-struct')
const Union = require('ref-union')
const {Str_t} = require('./str.js')
const {Keypath} = require('./keypath.js')
const {Netparams} = require('./netparams.js')

const Pointer_t = Struct({ 
    data: ref.refType(ref.types.void),
	destroy: ffi.Function(ref.types.void, [ref.refType(ref.types.void)])
})


const Obj_t = Struct({ 
    refNum: 'uint16',
    magic: 'uint16',
    emitter: ref.refType(ref.types.void)
})

const Union_Value = Union({
        i8: 'int8',
        u8: 'uint8',
	    i16: 'int16',
		u16: 'uint16',
		i32: 'int32',
		u32: 'uint32',
		i64: 'int64',
		u64: 'uint64',
		f32: 'float',
		f64: 'double',
		ptr: Pointer_t,
		str: ref.refType(Str_t),
		obj: ref.refType(Obj_t)
    })

const Value_t = Struct({ 
    typ: 'uint32',
	value: Union_Value
})

const Array_t = Struct({ 
    data: ref.refType(Value_t),
    size: 'uint32',
    capacity: 'uint32'
})

const Map_t = Struct({ 
    array: ref.refType(Array_t)
})


const Encrypted_data = Struct({ 
	initialisationVector : ref.refType(Array_t),
	encryptedBytes : ref.refType(Array_t)
})

const Btseed = Struct({ 
	seed : ref.refType(Array_t),
	mnemonicCode : ref.refType(Array_t),
	encryptedMnemonicCode : Encrypted_data,
	encryptedSeed : Encrypted_data,
	creationTimeSeconds: 'long',
	pwdhash: ref.refType(Str_t),
	randomSalt: ref.refType(Array_t)
})

const Btwallet = Struct({ 
	btSeed : ref.refType(Btseed),
	pubkey : ref.refType(Str_t),
	address : ref.refType(Str_t),
	symbol : ref.refType(Str_t)
})

var iopath = path.join(__dirname, '/native/libcoinapi-nojni.dll');
const CoinApi = ffi.Library(iopath, {
    'init': [ref.refType(ref.types.long), []],
	'cleanup': ['void', [ref.refType(ref.types.long)]],
	'createAllCoinMnemonicCode': ['string', [ref.refType(ref.types.long)]],
	'netparams_init': ['void', [ref.refType(Netparams)]],
	'btwallet_init': ['void', [ref.refType(Btwallet)]],
	'keypath_init': ['void', [ref.refType(Keypath)]],
	'str_create': [ref.refType(Str_t), ['string', 'uint32', 'uint32']],
	'createWallet': ['int', [ref.refType(ref.types.long), 'string', 'string', ref.refType(Netparams), ref.refType(Btwallet)]],
	'getPriKeyFromBtSeed': ['string', [ref.refType(ref.types.long), ref.refType(Btseed), 'string', ref.refType(Netparams)]],
});

module.exports={
	Btwallet: Btwallet,
	CoinApi: CoinApi,
	Btseed: Btseed
}
