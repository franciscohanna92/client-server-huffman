const net = require('net');
const Huffman = new require('./huffman');

const IP = '127.0.0.1';
const PORT = 1337;

const stdin = process.stdin;
const stdout = process.stdout;

var huffman = new Huffman()

// Create new socket object for client
var client = new net.Socket();

// Opens the connection for socket IP:PORT
client.connect(PORT, IP, () => {
	console.log(`${new Date().toISOString()} Connected to server`);

	// First message after connection
	stdout.write('Type a message and press ENTER to send it: ');
});

// Handler for incoming data event in client socket
client.on('data', (data) => {
	console.log('Echo from server: ' + data);
	stdout.write('\r\rMessage to send: ');
});

// Handler for close event in client socket
client.on('close', () => {
	client.end();
	process.exit();
});

// Handler for error event in client socket
client.on('error', (err) => {
	if(err.code == 'ECONNRESET'){
		console.log('\n\nConnection closed abruptly!');
		console.log('Disconnected from server.');
	}
	else{
		console.log(err);
	}
});

// Handler for incoming data on the standard input
stdin.on('data', (buffer) => {
  let plainMessage = buffer.toString().trim();
	let encodedMessage = huffman.encode(plainMessage)
	client.write(plainMessage)
	client.write(encodedMessage)
});