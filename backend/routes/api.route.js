const router = require('express').Router();
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

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/create-tokens', async(req,res,next) => {
try {
  const {code} = req.body
  const {tokens} = await oAuth2Client.getToken(code)
  res.send(tokens)
} catch (error) {
  next(error)
}

})

router.post('/test', async(req,res,next) => {
  try {
    console.log(req.body);
    res.send("test");
  } catch (error) {
    next(error)
  }
  
  })
router.post('/create-event', async(req, res, next) =>{
  try {
    const{
      summary,description,location,startDateTime,endDateTime
    } = req.body

    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
    const Calendar = google.calendar ('v3')
    const response = await calendar.events.insert({
      auth: oAuth2Client,
      calendarId: 'primary',
      requestBody: {
        summary:summary,
        description: description,
        location: location,
        colorId: '7',
        start: {
          daytime: new Date(startDateTime),
        },
        end: {
          dateTime: new Date(endDateTime)
        }
      }
    })
    res.send(response)
  } catch (error) {
    next(error)  
  }
})

module.exports = router;
