var io = require('socket.io').listen(12345);
var mgmt = io.of('/management')
var monitor = io.of('/monitor')

var monitors = []
var mgmtSock = null

monitor.on('connection', function (socket) {
	monitors.push(socket)
	console.log('mon -> mgmt')
	console.log(socket)
	if (mgmtSock != null)
		mgmtSock.emit('monitor_connection', socket.id)
	socket.emit('monitor_id', socket.id)
})

mgmt.on('connection', function(socket) {
	mgmtSock = socket
	socket.on('command', function(data) {
		for (var i = 0; i < monitors.length; i++) {
			var socket = monitors[i]
			socket.emit('command', data)
		}
	})
})