require('dotenv').config({ path: 'config.env' });
const express = require('express');
const cors = require('cors');
var Pusher = require('pusher');

var pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});

// pusher.trigger('my-channel', 'my-event', {
//   message: 'hello world'
// });

const poll = [
  {
    name: 'Chelsea',
    votes: 100
  },
  {
    name: 'Arsenal',
    votes: 70
  },
  {
    name: 'Livepool',
    votes: 250
  },
  {
    name: 'Manchester City',
    votes: 689
  },
  {
    name: 'Manchester United',
    votes: 150
  }
];

const app = express();

app.use(cors);

app.get('/poll', (req, res) => {
  res.json(poll);
});

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), '127.0.0.1', () => {
  console.log(
    `Express running -> PORT ${server.address().address}:${
      server.address().port
    }`
  );
});
