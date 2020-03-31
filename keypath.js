const ref = require('ref')
const Struct = require('ref-struct')
const {Str_t} = require('./str.js')

exports.Keypath = Struct({ 
    path1: 'int',
	path2: 'int',
	path3: 'int',
	path4: 'int',
	path5: 'int',
	hd1: 'int',
	hd2: 'int',
	hd3: 'int',
	hd4: 'int',
	hd5: 'int',
	symbol: ref.refType(Str_t)
})