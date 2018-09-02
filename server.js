const express = require('express');
const Pusher = require('pusher');
const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });

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

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function increment() {
  const number = getRandomNumber(0, poll.length);
  poll[number].votes += 20;
}

function updatePoll() {
  setInterval(() => {
    increment();
    pusher.trigger('poll-channel', 'update-poll', {
      poll
    });
  }, 1000);
}

const app = express();

app.get('/poll', (req, res) => {
  res.json(poll);
  updatePoll();
});

app.listen(3000, () => {
  console.log(`App running on port 3000`);
});
