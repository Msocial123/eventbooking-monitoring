const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Adeebuddin';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define MongoDB Schema
const eventSchema = new mongoose.Schema({
  eventName: String,
  eventType: String,
  dateTime: Date,
  venue: String,
  description: String,
  price: Number,
  organizerName: String,
  organizerPhone: String,
});

const Event = mongoose.model('Event', eventSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  const { eventName, eventType, dateTime, venue, description, price, organizerName, organizerPhone } = req.body;

  const newEvent = new Event({
    eventName,
    eventType,
    dateTime,
    venue,
    description,
    price,
    organizerName,
    organizerPhone,
  });

  newEvent.save()
    .then((savedEvent) => {
      console.log('Event saved:', savedEvent);
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Event Booking Application</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: url('https://cdn.dribbble.com/users/879059/screenshots/4040043/ksam_concert_by_joakim_agervald.gif');

                background-size: cover;
                display: flex; 
                align-items: center;
                justify-content: center;
                height: 100vh;
              }

              .container {
                background-color: #ececee;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }

              h1 {
                color: #101011;
              }

              .info-box {
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 15px;
                margin-top: 20px;
              }

              .info-box p {
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Thank you for booking the event</h1>
              <div class="info-box">
                <p><strong>Event Name:</strong> ${eventName}</p>
                <p><strong>Event Type:</strong> ${eventType}</p>
                <p><strong>Date and Time:</strong> ${dateTime}</p>
                <p><strong>Venue:</strong> ${venue}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Price:</strong> ${price}</p>
                <p><strong>Organizer Name:</strong> ${organizerName}</p>
                <p><strong>Organizer Phone Number:</strong> ${organizerPhone}</p>
              </div>
            </div>
          </body>
        </html>
      `);
    })
    .catch((error) => {
      console.error('Error saving event:', error);
      res.status(500).send('Internal Server Error');
    });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Event Booking Application listening on port ${PORT}`);
});
