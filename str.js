const Struct = require('ref-struct')

exports.Str_t = Struct({ 
    refNum: 'uint16',
    size: 'uint32',
    capacity: 'uint32',
	str: 'string'
})