const express = require('express');
const { pool } = require('./models/db'); // Adjust the path as necessary
const userRouter = require('./routes/user');
const eventsRouter = require('./routes/events');
const cors = require('cors');

const allowedOrigins = [
  'exp://192.168.X.X:8081',
  'http://eventastic.tech:3000'
];


const app = express();
const port = 3000;
const hostname = '0.0.0.0';

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

app.use(express.json());
app.use(userRouter);
app.use(eventsRouter);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.listen(port, hostname, () => {
  console.log(`EireLive server listening on port ${hostname}:${port}`);
});









// app.post('/event', async (req, res) => {
//   // Validate the incoming JSON data
//   const { id, venue, eventlocation, seller, date, time, artist, eventtype, genre, price, eventlink } = req.body;
//   console.log(req.body);
//   // if (!title || !artist || !price) {
//   //   return res.status(400).send('One of the title, or artist, or price is missing in the data');
//   // }

//   try {
//     // try to send data to the database
//     const query = `
//       INSERT INTO albums (venue, eventlocation, seller, date, time, artist, eventtype, genre, price, eventlink)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
//       RETURNING id;
//     `;
//     const values = [id, venue, location, seller, date, time, artist, eventtype, genre, price, link];

//     const result = await pool.query(query, values);
//     res.status(201).send({ message: 'ticketmaster event stored', albumId: result.rows[0].id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('some error has occured');
//   }
// });


  // async function createAlbumsTable() {
  //   try {
  //     const query = `
  //       CREATE TABLE IF NOT EXISTS albums (
  //         id SERIAL PRIMARY KEY,
  //         title VARCHAR(255) NOT NULL,
  //         artist VARCHAR(255) NOT NULL,
  //         price NUMERIC(10, 2)
  //       );
  //     `;
  
  //     await pool.query(query);
  //     console.log('Albums table created');
  //   } catch (err) {
  //     console.error(err);
  //     console.error('Albums table creation failed');
  //   }
  // }
  
//createAlbumsTable();

// async function insertEvent() {
//   try {
//     const query = `
//       INSERT INTO public."Event"(
// 	venue, eventlocation, seller, date, "time", artist, eventtype, genre, price, eventlink)
// 	VALUES ('arena', 'dublin', 'tciketmaster', '2024-01-01', '18:00:00 GMT', 'skepta', 'music', 'rap', 40, 'test.com');
//     `;

//       await pool.query(query);
//       console.log('insert succ');
//     } catch (err) {
//       console.error(err);
//       console.error('insert failed');
//     }
// }

// async function fetchTmEvents() {
//   let errors = [];
//   let j = 0;
//   try {
//     axios.get('https://app.ticketmaster.com/discovery/v2/events.json?size=200&city=Dublin&classificationName=music&countryCode=IE&apikey=ZtosAxJhw16nAepNAh2DwX8LGRB01mVG')
//     .then(function (res) {
//       console.log(Object.keys(res.data._embedded.events).length)
//       for(let i = 0; i < Object.keys(res.data._embedded.events).length; i++) {
//         try {
          
//           if (res.data._embedded.events[i].hasOwnProperty('name')) {
//             console.log(res.data._embedded.events[i].name);
//           }
          
//         } catch (err) {
//           errors[j] = err;
//           j++;
//         }
        
//       }
      
//     }); } catch (err) {
//       console.log(err);
//     }
// }


//insertEvent();
//fetchTmEvents();