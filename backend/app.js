const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
var cors = require('cors')
require('dotenv').config();

const {google} = require('googleapis');
const { calendar } = require('googleapis/build/src/apis/calendar');
const { token } = require('morgan');

const  GOOGLE_CLIENT_ID ='589061289971-73u6blrd4e6g64slcq8ia3pja5giv1ek.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:3000'
)

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

//app.post('/api/test', async(req,res) => {
  //  res.send("test");
//});

app.post('/api/create-tokens', async(req,res,next) => {
  try {
    console.log(req.body);
    const {code} = req.body
    const {tokens} = await oAuth2Client.getToken(code)
    res.send(tokens)
  } catch (error) {
    next(error)
  }
});
//app.use('/api', require('./routes/api.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
