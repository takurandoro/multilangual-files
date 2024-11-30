const Queue = require('bull');

const fileQueue = new Queue('fileQueue', {
  redis: {
    host: '127.0.0.1', // Change this if your Redis server is hosted elsewhere
    port: 6379,
  },
});

// Listen for the 'ready' event to confirm connection
fileQueue.on('ready', () => {
  console.log('Connected to Redis and the queue is ready to process jobs.');
});

// Listen for the 'error' event to catch connection errors
fileQueue.on('error', (err) => {
  console.error('Failed to connect to Redis:', err);
});

module.exports = fileQueue;
