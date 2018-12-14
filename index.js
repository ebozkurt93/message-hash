const express = require('express');
const { sha256 } = require('js-sha256');

const app = express();
const port = 80;

const storage = {}; // key: hash, value: message
const storageReversed = {}; // key: message, value: hash

messageToHash = message => {
  if (message in storageReversed) return storageReversed[message];
  hashed = sha256(message);
  storage[hashed] = message;
  storageReversed[message] = hashed;
  return hashed;
};

app.use(express.json());

app.get('/all', (req, res) => res.send(JSON.stringify(storage, null, 4)));

app.post('/messages/:m', (req, res) => {
  var message = req.params.m;
  res.send(messageToHash(message));
});
app.post('/messages', (req, res) => {
  var message = req.body['message'];
  if (!message) return res.sendStatus(404);
  res.send(messageToHash(message));
});

app.get('/messages/:h', (req, res) => {
  var hash = req.params.h;
  if (hash in storage) return res.send(storage[hash]);
  return res.sendStatus(404);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
