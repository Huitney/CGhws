const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

/*
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  console.log ('send index.html');
});
*/

app.get('/ctrl', (req, res) => {
	res.sendFile(__dirname + '/ctrl-hw2.html');
	console.log ('send ctrl-hw2.html');
});

app.get('/scene', (req, res) => {
	res.sendFile(__dirname + '/hw2.html');
	console.log ('send hw2.html');
});

io.on('connection', (socket) => {
	socket.on('angle from ctrl', msg => {
		console.log ('from ctrl angle: ' + msg);
		socket.broadcast.emit ('angle sent', msg);  // to all others    
	});
	
	socket.on('value from ctrl', msg => {
		console.log ('from ctrl value: ' + msg);
		socket.broadcast.emit ('value sent', msg);  // to all others    
	});
});

http.listen(port, () => {
	console.log(`Socket.IO server running at http://localhost:${port}/`);
});
