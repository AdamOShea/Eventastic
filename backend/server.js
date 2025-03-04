const express = require('express');
const { pool } = require('./models/db'); // Adjust the path as necessary
const userRouter = require('./routes/user');
const eventsRouter = require('./routes/events');
const mapsRouter = require('./routes/maps');


const app = express();
const port = 3000;
const hostname = '0.0.0.0';

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

app.use(express.json());
app.use(userRouter);
app.use(eventsRouter);
app.use(mapsRouter);


app.listen(port, hostname, () => {
  console.log(`Eventastic server listening on port ${hostname}:${port}`);
});
