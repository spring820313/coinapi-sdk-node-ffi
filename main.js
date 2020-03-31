const {
    app,
    BrowserWindow
} = require('electron')
const path = require('path')
const url = require('url')
const ref = require('ref')
const ffi = require('ffi')
const RefArray = require('ref-array')
const Struct = require('ref-struct')
const Union = require('ref-union')
const user32 = require('./dll.js').User32
//const coinapi = require('./coinapi.js').CoinApi
const {CoinApi} = require('./coinapi.js')
const {Keypath} = require('./keypath.js')
const {Netparams} = require('./netparams.js')
const {Coinapi, Btwallet} = require('./coinapi.js')


function createWindow() {
	console.log('hhhhhh')
    //创建浏览器窗口
    win = new BrowserWindow({
        width: 800,
        height: 600,
		show: false,
		webPreferences:{
			nodeIntegration:true
		}
    })

	win.webContents.openDevTools()
    //让浏览器加载index.html
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
	
	win.on('closed', function() {
    // 解除窗口对象的引用，通常而言如果应用支持多个窗口的话，你会在一个数组里
    // 存放窗口对象，在窗口关闭的时候应当删除相应的元素。
    win = null;
	});
	
	win.once('ready-to-show', () => {
		/*
		console.log('hhhhhh')
        let hwnd = win.getNativeWindowHandle() //获取窗口句柄。
        user32.GetSystemMenu(hwnd.readUInt32LE(0), true); //禁用系统菜单.
        win.show()
		*/
		/*
		const buf = new Buffer(4) // 初始化一个无类型的指针
		buf.writeInt32LE(12345, 0) // 写入值 12345

		console.log(buf.hexAddress()) // 获取地址 hexAddress

		buf.type = ref.types.int // 设置 buf 对应的 C 类型，可以通过修改`type`来实现 C 的强制类型转换
		console.log(buf.deref()) // deref()获取值 12345

		const pointer = buf.ref() // 获取指针的指针，类型为`int **`

		console.log(pointer.deref().deref())  // deref()两次获取值 12345
		*/
		
		var s = '123'
		var ss = CoinApi.str_create(s, s.length, s.length)
		console.log(ss.deref().size)
		
		console.log(Keypath)
		
		var btc = "BTC"
		var keyPath = new Keypath();
		CoinApi.keypath_init(keyPath.ref())
		keyPath.hd1 = 1
		keyPath.hd2 = 1
		keyPath.hd3 = 1
		keyPath.hd4 = 0
		keyPath.hd5 = 0
		keyPath.symbol = CoinApi.str_create(btc, btc.length, btc.length)
		keyPath.path1 = 44
		keyPath.path2 = 0
		keyPath.path3 = 0
		keyPath.path4 = 0
		keyPath.path5 = 0
		
		var netparam = new Netparams();
		CoinApi.netparams_init(netparam.ref())
		
		netparam.symbol = CoinApi.str_create(btc, btc.length, btc.length)
		netparam.coinType = 1
		netparam.version = 2
		netparam.ApiVersion = 2
		netparam.nettype = 1
        netparam.HDprivate = 0x0488ADE4
        netparam.HDpublic = 0x0488B21E
        netparam.P2KH = 38
        netparam.P2SH = 80
        netparam.keyprefixes = 128
		netparam.keyPath = keyPath
		
		var btwallet = new Btwallet()
		CoinApi.btwallet_init(btwallet.ref())
		
		var hUnit = CoinApi.init()
		console.log(hUnit)
		
		var mnemonic = CoinApi.createAllCoinMnemonicCode(hUnit)
		console.log(mnemonic)
		
		var ret = CoinApi.createWallet(hUnit, mnemonic, '12345', netparam.ref(), btwallet.ref())
		console.log(ret)
		console.log(btwallet.address.deref().str)
		console.log(btwallet.pubkey.deref().str)
		
		var privkey = CoinApi.getPriKeyFromBtSeed(hUnit, btwallet.btSeed, '12345', netparam.ref())
		console.log(privkey)
		
		CoinApi.cleanup(hUnit)

		win.show()
    })

}

//执行
app.on('ready', createWindow)

app.on('window-all-closed', function() {
  // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});