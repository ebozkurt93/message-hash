### How it works

- Given a message, just hashes and returns, meanwhile stores hash and message.
- Given a hash, checks if hash is stored, if it is stored returns that value, else calculates hash and returns it.
- All the storage is done in JS objects, which are used as hashtables.
- It has 4 endpoints.
  - `/all` - requires `GET` request, returns all hash/message pairs in an object
  - `/messages/message` - requires `POST` request, takes message from url parameters and returns hash value
  - `/messages` - requires `POST` request, assumes body is a JSON and parses body to find `message` key, takes that key and returns hash value. If there is no `message` key, returns 404 error.
  - `/messages/hash` - requires `GET` request, takes hash from url parameters and returns hash value. If it can't find hash value, returns 404 error.

### How to run

- If you have npm, just run `npm install --production && npm start` inside project folder.
- There is also a Dockerfile which you can build and run.

### How can you scale your implementation?

This implementation is pretty naive. It has one deployed instance, and the key/value pairs (key: hash, value:message) are stored at that single instance and also in memory. It also uses extra memory just to keep track of [key: message, hash: value] pairs, because if input is large SHA256 calculation will also take longer. When our stored message count is small, hash function will be the bottleneck. But if there are too many stored messages, it may be smarter to recalculate hash, or just use another mechanism for storing key/value pairs. For example we could use a bloom filter to check if we potentially have the hash value.

Depending on the scaling and requirements, this key value pairs can be stored in a single computer. For storing we can use an in memory key-value database like Redis. If one computer is not going to be enough, we can use multiple computers and do sharding. To ensure data persistence we could take snapshots of data periodicly, also log the write commands to rebuild our key-value database in case of a database failure.

### How did you deploy this application? How can you improve this process and make it easy to maintain?

- I used [now](https://zeit.co/now) to deploy it.
- If this was a project with more complexity, I could have used the Dockerfile to build images and deploy those. Also could have used docker-compose for both deployment and development.
