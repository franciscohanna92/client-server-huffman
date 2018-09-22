const net = require('net');
const IP = '127.0.0.1';
const PORT = 1337;
const Huffman = new require('./huffman');

var huffman = new Huffman()

const server = net.createServer(function(socket) {
	log('Client connected');

	// Handler for incoming data event in client socket
	socket.on('data', function(data) {
		let messageBytesLength = data.byteLength;
		log(`Message length ${messageBytesLength} Bytes`);
		log(`Decoded message: ${huffman.decode(data)}`)
		socket.write('ACK')
	});

	// Handler for error event in client socket
	socket.on('error', function(err) {
		if(err.code == 'ECONNRESET'){
			log('Connection closed abruptly.');
		}
		else{
			console.log(err);
		}
	});

	// Handler for close event in client socket
	socket.on('close', function() {
		log('Client disconnected');
	});
});

// Make the server listen in socket IP:PORT
server.listen(1337, '127.0.0.1', function(){
	log(`Server listening on port ${PORT}`);
});

function log(message) {
  console.log(`${new Date().toISOString()} ${message}`)
}