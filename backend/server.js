const express = require('express');
const userRouter = require('./routes/user');
const eventsRouter = require('./routes/events');
const mapsRouter = require('./routes/maps');
const accommRouter = require('./routes/accommodation');
const flightsRouter = require('./routes/flights');
const tripsRouter = require('./routes/trips');
const friendsRouter = require('./routes/friends');

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
app.use(accommRouter);
app.use(flightsRouter);
app.use(tripsRouter);
app.use(friendsRouter);



app.listen(port, hostname, () => {
  console.log(`Eventastic server listening on port ${hostname}:${port}`);
});
